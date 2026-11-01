# Backend (Node + Express + Sarvam AI)
1. `cd backend && npm install`
2. `copy .env.example .env` (Windows) / `cp .env.example .env`, then paste your key in `SARVAM_API_KEY` (from https://dashboard.sarvam.ai)
3. `npm start` → http://localhost:8000  (check http://localhost:8000/api/health and /api/languages)
4. In the frontend `.env`: `VITE_USE_MOCK=false`, `VITE_API_BASE_URL=http://localhost:8000/api`, then restart `npm run dev`.

## Sarvam languages (23 = 22 scheduled Indian languages + English)
All 23: speech-to-text (Saaras v4) and translation (Sarvam-Translate).
Only the first 11: chat (Sarvam-105B), text-to-speech, language-ID. Others are answered in English and translated.
English, Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu |
Assamese, Bodo, Dogri, Konkani, Kashmiri, Maithili, Manipuri, Nepali, Sanskrit, Santali, Sindhi, Urdu.
Haryanvi is not supported by Sarvam; it falls back to Hindi.
