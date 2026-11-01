# 🌱 SoilMate — Multilingual AI Agronomic Advisory & Protective Planning Agent

> **Forge Gen AI Buildathon Submission**
> **Track:** Climate, Resource Infrastructure & Global Supply Resilience
> **Problem Spectrum:** Multilingual Agritech & Resource Advisory Assistant

---

## 🌾 Overview

**SoilMate** is an autonomous, voice-first, multilingual AI agricultural advisory agent designed for Indian smallholder farmers. A farmer speaks or types in their mother tongue (Hindi, Telugu, Tamil, Marathi, Bengali, etc.), and the agent dynamically plans and executes multi-step workflows across live real-time APIs to provide personalized crop-level protective advice, sowing/harvesting schedules, soil health management, and mandi price intelligence.

### 🌟 Key Capabilities
- **Indian Language Ingestion & Output Mirroring:** Farmers converse naturally in their native language; responses and voice audio match the exact source language.
- **English Reasoning Core:** Backend translates queries to English for scientific standardization and reasoning, preventing vernacular hallucinations in tool calls.
- **Autonomous & Dynamic ReAct Agent:** Gemini 2.0 Flash autonomously determines when and which tools to invoke based on actual need, saving tokens and minimizing latency.
- **Real-Time Interactive Progress (SSE):** Streams live progress events (`/api/chat/stream`) informing the farmer in real time what data is being fetched (e.g., *"Fetching live 7-day weather for Jaipur..."*, *"Analyzing SoilGrids..."*).
- **Gemini Multi-Key Failover Pool:** Automatic key rotation on HTTP 429 (`ResourceExhausted`) or 503 errors, ensuring zero downtime.
- **Zero Mock Data:** Connects exclusively to live APIs:
  - 🌦️ **Weather & Agro-Alerts:** Open-Meteo REST API (forecasts, frost/heatwave/heavy rain alerts).
  - 🧪 **Soil Physics & Chemistry:** ISRIC SoilGrids REST v2.0 (pH, sand/silt/clay %, USDA texture triangle, organic carbon, nitrogen).
  - 💰 **Mandi Price Intelligence:** data.gov.in Agmarknet API (live commodity rates across APMC mandis).
  - 🌾 **Agronomic Catalog:** ICAR crop datasets (`crops.json`).
  - 🏛️ **Government Welfare Schemes:** PM-KISAN, PMFBY, KCC, PMKSY (`schemes.json`).
- **Persistent Database:** Async SQLite database (`soilmate.db` via `aiosqlite`) storing chat sessions, messages with tool execution traces, and structured crop protective advisories.

---

## 📐 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   FARMER'S INTERFACE (React + Vite)              │
│  - Multilingual Chat & Native Voice Input                        │
│  - Live Progress Ticker (SSE streaming feedback)                 │
│  - Live Field Analytics (Weather, SoilGrids, Mandi Rates)        │
│  - Saved Advisories & Chat History                               │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ HTTP / SSE (/api/chat/stream)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     FASTAPI ASYNC BACKEND                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 1. Language Ingestion & English Translation Core           │  │
│  │    (Unicode Script Detector + Sarvam Mayura / Fallback)     │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
│                                 │ Standardized English Query     │
│                                 ▼                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 2. Autonomous Gemini ReAct Agent (gemini-2.0-flash)        │  │
│  │    - Multi-Key Failover Pool (Auto-rotation on 429/503)    │  │
│  │    - Dynamic Need-Based Tool Planning (Max 8 Iterations)   │  │
│  │    - Live Progress Callback Streamer                       │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
│                                 │ Concurrent Execution           │
│                                 ▼                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 3. Real-Time Data Services (Zero Mock Data)                │  │
│  │    ├── Open-Meteo API (7-day forecast & agro alerts)       │  │
│  │    ├── ISRIC SoilGrids API (pH, texture, NPK)              │  │
│  │    ├── data.gov.in Agmarknet API (Mandi commodity prices)  │  │
│  │    ├── ICAR Crop Database (Rabi, Kharif, Zaid calendars)   │  │
│  │    └── Central/State Schemes (PM-KISAN, PMFBY, KCC)        │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
│                                 │ Synthesis & Trace Extraction   │
│                                 ▼                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 4. Persistent Storage (Async SQLite: soilmate.db)          │  │
│  │    - sessions, messages (with tool traces), advisories     │  │
│  └──────────────────────────────┬─────────────────────────────┘  │
│                                 │                                │
│                                 ▼                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 5. Localized Output & Voice Audio Generation               │  │
│  │    - Translate English -> Farmer's Native Language         │  │
│  │    - Sarvam Bulbul TTS Voice Generation (Base64 WAV)       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEYS (multiple keys supported separated by comma)

# Run the FastAPI server
python run.py
# Backend runs at http://localhost:8000 (Docs: http://localhost:8000/docs)
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🧪 Running Tests & Smoke Verification

### Run Automated Backend Tests:
```bash
cd backend
pytest tests/
```

### Run Standalone Core Logic Smoke Test:
```bash
cd backend
python smoke_test.py
```

### Test Frontend Build:
```bash
cd frontend
npm run build
```

---

## 📡 API Contract Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & Gemini key pool health |
| `POST` | `/api/chat` | Synchronous Agent turn with full trace & advisory ID |
| `POST` | `/api/chat/stream` | **Server-Sent Events (SSE)** streaming live progress & data updates |
| `GET` | `/api/chat/history/{session_id}` | Retrieve full chat history & tool execution traces |
| `GET` | `/api/sessions` | List past conversation sessions |
| `GET` | `/api/advisories` | List saved crop advisories & schedules |
| `GET` | `/api/advisories/{id}` | Get specific crop advisory & schedules |
| `POST` | `/api/voice/stt` | Transcribe speech audio to text |
| `POST` | `/api/voice/tts` | Generate audio in target Indian language |
| `GET` | `/api/weather` | Live 7-day forecast & agro alerts (`?lat=&lon=`) |
| `GET` | `/api/soil` | Live SoilGrids metrics & classification (`?lat=&lon=`) |
| `GET` | `/api/mandi` | Live mandi prices from Agmarknet (`?state=&commodity=`) |
| `GET` | `/api/geocode` | Search place coordinates (`?query=`) |
| `GET` | `/api/crops` | ICAR reference crop catalog (`?season=&soil_type=`) |
| `GET` | `/api/schemes` | Central & state welfare schemes |

---

## 🏆 Scoring Rubric Alignment

- **Live Demonstration & Robustness (30 Points):** Real-time API calls, multi-key failover pool prevents quota errors, clean error boundaries, live SSE feedback.
- **AI Reasoning & Agentic Execution (25 Points):** ReAct agent autonomously decides tools, handles tool outputs, self-corrects on edge cases, logs complete execution traces.
- **Problem Relevance, Impact & USP (25 Points):** Voice-first, Indian-language native, addresses 146M smallholders facing information asymmetry, soil degradation, and market disparity.
- **Technical Architecture & Engineering Depth (20 Points):** Async FastAPI + React, clean separation of services, English core reasoning, USDA soil texture classifier, persistent SQLite database.

