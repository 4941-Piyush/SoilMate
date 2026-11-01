import json
import os
import time
from typing import Dict, Any, List
from google.genai import types

from app.services.weather import get_weather_forecast, geocode_location
from app.services.soil import get_soil_properties
from app.services.mandi import get_mandi_prices

# Define tool schemas for Gemini Function Calling
weather_decl = types.FunctionDeclaration(
    name="get_weather",
    description="Fetch live 7-day weather forecast, temperature, rainfall, humidity, and agro-weather alerts for a location.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "latitude": types.Schema(type="NUMBER", description="Latitude coordinate of the farm/village"),
            "longitude": types.Schema(type="NUMBER", description="Longitude coordinate of the farm/village")
        },
        required=["latitude", "longitude"]
    )
)

soil_decl = types.FunctionDeclaration(
    name="get_soil_data",
    description="Fetch live soil properties (pH, texture, sand/silt/clay %, organic carbon, nitrogen) from ISRIC SoilGrids.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "latitude": types.Schema(type="NUMBER", description="Latitude coordinate"),
            "longitude": types.Schema(type="NUMBER", description="Longitude coordinate")
        },
        required=["latitude", "longitude"]
    )
)

mandi_decl = types.FunctionDeclaration(
    name="get_mandi_prices",
    description="Fetch live commodity prices across APMC mandis from Agmarknet (data.gov.in) with price comparisons.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "state": types.Schema(type="STRING", description="Indian state name (e.g. 'Rajasthan', 'Madhya Pradesh', 'Maharashtra')"),
            "commodity": types.Schema(type="STRING", description="Crop/commodity name in English (e.g. 'Wheat', 'Mustard', 'Soybean', 'Onion')")
        },
        required=["state", "commodity"]
    )
)

crops_decl = types.FunctionDeclaration(
    name="query_crop_database",
    description="Query ICAR crop agronomy database for crop suitability, sowing windows, water needs, and fertilizer recommendations.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "season": types.Schema(type="STRING", description="Farming season: 'kharif' (monsoon), 'rabi' (winter), or 'zaid' (summer)"),
            "soil_type": types.Schema(type="STRING", description="Soil texture type (e.g. 'Loamy', 'Sandy Loam', 'Clayey', 'Clay Loam')"),
            "state": types.Schema(type="STRING", description="Optional state name to filter regional crops")
        }
    )
)

pest_decl = types.FunctionDeclaration(
    name="get_pest_and_disease_risk",
    description="Analyze pest and disease vulnerability for a specific crop under current temperature, humidity, and rainfall conditions.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "crop": types.Schema(type="STRING", description="Crop name (e.g. 'Paddy', 'Cotton', 'Wheat', 'Soybean')"),
            "temp_max": types.Schema(type="NUMBER", description="Maximum temperature in Celsius"),
            "humidity": types.Schema(type="NUMBER", description="Relative humidity percentage"),
            "rainfall": types.Schema(type="NUMBER", description="Precipitation in mm")
        },
        required=["crop"]
    )
)

schemes_decl = types.FunctionDeclaration(
    name="get_government_schemes",
    description="Look up eligible Central and State Government agricultural subsidy, insurance (PMFBY), and income support (PM-KISAN) schemes.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "query": types.Schema(type="STRING", description="Keywords such as 'income', 'insurance', 'soil test', 'drip irrigation', 'loan'")
        }
    )
)

profile_decl = types.FunctionDeclaration(
    name="update_farmer_profile",
    description="Save or update the farmer's profile, location (village, district, or state), land size, soil type, and primary crops. Automatically geocodes location coordinates.",
    parameters=types.Schema(
        type="OBJECT",
        properties={
            "location_name": types.Schema(type="STRING", description="Name of village, town, district or state mentioned by the farmer (e.g. 'Nashik', 'Sehore, MP', 'Guntur, AP', 'Punjab')"),
            "state": types.Schema(type="STRING", description="Indian state name if recognized (e.g. 'Maharashtra', 'Madhya Pradesh', 'Punjab')"),
            "district": types.Schema(type="STRING", description="District name if recognized"),
            "land_size_acres": types.Schema(type="NUMBER", description="Size of farmer's landholding in acres if mentioned"),
            "primary_crops": types.Schema(type="STRING", description="Crop(s) currently cultivated or planned (e.g. 'Wheat', 'Mustard', 'Cotton')"),
            "soil_type": types.Schema(type="STRING", description="Soil texture/type described by farmer (e.g. 'Black soil', 'Sandy loam', 'Clayey')")
        }
    )
)

AGENT_TOOLS = types.Tool(function_declarations=[
    weather_decl,
    soil_decl,
    mandi_decl,
    crops_decl,
    pest_decl,
    schemes_decl,
    profile_decl
])

