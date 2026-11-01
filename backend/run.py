import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting SoilMate Backend on port {settings.port}...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=True
    )

