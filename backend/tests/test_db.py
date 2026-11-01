import os
import pytest
from app.db.database import init_db
from app.db.repository import (
    create_or_update_session,
    get_session,
    list_sessions,
    save_message,
    get_session_messages,
    save_advisory,
    list_advisories,
    get_advisory
)

@pytest.mark.asyncio
async def test_session_lifecycle():
    await init_db()

    session = await create_or_update_session(
        language="hi",
        location_name="Jaipur",
        latitude=26.91,
        longitude=75.79,
        state="Rajasthan",
        district="Jaipur",
        land_size_acres=5.0,
        primary_crop="Wheat",
        soil_type="Sandy Loam"
    )
    sid = session["id"]
    assert sid.startswith("sess_")
    assert session["location_name"] == "Jaipur"
    assert session["land_size_acres"] == 5.0

    fetched = await get_session(sid)
    assert fetched is not None
    assert fetched["language"] == "hi"
    assert fetched["primary_crop"] == "Wheat"

    all_sessions = await list_sessions(limit=10)
    assert any(s["id"] == sid for s in all_sessions)

@pytest.mark.asyncio
async def test_message_and_trace_persistence():
    await init_db()
    session = await create_or_update_session(language="te", location_name="Guntur")
    sid = session["id"]

    tool_trace = [
        {"step": 1, "tool": "get_weather", "status": "success", "summary": "Forecast fetched"}
    ]

    msg = await save_message(
        session_id=sid,
        role="assistant",
        content="మీ నేల చాలా బాగుంది",
        content_english="Your soil is very good",
        language="te",
        tool_calls=tool_trace
    )
    assert msg["id"].startswith("msg_")

    history = await get_session_messages(sid)
    assert len(history) >= 1
    assert history[-1]["tool_calls"] == tool_trace

@pytest.mark.asyncio
async def test_advisory_persistence():
    await init_db()
    session = await create_or_update_session(language="hi", location_name="Indore")
    sid = session["id"]

    adv = await save_advisory(
        session_id=sid,
        crop_name="Wheat",
        crop_name_local="गेहूं",
        language="hi",
        season="rabi",
        location_name="Indore",
        sowing_window="Late October to Mid-November",
        full_advisory_text="गेहूं की बुवाई के लिए यह सर्वोत्तम समय है।"
    )
    adv_id = adv["id"]
    assert adv_id.startswith("adv_")
    assert adv["crop_name"] == "Wheat"

    fetched_adv = await get_advisory(adv_id)
    assert fetched_adv is not None
    assert fetched_adv["sowing_window"] == "Late October to Mid-November"

    adv_list = await list_advisories(session_id=sid)
    assert any(a["id"] == adv_id for a in adv_list)

