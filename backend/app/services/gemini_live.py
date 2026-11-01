import json
import asyncio
import logging
import time
from typing import Dict, Any, Optional
import websockets
from fastapi import WebSocket, WebSocketDisconnect

from app.config import settings
from app.services.gemini_pool import key_manager
from app.agent.prompts import SOILMATE_SYSTEM_PROMPT
from app.agent.tools import execute_tool
from app.db.repository import (
    create_or_update_session,
    save_message,
    get_session,
    get_session_messages,
    save_advisory
)

logger = logging.getLogger(__name__)

# Complete JSON tool declarations for Gemini Live BidiGenerateContent WebSocket
GEMINI_LIVE_TOOLS = [
    {
        "functionDeclarations": [
            {
                "name": "get_weather",
                "description": "Fetch live 7-day agro-meteorological forecast, temperature, rainfall, humidity, and weather alerts for farm coordinates.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "latitude": {"type": "NUMBER", "description": "Farm latitude coordinate"},
                        "longitude": {"type": "NUMBER", "description": "Farm longitude coordinate"}
                    },
                    "required": ["latitude", "longitude"]
                }
            },
            {
                "name": "get_soil_data",
                "description": "Fetch live soil properties (pH, organic carbon, nitrogen, sand/silt/clay %, soil texture) from ISRIC SoilGrids for farm coordinates.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "latitude": {"type": "NUMBER", "description": "Farm latitude coordinate"},
                        "longitude": {"type": "NUMBER", "description": "Farm longitude coordinate"}
                    },
                    "required": ["latitude", "longitude"]
                }
            },
            {
                "name": "get_mandi_prices",
                "description": "Fetch real-time commodity mandi market prices from Agmarknet (data.gov.in) across APMC mandis.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "state": {"type": "STRING", "description": "State name (e.g. 'Haryana', 'Punjab', 'Madhya Pradesh', 'Maharashtra')"},
                        "commodity": {"type": "STRING", "description": "Commodity/crop name in English (e.g. 'Wheat', 'Mustard', 'Paddy', 'Cotton')"}
                    },
                    "required": ["state", "commodity"]
                }
            },
            {
                "name": "query_crop_database",
                "description": "Query ICAR crop agronomy database for seasonal suitability, sowing windows, water needs, and fertilizer recommendations.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "season": {"type": "STRING", "description": "Season: 'kharif', 'rabi', or 'zaid'"},
                        "soil_type": {"type": "STRING", "description": "Soil type (e.g. 'Loamy', 'Sandy Loam', 'Clayey')"},
                        "state": {"type": "STRING", "description": "State name to filter regional crops"}
                    }
                }
            },
            {
                "name": "get_pest_and_disease_risk",
                "description": "Analyze pest and disease risks for crops based on current temperature, humidity, and rainfall conditions.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "crop": {"type": "STRING", "description": "Crop name (e.g. 'Wheat', 'Mustard', 'Paddy', 'Cotton')"},
                        "temp_max": {"type": "NUMBER", "description": "Max temperature in Celsius"},
                        "humidity": {"type": "NUMBER", "description": "Relative humidity percentage"},
                        "rainfall": {"type": "NUMBER", "description": "Rainfall in mm"}
                    },
                    "required": ["crop"]
                }
            },
            {
                "name": "get_government_schemes",
                "description": "Look up Central & State Government farmer subsidy and insurance schemes (PM-KISAN, PMFBY, drip irrigation).",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "query": {"type": "STRING", "description": "Keywords like 'drip', 'subsidy', 'insurance', 'loan'"}
                    }
                }
            },
            {
                "name": "update_farmer_profile",
                "description": "Persistently remember farmer's village, district, state, acreage, crops, and soil. Automatically geocodes location.",
                "parameters": {
                    "type": "OBJECT",
                    "properties": {
                        "location_name": {"type": "STRING", "description": "Name of village, town, district, or state"},
                        "state": {"type": "STRING", "description": "Indian state name"},
                        "district": {"type": "STRING", "description": "District name"},
                        "land_size_acres": {"type": "NUMBER", "description": "Land size in acres"},
                        "primary_crops": {"type": "STRING", "description": "Crops cultivated"},
                        "soil_type": {"type": "STRING", "description": "Soil texture"}
                    }
                }
            }
        ]
    }
]

