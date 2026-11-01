import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ No GEMINI_API_KEY found in backend/.env")
    exit(1)

client = genai.Client(api_key=api_key)

print("=" * 65)
print("🔍 Fetching all accessible Gemini models for your API key...")
print("=" * 65 + "\n")

try:
    models = list(client.models.list())
    content_models = []
    for m in models:
        name = getattr(m, "name", str(m))
        clean_name = name.replace("models/", "")
        actions = getattr(m, "supported_actions", []) or getattr(m, "supported_generation_methods", [])
        disp = getattr(m, "display_name", "")
        # Filter for content generation models
        if "generateContent" in actions or not actions or "flash" in clean_name or "pro" in clean_name:
            content_models.append((clean_name, disp))

    print(f"✅ Found {len(content_models)} models supporting text generation:\n")
    for name, disp in content_models:
        print(f"  • {name:<35} | {disp}")

    print("\n" + "-" * 65)
    print("Testing live availability on candidate models:")
    print("-" * 65)
    test_candidates = [
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro"
    ]
    for candidate in test_candidates:
        try:
            resp = client.models.generate_content(
                model=candidate,
                contents="Reply with 'Ready'."
            )
            txt = resp.text.strip() if hasattr(resp, "text") and resp.text else "Ready"
            print(f"  ✅ {candidate:<24} -> Ready & Responding! ('{txt}')")
        except Exception as e:
            err = str(e).split("\n")[0][:70]
            print(f"  ⚠️ {candidate:<24} -> Status: {err}")

    print("\n" + "=" * 65)
    print("👉 To set your chosen model, update GEMINI_MODEL in backend/.env")
    print("=" * 65)

except Exception as e:
    print(f"❌ Error querying Gemini API: {e}")
