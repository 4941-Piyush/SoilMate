// ===== API SERVICE LAYER — connect your backend here =====
// Set VITE_API_BASE_URL and VITE_USE_MOCK=false in .env to use real endpoints.
import * as mock from './mock.js'
const BASE = import.meta.env.VITE_API_BASE_URL || ''
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK) !== 'false'

async function http(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}
const post = (p, body) => http(p, { method: 'POST', body: JSON.stringify(body) })
const qs = (o) => new URLSearchParams(o).toString()

/** POST /chat/text  {message, language, location}  ->  {reply, advice?, schedule?} */
export const sendTextMessage = (message, language, location) =>
  USE_MOCK ? mock.chatReply(message, language) : post('/chat/text', { message, language, location })

/** POST /chat/voice  multipart audio blob OR transcript  ->  {reply, transcript} */
export const sendVoiceMessage = async ({ audioBlob, transcript, language, location }) => {
  if (USE_MOCK) return mock.chatReply(transcript, language)
  if (audioBlob) {
    const fd = new FormData()
    fd.append('audio', audioBlob); fd.append('language', language)
    const res = await fetch(`${BASE}/chat/voice`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Voice request failed')
    return res.json()
  }
  return post('/chat/text', { message: transcript, language, location, source: 'voice' })
}

/** GET /advice?language=&location=  ->  advice object (see mock.js for shape) */
export const fetchCropAdvice = (p) => USE_MOCK ? Promise.resolve(null) : http(`/advice?${qs(p)}`)
/** GET /schedule?language=&location=  ->  schedule object */
export const fetchSchedule = (p) => USE_MOCK ? Promise.resolve(null) : http(`/schedule?${qs(p)}`)
/** GET /weather?location=  ->  {summary, temperatureC, humidity, rainProbability} */
export const fetchWeather = (p) => USE_MOCK ? Promise.resolve(null) : http(`/weather?${qs(p)}`)
