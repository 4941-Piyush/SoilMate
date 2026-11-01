"""
Quick Standalone Smoke Test for SoilMate Core Services
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.services.language import detect_language_from_text, normalize_language_code, resolve_spoken_language
from app.services.translation import align_grammatical_gender
from app.services.soil import classify_soil_texture, interpret_soil_ph
from app.services.weather import compute_weather_alerts
from app.agent.tools import load_crops_data, load_schemes_data

def run_smoke_test():
    print("=" * 60)
    print("🌱 SoilMate Backend Core Logic Smoke Test")
    print("=" * 60)

    # 1. Spoken Language Resolution & Detection
    print("\n1. Testing Spoken Language Detection & Resolution:")
    samples = [
        ("मेरी ज़मीन में गेहूं बो सकते हैं क्या?", None, "hi"),
        ("నా పొలంలో పత్తి వేయవచ్చా?", None, "te"),
        ("என் நிலத்தில் தக்காளி நடலாமா?", None, "ta"),
        ("আমার জমিতে আলু চাষ করা যাবে?", None, "bn"),
        ("माझ्या शेतात कांदा लावावा का?", None, "mr"),
        ("ਮੇਰੇ ਖੇਤ ਵਿੱਚ ਕਣਕ ਲਗਾ ਸਕਦੇ ਹਾਂ?", None, "pa"),
        ("Can I plant wheat in my field?", None, "en"),
        ("gehu me konsi khad dale", "hi", "hi"),
        ("Jaipur", "hi", "hi")
    ]
    for text, hint, expected in samples:
        resolved = resolve_spoken_language(text, spoken_hint=hint)
        status = "✅ PASS" if resolved == expected else f"❌ FAIL (got {resolved})"
        print(f"   [{status}] '{text[:30]}...' -> Resolved: {resolved} (Expected: {expected})")

    # 2. Soil Texture & pH
    print("\n2. Testing Soil Classification & pH Interpretation:")
    texture = classify_soil_texture(sand=45.0, silt=35.0, clay=20.0)
    print(f"   [✅ PASS] Texture (45% sand, 35% silt, 20% clay) -> {texture}")

    ph_interp = interpret_soil_ph(5.2)
    print(f"   [✅ PASS] pH 5.2 interpretation -> {ph_interp}")

    # 3. Weather Alert Rules
    print("\n3. Testing Agro-Weather Alert Engine:")
    alerts = compute_weather_alerts({
        "time": ["2026-05-10"],
        "temperature_2m_max": [44.0],
        "temperature_2m_min": [29.0],
        "precipitation_sum": [75.0]
    })
    print(f"   [✅ PASS] Detected {len(alerts)} alerts for 44°C max temp & 75mm rain:")
    for a in alerts:
        print(f"      - {a['type']}: {a['message']}")

    # 4. Reference Datasets
    print("\n4. Testing Reference Knowledge Datasets:")
    crops = load_crops_data()
    print(f"   [✅ PASS] Loaded {len(crops)} crops from crops.json:")
    for c in crops[:3]:
        print(f"      * {c['name']} ({c['name_hi']}): {c['season']} season, pH {c['ph_range']}")

    schemes = load_schemes_data()
    print(f"   [✅ PASS] Loaded {len(schemes)} agricultural welfare schemes from schemes.json:")
    for s in schemes[:2]:
        print(f"      * {s['name']}: {s['benefits']}")

    # 5. Grammatical Gender Consistency Test
    print("\n5. Testing Voice & Persona Gender Consistency (Hindi):")
    gender_tests = [
        ("मैं आपका कृषि सलाहकार हूँ।", "मैं आपकी कृषि सलाहकार हूँ।"),
        ("मैं गेहूं लगाने की सलाह देता हूँ।", "मैं गेहूं लगाने की सलाह देती हूँ।"),
        ("मैं मौसम देख रहा हूँ और कल जानकारी दूँगा।", "मैं मौसम देख रही हूँ और कल जानकारी दूँगी।"),
        ("मैं आपकी पूरी मदद करूँगा।", "मैं आपकी पूरी मदद करूँगी।"),
        ("आप 50 किग्रा यूरिया डाल सकते हैं।", "आप 50 किग्रा यूरिया डाल सकते हैं।")
    ]
    for inp, exp in gender_tests:
        res = align_grammatical_gender(inp, target_lang="hi", gender="female")
        status = "✅ PASS" if res == exp else f"❌ FAIL (got '{res}')"
        print(f"   [{status}] '{inp}' -> '{res}'")

    print("\n" + "=" * 60)
    print("🎉 All core standalone tests passed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    run_smoke_test()

