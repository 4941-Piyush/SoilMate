from app.services.soil import classify_soil_texture, interpret_soil_ph
from app.services.weather import compute_weather_alerts

def test_soil_texture_classification():
    assert classify_soil_texture(sand=90.0, silt=5.0, clay=5.0) == "Sandy"
    assert classify_soil_texture(sand=20.0, silt=20.0, clay=60.0) == "Clayey"
    assert classify_soil_texture(sand=40.0, silt=40.0, clay=20.0) == "Loam"
    assert classify_soil_texture(sand=55.0, silt=30.0, clay=15.0) == "Sandy Loam"

def test_soil_ph_interpretation():
    assert "acidic" in interpret_soil_ph(5.2).lower()
    assert "neutral" in interpret_soil_ph(7.0).lower()
    assert "alkaline" in interpret_soil_ph(8.2).lower()

def test_weather_alerts_heatwave():
    daily = {
        "time": ["2026-05-01"],
        "temperature_2m_max": [43.5],
        "temperature_2m_min": [28.0],
        "precipitation_sum": [0.0]
    }
    alerts = compute_weather_alerts(daily)
    assert any(a["type"] == "HEATWAVE_WARNING" for a in alerts)

def test_weather_alerts_heavy_rain():
    daily = {
        "time": ["2026-07-15"],
        "temperature_2m_max": [29.0],
        "temperature_2m_min": [24.0],
        "precipitation_sum": [65.0]
    }
    alerts = compute_weather_alerts(daily)
    assert any(a["type"] == "HEAVY_RAIN_ALERT" for a in alerts)

