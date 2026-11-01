import base64
import logging
from typing import Dict, Any, Optional
import httpx
from app.config import settings
from app.services.language import normalize_language_code
from app.services.translation import SARVAM_LANG_MAP

logger = logging.getLogger(__name__)

async def speech_to_text(audio_bytes: bytes, filename: str = "audio.wav", language_hint: Optional[str] = None) -> Dict[str, Any]:
    """
    Transcribe audio stream into text using Sarvam Saaras v2 STT.
    Returns transcribed text and detected language.
    """
    sarvam_key = settings.sarvam_api_key.strip()
    if not sarvam_key:
        return {
            "text": "",
            "language": language_hint or "hi",
            "error": "SARVAM_API_KEY not configured. Speech-to-text requires Sarvam AI API key."
        }

    lang_code = SARVAM_LANG_MAP.get(normalize_language_code(language_hint), "hi-IN")
    url = "https://api.sarvam.ai/speech-to-text"
    headers = {
        "api-subscription-key": sarvam_key
    }
    
    files = {
        "file": (filename, audio_bytes, "audio/wav")
    }
    data = {
        "model": "saaras:v2",
        "language_code": lang_code
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=headers, files=files, data=data, timeout=15.0)
            if resp.status_code == 200:
                result = resp.json()
                transcript = result.get("transcript", "")
                detected = result.get("language_code", lang_code).split("-")[0]
                return {
                    "text": transcript.strip(),
                    "language": detected,
                    "confidence": result.get("confidence", 0.95)
                }
            else:
                logger.error(f"[speech_to_text] Sarvam STT returned status {resp.status_code}: {resp.text}")
                return {
                    "text": "",
                    "language": normalize_language_code(language_hint),
                    "error": f"STT failed with HTTP {resp.status_code}"
                }
    except Exception as e:
        logger.error(f"[speech_to_text] Error: {e}")
        return {
            "text": "",
            "language": normalize_language_code(language_hint),
            "error": str(e)
        }

async def text_to_speech(text: str, language: str = "hi") -> Optional[str]:
    """
    Synthesize text into natural voice audio using Sarvam Bulbul v2 TTS.
    Returns base64-encoded WAV audio string.
    """
    sarvam_key = settings.sarvam_api_key.strip()
    if not sarvam_key or not text.strip():
        return None

    lang_iso = normalize_language_code(language)
    lang_code = SARVAM_LANG_MAP.get(lang_iso, "hi-IN")
    
    # Truncate text for TTS if overly long (first 400 chars) for prompt latency
    tts_text = text[:400].strip()

    url = "https://api.sarvam.ai/text-to-speech"
    headers = {
        "api-subscription-key": sarvam_key,
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": [tts_text],
        "target_language_code": lang_code,
        "speaker": settings.sarvam_speaker,
        "model": "bulbul:v3",
        "pace": 1.0,
        "temperature": 0.6
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, headers=headers, json=payload, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                audios = data.get("audios", [])
                if audios and len(audios) > 0:
                    return audios[0] # Already base64 encoded by Sarvam API
            else:
                logger.warning(f"[text_to_speech] Sarvam TTS status {resp.status_code}: {resp.text[:120]}")
    except Exception as e:
        logger.error(f"[text_to_speech] TTS error: {e}")

    return None

