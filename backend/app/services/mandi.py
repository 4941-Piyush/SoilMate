from typing import Dict, Any, List
import httpx
from app.config import settings

async def get_mandi_prices(state: str, commodity: str) -> Dict[str, Any]:
    """
    Fetch APMC mandi commodity prices from Open Government Data (data.gov.in)
    Dataset: Current Daily Price of Various Commodities from Various Markets (Mandi)
    Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
    """
    api_key = settings.data_gov_api_key.strip()
    resource_id = settings.data_gov_resource_id.strip() or "9ef84268-d588-465a-a308-a864a43d0070"
    
    if not api_key:
        return {
            "commodity": commodity,
            "state": state,
            "markets": [],
            "best_market": None,
            "total_found": 0,
            "note": "Live mandi price integration requires DATA_GOV_API_KEY in .env. Visit https://data.gov.in to obtain your key."
        }

    clean_commodity = commodity.strip().capitalize()
    url = f"https://api.data.gov.in/resource/{resource_id}"
    
    # Standard OAS 2.0 query parameters matching data.gov.in schema
    params = {
        "api-key": api_key,
        "format": "json",
        "offset": 0,
        "limit": 20,
        "filters[commodity]": clean_commodity
    }
    
    clean_state = state.strip() if state else ""
    if clean_state:
        # data.gov.in uses filters[state.keyword] for exact state match
        params["filters[state.keyword]"] = clean_state

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=12.0)
            
            # If state filter yielded 0 results, retry without state filter to find national quotes
            data = resp.json() if resp.status_code == 200 else {}
            records = data.get("records", [])

            if not records and "filters[state.keyword]" in params:
                params.pop("filters[state.keyword]")
                retry_resp = await client.get(url, params=params, timeout=10.0)
                if retry_resp.status_code == 200:
                    data = retry_resp.json()
                    records = data.get("records", [])

            if resp.status_code != 200 and not records:
                return {
                    "commodity": commodity,
                    "state": state,
                    "markets": [],
                    "best_market": None,
                    "total_found": 0,
                    "note": f"Mandi API returned HTTP {resp.status_code}. Details: {resp.text[:150]}"
                }

        markets: List[Dict[str, Any]] = []

        for r in records:
            try:
                # Handle both lowercase and TitleCase keys returned by OGD platform
                min_p = float(r.get("min_price") or r.get("Min_Price") or 0)
                max_p = float(r.get("max_price") or r.get("Max_Price") or 0)
                modal_p = float(r.get("modal_price") or r.get("Modal_Price") or 0)
                
                m_market = r.get("market") or r.get("Market") or "Unknown APMC"
                m_district = r.get("district") or r.get("District") or ""
                m_state = r.get("state") or r.get("State") or state
                m_commodity = r.get("commodity") or r.get("Commodity") or clean_commodity
                m_variety = r.get("variety") or r.get("Variety") or "Common"
                m_date = r.get("arrival_date") or r.get("Arrival_Date") or ""

                markets.append({
                    "market": m_market,
                    "district": m_district,
                    "state": m_state,
                    "commodity": m_commodity,
                    "variety": m_variety,
                    "min_price": min_p,
                    "max_price": max_p,
                    "modal_price": modal_p,
                    "date": m_date
                })
            except (ValueError, TypeError):
                continue

        # Sort descending by modal price so the best-paying APMC market is ranked #1
        markets.sort(key=lambda m: m["modal_price"], reverse=True)
        best_market = markets[0] if markets else None

        return {
            "commodity": clean_commodity,
            "state": state,
            "markets": markets[:8],
            "best_market": best_market,
            "total_found": len(records),
            "note": f"Retrieved {len(records)} live market quotes from Agmarknet."
        }
    except Exception as e:
        print(f"[get_mandi_prices] error: {e}")
        return {
            "commodity": commodity,
            "state": state,
            "markets": [],
            "best_market": None,
            "total_found": 0,
            "note": f"Error querying mandi prices: {str(e)}"
        }
