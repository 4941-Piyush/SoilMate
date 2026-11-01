import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert "gemini_pool" in data

@pytest.mark.asyncio
async def test_crops_catalog_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/crops?season=rabi")
        assert resp.status_code == 200
        data = resp.json()
        assert "crops" in data
        assert data["total"] > 0
        for crop in data["crops"]:
            assert "rabi" in crop["season"].lower()

@pytest.mark.asyncio
async def test_schemes_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/schemes?query=kisan")
        assert resp.status_code == 200
        data = resp.json()
        assert "schemes" in data
        assert any("pm-kisan" in s["name"].lower() for s in data["schemes"])

@pytest.mark.asyncio
async def test_sessions_and_history_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/sessions")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

