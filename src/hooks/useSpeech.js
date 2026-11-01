import { useCallback, useEffect, useRef, useState } from 'react'
export const SPEECH_CODES = { English:'en-IN', Hindi:'hi-IN', Punjabi:'pa-IN', Haryanvi:'hi-IN', Bengali:'bn-IN', Marathi:'mr-IN', Gujarati:'gu-IN', Tamil:'ta-IN', Telugu:'te-IN', Kannada:'kn-IN', Malayalam:'ml-IN', Odia:'or-IN', Urdu:'ur-IN' }
const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null
const ERR = {
  'not-allowed': 'Microphone access was blocked. Allow it in your browser’s address bar, then try again.',
  'service-not-allowed': 'Microphone access was blocked. Allow it in your browser settings.',
  'no-speech': 'We did not hear anything. Tap the microphone and speak again.',
  'audio-capture': 'No microphone found. Connect one and try again.',
  'language-not-supported': 'This browser cannot recognise the selected language. Type your question instead.',
  network: 'Speech service needs an internet connection.',
}
export default function useSpeech(language, onFinal) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')
  const rec = useRef(null); const cb = useRef(onFinal); cb.current = onFinal
  const stop = useCallback(() => rec.current?.stop(), [])
  const start = useCallback(() => {
    if (!SR) { setError('Voice input is not supported in this browser. Use Chrome or Edge, or type your question.'); return }
    setError(''); setInterim('')
    const r = new SR(); r.lang = SPEECH_CODES[language] || 'en-IN'; r.interimResults = true; r.continuous = false
    r.onstart = () => setListening(true)
    r.onresult = (e) => {
      let fin = '', tmp = ''
      for (let i = e.resultIndex; i < e.results.length; i++) (e.results[i].isFinal ? (fin += e.results[i][0].transcript) : (tmp += e.results[i][0].transcript))
      setInterim(tmp); if (fin.trim()) cb.current(fin.trim())
    }
    r.onerror = (e) => { if (e.error !== 'aborted') setError(ERR[e.error] || 'Voice input failed. Please try again.') }
    r.onend = () => { setListening(false); setInterim('') }
    rec.current = r
    try { r.start() } catch { setError('Could not start the microphone.') }
  }, [language])
  useEffect(() => () => rec.current?.abort(), [])
  return { listening, interim, error, start, stop, toggle: () => (listening ? stop() : start()), clearError: () => setError('') }
}
