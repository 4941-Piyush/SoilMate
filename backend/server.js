import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { LANGUAGES, resolveLanguage } from './languages.js'

const KEY = process.env.SARVAM_API_KEY
const BASE = 'https://api.sarvam.ai'
const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

async function sarvam(path, init) {
  if (!KEY) throw Object.assign(new Error('SARVAM_API_KEY is missing in backend/.env'), { status: 500 })
  const r = await fetch(BASE + path, { ...init, headers: { 'api-subscription-key': KEY, ...init.headers } })
  const body = await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(body?.error?.message || `Sarvam API error ${r.status}`), { status: r.status })
  return body
}

// Chat (Sarvam-105B): answers in the farmer's language. Languages outside the 11 "core" ones are
// answered by the LLM in English if unsupported, so we translate the reply with Sarvam-Translate.
async function askAssistant(message, lang, location) {
  const system = `You are a friendly agricultural advisor for Indian farmers${location ? ` in ${location}` : ''}. ` +
    `Give short, practical, plain-language advice on crops, pests, weather, irrigation, fertilizer and planting/harvest timing. ` +
    `Reply in ${lang.core ? lang.name : 'English'}. If unsure, say so and suggest visiting the local Krishi Vigyan Kendra.`
  const data = await sarvam('/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.SARVAM_CHAT_MODEL || 'sarvam-105b', reasoning_effort: null, temperature: 0.3, max_tokens: 800,
      messages: [{ role: 'system', content: system }, { role: 'user', content: message }] }),
  })
  let reply = data.choices?.[0]?.message?.content?.trim() || ''
  if (reply && !lang.core) {
    const t = await sarvam('/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: reply.slice(0, 2000), source_language_code: 'en-IN', target_language_code: lang.code, model: 'sarvam-translate:v1' }) })
    reply = t.translated_text || reply
  }
  return reply
}

app.get('/api/health', (_q, r) => r.json({ ok: true, sarvamKeyConfigured: !!KEY }))
app.get('/api/languages', (_q, r) => r.json({ count: LANGUAGES.length, languages: LANGUAGES, note: 'Haryanvi is not a Sarvam language; the frontend maps it to Hindi.' }))

// POST /api/chat/text {message, language, location} -> {reply}
app.post('/api/chat/text', async (req, res, next) => {
  try {
    const { message, language, location } = req.body
    if (!message?.trim()) return res.status(400).json({ error: 'message is required' })
    res.json({ reply: await askAssistant(message, resolveLanguage(language), location) })
  } catch (e) { next(e) }
})

// POST /api/chat/voice  multipart: audio (file), language, location -> {transcript, reply}  (Sarvam Saaras v4)
app.post('/api/chat/voice', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'audio file is required' })
    const lang = resolveLanguage(req.body.language)
    const fd = new FormData()
    fd.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname || 'audio.webm')
    fd.append('model', 'saaras:v4'); fd.append('mode', 'transcribe'); fd.append('language_code', lang.code)
    const stt = await sarvam('/speech-to-text', { method: 'POST', body: fd })
    const transcript = stt.transcript || ''
    res.json({ transcript, reply: transcript ? await askAssistant(transcript, lang, req.body.location) : '' })
  } catch (e) { next(e) }
})

// TODO (your data sources): weather API, mandi prices, soil metrics. Returning null keeps the UI on placeholders.
app.get('/api/advice', (_q, r) => r.json(null))
app.get('/api/schedule', (_q, r) => r.json(null))
app.get('/api/weather', (_q, r) => r.json(null))

app.use((e, _q, res, _n) => res.status(e.status || 500).json({ error: e.message }))
app.listen(process.env.PORT || 8000, () => console.log(`Backend on http://localhost:${process.env.PORT || 8000}  (Sarvam key: ${KEY ? 'set' : 'MISSING'})`))