# Load local datasets for reference tools
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_crops_data() -> List[Dict[str, Any]]:
    path = os.path.join(DATA_DIR, "crops.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f).get("crops", [])
    return []

def load_schemes_data() -> List[Dict[str, Any]]:
    path = os.path.join(DATA_DIR, "schemes.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f).get("schemes", [])
    return []

async def execute_tool(name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    """Central async tool dispatcher."""
    t0 = time.time()
    try:
        if name == "get_weather":
            lat = float(args.get("latitude", 26.91))
            lon = float(args.get("longitude", 75.79))
            res = await get_weather_forecast(lat, lon)
            return res

        elif name == "get_soil_data":
            lat = float(args.get("latitude", 26.91))
            lon = float(args.get("longitude", 75.79))
            res = await get_soil_properties(lat, lon)
            return res

        elif name == "get_mandi_prices":
            state = str(args.get("state", ""))
            commodity = str(args.get("commodity", ""))
            res = await get_mandi_prices(state, commodity)
            return res

        elif name == "query_crop_database":
            season = args.get("season", "").lower().strip()
            soil = args.get("soil_type", "").lower().strip()
            state = args.get("state", "").lower().strip()

            all_crops = load_crops_data()
            matched = []
            for c in all_crops:
                # Filter by season if provided
                if season and season not in c.get("season", "").lower():
                    continue
                # Filter by soil type if provided
                if soil:
                    soil_matches = any(soil in s.lower() for s in c.get("soil_types", []))
                    if not soil_matches:
                        continue
                # Filter by state if provided
                if state:
                    state_matches = any(state in st.lower() for st in c.get("major_states", []))
                    if not state_matches:
                        continue
                matched.append(c)

            return {
                "matched_crops": matched if matched else all_crops[:5],
                "count": len(matched),
                "season": season,
                "soil_filter": soil
            }

        elif name == "get_pest_and_disease_risk":
            crop = str(args.get("crop", "")).capitalize()
            temp = float(args.get("temp_max") or 30.0)
            hum = float(args.get("humidity") or 70.0)
            rain = float(args.get("rainfall") or 0.0)

            risks = []
            if hum >= 80.0 and (22.0 <= temp <= 32.0):
                risks.append({
                    "condition": "Fungal Blight / Blast",
                    "severity": "High",
                    "recommendation": "Avoid overhead sprinkler irrigation; spray prophylactic Copper Oxychloride (2.5 g/L) or Carbendazim (1 g/L) if lesions appear."
                })
            if rain >= 50.0:
                risks.append({
                    "condition": "Root Rot / Damping Off",
                    "severity": "High",
                    "recommendation": "Ensure zero standing water; dig field drainage ditches immediately."
                })
            if temp >= 35.0 and hum <= 50.0:
                risks.append({
                    "condition": "Sucking Pests (Whitefly, Thrips, Aphids)",
                    "severity": "Medium",
                    "recommendation": "Install yellow sticky traps (10 per acre); spray Neem oil (5ml/L) early in the morning."
                })

            if not risks:
                risks.append({
                    "condition": "Normal Seasonal Monitoring",
                    "severity": "Low",
                    "recommendation": "Inspect crop undersides weekly. No severe weather-driven pest outbreak detected."
                })

            return {
                "crop": crop,
                "conditions": {"temp": temp, "humidity": hum, "rain": rain},
                "identified_risks": risks
            }

        elif name == "get_government_schemes":
            q = str(args.get("query", "")).lower().strip()
            all_schemes = load_schemes_data()
            if not q:
                return {"schemes": all_schemes}
            matched = [
                s for s in all_schemes 
                if q in s.get("name", "").lower() 
                or q in s.get("description", "").lower() 
                or q in s.get("benefits", "").lower()
            ]
            return {"schemes": matched if matched else all_schemes}

        elif name == "update_farmer_profile":
            loc = args.get("location_name")
            geocoded = None
            if loc:
                geocoded = await geocode_location(loc)

            lat = geocoded["lat"] if geocoded else None
            lon = geocoded["lon"] if geocoded else None
            norm_name = geocoded["name"] if geocoded else loc
            state = geocoded.get("state") if (geocoded and geocoded.get("state")) else args.get("state")

            return {
                "status": "profile_updated",
                "location_name": norm_name,
                "latitude": lat,
                "longitude": lon,
                "state": state,
                "district": args.get("district"),
                "land_size_acres": args.get("land_size_acres"),
                "primary_crops": args.get("primary_crops"),
                "soil_type": args.get("soil_type"),
                "message": f"Successfully updated and remembered profile for {norm_name or 'farmer'}."
            }

        else:
            return {"error": f"Unknown tool '{name}'"}

    except Exception as e:
        return {"error": f"Tool '{name}' execution failed: {str(e)}"}