async def safe_close_ws(ws):
    """Safely close a websocket connection without raising AttributeError or state errors."""
    if ws is not None:
        try:
            await ws.close()
        except Exception:
            pass

async def handle_gemini_live_websocket(client_ws: WebSocket):
    """
    Bidirectional WebSocket proxy connecting client browser directly to Google Gemini Multimodal Live API.
    Streams 16kHz PCM audio and text from the client to Gemini, and streams back 24kHz native audio
    and real-time tool traces to the client with sub-second conversational latency.
    """
    await client_ws.accept()
    logger.info("[GeminiLive] Client connected to live WebSocket.")

    api_key = key_manager.get_active_key()
    if not api_key:
        await client_ws.send_json({
            "type": "error",
            "message": "No Google Gemini API key configured. Please configure GEMINI_API_KEY in backend/.env"
        })
        await client_ws.close()
        return

    # Determine live model candidates from settings and available Google Live API models
    configured_live = (
        getattr(settings, "gemini_live_model", None) or
        os.getenv("GEMINI_LIVE_MODEL") or
        settings.gemini_model.strip() or
        "gemini-3.1-flash-live-preview"
    ).strip()

    # Context session metadata
    session_id = None
    ui_language = "hi"
    location_ctx = None
    farmer_profile = {}

    google_ws = None

    try:
        # 1. Wait for initial client handshake message
        init_raw = await client_ws.receive_text()
        init_data = json.loads(init_raw)

        session_id = init_data.get("session_id")
        ui_language = init_data.get("language") or "hi"
        location_ctx = init_data.get("location")

        # Load existing session from SQLite if available
        if session_id:
            sess = await get_session(session_id)
            if sess:
                farmer_profile = {
                    "location_name": sess.get("location_name"),
                    "latitude": sess.get("latitude"),
                    "longitude": sess.get("longitude"),
                    "state": sess.get("state"),
                    "district": sess.get("district"),
                    "land_size_acres": sess.get("land_size_acres"),
                    "primary_crop": sess.get("primary_crop"),
                    "soil_type": sess.get("soil_type")
                }
        else:
            new_sess = await create_or_update_session(language=ui_language)
            session_id = new_sess.get("id")

        # Build dynamic context for Gemini System Instruction
        context_block = f"\n\nCURRENT SESSION CONTEXT:\n- Session ID: {session_id}\n- Farmer's UI/Spoken Language: {ui_language}\n"
        if location_ctx:
            context_block += f"- Active Farm Location: {location_ctx.get('name')} (lat: {location_ctx.get('lat')}, lon: {location_ctx.get('lon')})\n"
        if farmer_profile.get("location_name"):
            context_block += f"- Saved Farm Profile: {json.dumps(farmer_profile, ensure_ascii=False)}\n"

        system_instruction_text = (
            f"{SOILMATE_SYSTEM_PROMPT}\n{context_block}\n"
            f"IMPORTANT FOR REAL-TIME VOICE: Speak naturally, warmly, and in short 2-3 sentence conversational turns. "
            f"Address the farmer in {ui_language} with high respect and warmth (Priya persona). "
            f"Do not recite long bullet lists; ask engaging follow-up questions to converse like a real person."
        )

        # Candidate live model list: prioritize fastest, highest-quality Live API models
        candidate_models = []
        if configured_live:
            cand = configured_live if configured_live.startswith("models/") else f"models/{configured_live}"
            candidate_models.append(cand)

        for default_m in [
            "models/gemini-3.1-flash-live-preview",
            "models/gemini-2.5-flash-native-audio-latest",
            "models/gemini-2.5-flash-native-audio-preview-12-2025",
            "models/gemini-2.0-flash-exp",
            "models/gemini-2.0-flash"
        ]:
            if default_m not in candidate_models:
                candidate_models.append(default_m)

        # 2. Connect to Google Gemini BidiGenerateContent WebSocket
        google_url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={api_key}"

        setup_payload = {
            "setup": {
                "model": candidate_models[0],
                "generationConfig": {
                    "responseModalities": ["AUDIO"],
                    "speechConfig": {
                        "voiceConfig": {
                            "prebuiltVoiceConfig": {
                                "voiceName": "Aoede" # Warm female voice for Priya
                            }
                        }
                    }
                },
                "systemInstruction": {
                    "parts": [{"text": system_instruction_text}]
                },
                "tools": GEMINI_LIVE_TOOLS
            }
        }

        connected = False
        active_model = None
        for cand_model in candidate_models:
            await safe_close_ws(google_ws)
            google_ws = None
            try:
                setup_payload["setup"]["model"] = cand_model
                google_ws = await websockets.connect(google_url, ping_interval=20, ping_timeout=20)
                await google_ws.send(json.dumps(setup_payload))
                init_resp = await asyncio.wait_for(google_ws.recv(), timeout=7.0)
                logger.info(f"[GeminiLive] Connected successfully to Live API using model: {cand_model}")
                connected = True
                active_model = cand_model
                break
            except Exception as conn_err:
                logger.warning(f"[GeminiLive] Model {cand_model} failed for Live API: {conn_err}. Trying next fallback...")
                await safe_close_ws(google_ws)
                google_ws = None

        if not connected or not google_ws:
            raise RuntimeError(f"Could not connect to Google Gemini Live API with candidate models: {candidate_models}")

        print(f"[GeminiLive] Connected to Live API with {active_model}. Session {session_id} ready.", flush=True)

        # Notify client that connection is ready
        await client_ws.send_json({
            "type": "ready",
            "session_id": session_id,
            "model": active_model
        })

        # Track conversation turns for database persistence
        current_turn_user_text = []
        current_turn_model_text = []
        current_turn_tool_traces = []

        # ==========================================
        # TASK 1: Client -> Google Gemini
        # ==========================================
        async def client_to_google():
            nonlocal current_turn_user_text
            try:
                while True:
                    data = await client_ws.receive_json()
                    msg_type = data.get("type")

                    if msg_type == "audio":
                        # Raw base64 16kHz PCM audio chunk from farmer mic
                        b64_pcm = data.get("data")
                        if b64_pcm and google_ws:
                            media_chunk = {
                                "realtimeInput": {
                                    "mediaChunks": [
                                        {
                                            "mimeType": "audio/pcm;rate=16000",
                                            "data": b64_pcm
                                        }
                                    ]
                                }
                            }
                            await google_ws.send(json.dumps(media_chunk))

                    elif msg_type == "text":
                        # Text query from farmer
                        text_str = data.get("text", "").strip()
                        if text_str and google_ws:
                            current_turn_user_text.append(text_str)
                            client_content = {
                                "clientContent": {
                                    "turns": [
                                        {
                                            "role": "user",
                                            "parts": [{"text": text_str}]
                                        }
                                    ],
                                    "turnComplete": True
                                }
                            }
                            await google_ws.send(json.dumps(client_content))

                    elif msg_type == "ping":
                        await client_ws.send_json({"type": "pong"})

                    elif msg_type == "interrupt":
                        # Client signal that user interrupted or tapped mic
                        logger.info("[GeminiLive] User interrupted active model turn.")

            except (WebSocketDisconnect, websockets.ConnectionClosed):
                pass
            except Exception as e:
                print(f"[GeminiLive client_to_google] Notice: {e}", flush=True)

        # ==========================================
        # TASK 2: Google Gemini -> Client
        # ==========================================
        async def google_to_client():
            nonlocal current_turn_user_text, current_turn_model_text, current_turn_tool_traces, farmer_profile
            try:
                async for raw_msg in google_ws:
                    resp_json = json.loads(raw_msg)

                    # 1. Model Text & Audio Output
                    server_content = resp_json.get("serverContent")
                    if server_content:
                        model_turn = server_content.get("modelTurn")
                        if model_turn:
                            parts = model_turn.get("parts", [])
                            for p in parts:
                                # Stream text chunk
                                if "text" in p and p["text"]:
                                    chunk_text = p["text"]
                                    current_turn_model_text.append(chunk_text)
                                    await client_ws.send_json({
                                        "type": "text",
                                        "text": chunk_text
                                    })

                                # Stream raw 24kHz PCM audio chunk for instant playback
                                if "inlineData" in p:
                                    audio_chunk = p["inlineData"].get("data")
                                    if audio_chunk:
                                        await client_ws.send_json({
                                            "type": "audio",
                                            "data": audio_chunk
                                        })

                        # True real-time interruption signal
                        if server_content.get("interrupted"):
                            await client_ws.send_json({"type": "interrupted"})

                        # Turn completion: persist to SQLite database
                        if server_content.get("turnComplete"):
                            user_full = " ".join(current_turn_user_text).strip() or "Voice Input"
                            model_full = "".join(current_turn_model_text).strip() or "Live Voice Response"

                            if user_full or model_full:
                                # Save user message
                                await save_message(
                                    session_id=session_id,
                                    role="user",
                                    content=user_full,
                                    language=ui_language
                                )
                                # Save assistant message with tool traces
                                await save_message(
                                    session_id=session_id,
                                    role="assistant",
                                    content=model_full,
                                    language=ui_language,
                                    tool_calls=current_turn_tool_traces
                                )

                            await client_ws.send_json({
                                "type": "turn_complete",
                                "session_id": session_id,
                                "farmer_profile": farmer_profile
                            })

                            # Reset turn buffers
                            current_turn_user_text = []
                            current_turn_model_text = []
                            current_turn_tool_traces = []

                    # 2. Dynamic Autonomous Function / Tool Calling
                    tool_call = resp_json.get("toolCall")
                    if tool_call:
                        func_calls = tool_call.get("functionCalls", [])
                        function_responses = []

                        for call in func_calls:
                            call_name = call.get("name")
                            call_id = call.get("id")
                            call_args = call.get("args", {})

                            t0 = time.time()
                            # Emit live progress to client UI monitor
                            await client_ws.send_json({
                                "type": "tool_start",
                                "tool": call_name,
                                "args": call_args,
                                "summary": f"Executing {call_name}..."
                            })

                            # Execute tool asynchronously in Python
                            tool_result = await execute_tool(call_name, call_args)
                            dur_ms = int((time.time() - t0) * 1000)

                            # Handle farmer profile memory update
                            if call_name == "update_farmer_profile" and isinstance(tool_result, dict):
                                farmer_profile.update({
                                    "location_name": tool_result.get("location_name"),
                                    "latitude": tool_result.get("latitude"),
                                    "longitude": tool_result.get("longitude"),
                                    "state": tool_result.get("state"),
                                    "district": tool_result.get("district"),
                                    "land_size_acres": tool_result.get("land_size_acres"),
                                    "primary_crop": tool_result.get("primary_crops"),
                                    "soil_type": tool_result.get("soil_type")
                                })
                                # Persist to SQLite
                                await create_or_update_session(
                                    session_id=session_id,
                                    location_name=tool_result.get("location_name"),
                                    latitude=tool_result.get("latitude"),
                                    longitude=tool_result.get("longitude"),
                                    state=tool_result.get("state"),
                                    district=tool_result.get("district"),
                                    land_size_acres=tool_result.get("land_size_acres"),
                                    primary_crop=tool_result.get("primary_crops"),
                                    soil_type=tool_result.get("soil_type")
                                )

                            summary_msg = f"{call_name} completed in {dur_ms}ms"
                            current_turn_tool_traces.append({
                                "tool": call_name,
                                "inputs": call_args,
                                "outputs": tool_result,
                                "duration_ms": dur_ms,
                                "status": "success" if "error" not in tool_result else "error",
                                "summary": summary_msg
                            })

                            await client_ws.send_json({
                                "type": "tool_end",
                                "tool": call_name,
                                "summary": summary_msg,
                                "data": tool_result,
                                "duration_ms": dur_ms
                            })

                            function_responses.append({
                                "response": {"output": tool_result},
                                "id": call_id
                            })

                        # Send tool responses back to Gemini
                        tool_resp_payload = {
                            "toolResponse": {
                                "functionResponses": function_responses
                            }
                        }
                        await google_ws.send(json.dumps(tool_resp_payload))

            except (WebSocketDisconnect, websockets.ConnectionClosed):
                pass
            except Exception as e:
                logger.error(f"[GeminiLive google_to_client] Error: {e}")

        # Run both directions concurrently with prompt cleanup on first exit
        client_task = asyncio.create_task(client_to_google())
        google_task = asyncio.create_task(google_to_client())

        done, pending = await asyncio.wait(
            [client_task, google_task],
            return_when=asyncio.FIRST_COMPLETED
        )
        for task in pending:
            task.cancel()

    except Exception as e:
        logger.error(f"[handle_gemini_live_websocket] Fatal: {e}")
        try:
            await client_ws.send_json({"type": "error", "message": str(e)})
        except Exception:
            pass
    finally:
        await safe_close_ws(google_ws)
        try:
            await client_ws.close()
        except Exception:
            pass
        logger.info("[GeminiLive] Session closed.")

