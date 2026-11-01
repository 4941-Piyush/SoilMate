import json
import asyncio
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import settings
from app.db.database import init_db
from app.db.repository import (
    list_sessions,
    get_session,
    get_session_messages,
    list_advisories,
    get_advisory,
    delete_session,
    delete_advisory
)
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    ProgressEvent,
    SessionSummary,
    MessageRecord,
    AdvisorySummary,
    AdvisoryDetail,
    WeatherResponse,
    SoilResponse,
    MandiResponse,
    GeocodeResponse,
    TTSRequest,
    TTSResponse,
    STTResponse
)
from app.services.gemini_pool import key_manager
from app.services.weather import get_weather_forecast, geocode_location
from app.services.soil import get_soil_properties
from app.services.mandi import get_mandi_prices
from app.services.voice import speech_to_text, text_to_speech
from app.agent.tools import load_crops_data, load_schemes_data
from app.agent.orchestrator import run_agent_turn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables on startup
    await init_db()
    yield

app = FastAPI(
    title="SoilMate API",
    description="Multilingual AI Agronomic Advisory & Protective Planning Backend for Indian Farmers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# SYSTEM & HEALTH
# ==========================================

@app.get("/api/health")
async def health_check():
    """Verify backend health, database connection, and API key configurations."""
    return {
        "status": "ok",
        "service": "SoilMate Agritech Engine",
        "gemini_pool": {
            "total_keys": key_manager.total_keys,
            "has_active_key": key_manager.get_active_key() is not None
        },
        "sarvam_configured": bool(settings.sarvam_api_key),
        "data_gov_configured": bool(settings.data_gov_api_key)
    }

# ==========================================
# CHAT & STREAMING (RE-ACT AGENT)
# ==========================================

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Synchronous turn with SoilMate ReAct Agent:
    Translates Indic query to English, autonomously calls tools, records trace,
    and returns localized response + TTS voice audio.
    """
    try:
        response = await run_agent_turn(
            message=req.message,
            session_id=req.session_id,
            language_hint=req.language,
            location=req.location,
            voice_output=req.voice_output
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")

@app.post("/api/chat/stream")
async def chat_stream_endpoint(req: ChatRequest):
    """
    Server-Sent Events (SSE) streaming endpoint:
    Streams live progress notifications (e.g. 'Fetching live weather for Jaipur...',
    'Analyzing SoilGrids...', 'Translating to Telugu...') followed by the final completion event.
    """
    queue: asyncio.Queue = asyncio.Queue()

    async def on_progress(event: ProgressEvent):
        await queue.put(event)

    async def event_generator():
        # Start background agent turn
        agent_task = asyncio.create_task(
            run_agent_turn(
                message=req.message,
                session_id=req.session_id,
                language_hint=req.language,
                location=req.location,
                voice_output=req.voice_output,
                progress_callback=on_progress
            )
        )

        while not agent_task.done() or not queue.empty():
            try:
                # Wait for next progress event with timeout
                event: ProgressEvent = await asyncio.wait_for(queue.get(), timeout=0.1)
                yield f"event: progress\ndata: {json.dumps(event.model_dump())}\n\n"
            except asyncio.TimeoutError:
                continue

        # Check if agent task threw error
        if agent_task.exception():
            err_data = {"type": "error", "message": str(agent_task.exception())}
            yield f"event: error\ndata: {json.dumps(err_data)}\n\n"
        else:
            final_res = agent_task.result()
            yield f"event: complete\ndata: {json.dumps(final_res.model_dump())}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

# ==========================================
# HISTORY & SESSIONS
# ==========================================

@app.get("/api/sessions", response_model=List[SessionSummary])
async def get_sessions(limit: int = Query(50, ge=1, le=100)):
    """List recent conversation sessions."""
    sessions = await list_sessions(limit=limit)
    return [SessionSummary(**s) for s in sessions]

@app.get("/api/sessions/{session_id}", response_model=SessionSummary)
async def get_session_by_id(session_id: str):
    """Retrieve session metadata and persistent farmer profile by ID."""
    sess = await get_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionSummary(**sess)

@app.get("/api/chat/history/{session_id}", response_model=List[MessageRecord])
async def get_chat_history(session_id: str):
    """Retrieve full chronological chat history with tool execution traces."""
    msgs = await get_session_messages(session_id)
    return [MessageRecord(**m) for m in msgs]

@app.delete("/api/sessions/{session_id}")
async def remove_session(session_id: str):
    """Delete a conversation session, cascading to its messages and related advisories."""
    success = await delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "success", "message": f"Session {session_id} deleted successfully"}

# ==========================================
# CROP ADVISORIES & SCHEDULES
# ==========================================

@app.get("/api/advisories", response_model=List[AdvisorySummary])
async def get_advisories(
    session_id: Optional[str] = None,
    crop: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100)
):
    """List saved crop protective advisories and planting schedules."""
    advs = await list_advisories(session_id=session_id, crop_name=crop, limit=limit)
    return [AdvisorySummary(**a) for a in advs]

@app.get("/api/advisories/{advisory_id}", response_model=AdvisoryDetail)
async def get_advisory_by_id(advisory_id: str):
    """Retrieve a specific crop advisory with complete schedules and metrics."""
    adv = await get_advisory(advisory_id)
    if not adv:
        raise HTTPException(status_code=404, detail="Advisory not found")
    return AdvisoryDetail(**adv)

@app.delete("/api/advisories/{advisory_id}")
async def remove_advisory(advisory_id: str):
    """Delete a specific crop advisory."""
    success = await delete_advisory(advisory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Advisory not found")
    return {"status": "success", "message": f"Advisory {advisory_id} deleted successfully"}


# ==========================================
# VOICE & MULTILINGUAL UTILITIES
# ==========================================

@app.post("/api/voice/stt", response_model=STTResponse)
async def stt_endpoint(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None)
):
    """Transcribe speech audio file to text."""
    audio_bytes = await file.read()
    res = await speech_to_text(audio_bytes, filename=file.filename or "audio.wav", language_hint=language)
    if "error" in res and not res.get("text"):
        raise HTTPException(status_code=502, detail=res["error"])
    return STTResponse(**res)

@app.post("/api/voice/tts", response_model=TTSResponse)
async def tts_endpoint(req: TTSRequest):
    """Synthesize text into target Indian language voice audio."""
    audio_b64 = await text_to_speech(req.text, language=req.language)
    if not audio_b64:
        return TTSResponse(audio_base64=None, error="TTS synthesis failed or key not configured")
    return TTSResponse(audio_base64=audio_b64)

# ==========================================
# DIRECT DATA INSPECTION ENDPOINTS
# ==========================================

@app.get("/api/weather", response_model=WeatherResponse)
async def weather_endpoint(lat: float = Query(...), lon: float = Query(...)):
    """Get live 7-day agricultural weather forecast and alerts."""
    try:
        data = await get_weather_forecast(lat, lon)
        return WeatherResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Open-Meteo query failed: {str(e)}")

@app.get("/api/soil", response_model=SoilResponse)
async def soil_endpoint(lat: float = Query(...), lon: float = Query(...)):
    """Get live SoilGrids physical and chemical soil properties."""
    try:
        data = await get_soil_properties(lat, lon)
        return SoilResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"SoilGrids query failed: {str(e)}")

@app.get("/api/mandi", response_model=MandiResponse)
async def mandi_endpoint(state: str = Query(""), commodity: str = Query(...)):
    """Get live APMC mandi commodity prices from Agmarknet."""
    try:
        data = await get_mandi_prices(state, commodity)
        return MandiResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Mandi price fetch failed: {str(e)}")

@app.get("/api/geocode", response_model=GeocodeResponse)
async def geocode_endpoint(query: str = Query(...)):
    """Search place coordinates via Open-Meteo Geocoding."""
    loc = await geocode_location(query)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{query}' not found")
    return GeocodeResponse(**loc)

@app.get("/api/crops")
async def crops_catalog(season: Optional[str] = None, soil_type: Optional[str] = None):
    """Query ICAR reference crop catalog."""
    crops = load_crops_data()
    filtered = []
    for c in crops:
        if season and season.lower() not in c.get("season", "").lower():
            continue
        if soil_type and not any(soil_type.lower() in s.lower() for s in c.get("soil_types", [])):
            continue
        filtered.append(c)
    return {"crops": filtered, "total": len(filtered)}

@app.get("/api/schemes")
async def schemes_catalog(query: Optional[str] = None):
    """Query government agricultural welfare schemes."""
    schemes = load_schemes_data()
    if query:
        q = query.lower().strip()
        schemes = [
            s for s in schemes 
            if q in s.get("name", "").lower() 
            or q in s.get("description", "").lower() 
            or q in s.get("benefits", "").lower()
        ]
    return {"schemes": schemes, "total": len(schemes)}

