import { useCallback, useEffect, useRef, useState } from 'react'
import { stopCurrentAudio } from '../utils/audioManager'

export const SPEECH_CODES = {
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ml: 'ml-IN',
  od: 'or-IN',
  ur: 'ur-IN',
  en: 'en-IN'
}

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

const ERR_MESSAGES = {
  'not-allowed': 'Microphone permission was denied. Please allow microphone access in your browser address bar.',
  'service-not-allowed': 'Microphone access is blocked in your system settings.',
  'no-speech': 'No voice input was detected. Please tap and speak clearly.',
  'audio-capture': 'No microphone was detected on your device.',
  'language-not-supported': 'Language not supported by this browser. Please type your query.',
  network: 'Network connection required for voice recognition.'
}

export default function useSpeech(language = 'hi', onFinal) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')

  const recRef = useRef(null)
  const callbackRef = useRef(onFinal)
  callbackRef.current = onFinal

  const accumulatedRef = useRef('')
  const interimRef = useRef('')
  const silenceTimerRef = useRef(null)

  // Commit and send complete accumulated speech transcript
  const finalizeAndSubmit = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    const fullTranscript = (accumulatedRef.current + ' ' + interimRef.current).trim()
    accumulatedRef.current = ''
    interimRef.current = ''
    setInterim('')
    setListening(false)

    if (recRef.current) {
      try {
        recRef.current.stop()
      } catch (_) {}
    }

    // Only submit if meaningful text was recognized
    if (fullTranscript.length >= 2) {
      callbackRef.current?.(fullTranscript)
    }
  }, [])

  const stop = useCallback(() => {
    finalizeAndSubmit()
  }, [finalizeAndSubmit])

  const start = useCallback(() => {
    // Immediately silence any SoilMate playback on barge-in
    stopCurrentAudio()

    if (!SR) {
      setError('Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.')
      return
    }

    setError('')
    setInterim('')
    accumulatedRef.current = ''
    interimRef.current = ''

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    try {
      const recognition = new SR()
      recognition.lang = SPEECH_CODES[language] || 'hi-IN'
      recognition.interimResults = true
      // Continuous = true ensures speaking does not cut off after a momentary 1-second pause
      recognition.continuous = true

      recognition.onstart = () => {
        stopCurrentAudio()
        setListening(true)
      }

      recognition.onresult = (e) => {
        let chunkFinal = ''
        let chunkInterim = ''

        for (let i = e.resultIndex; i < e.results.length; i++) {
          const item = e.results[i]
          const trans = item[0]?.transcript || ''
          if (item.isFinal) {
            chunkFinal += trans + ' '
          } else {
            chunkInterim += trans
          }
        }

        if (chunkFinal) {
          accumulatedRef.current = (accumulatedRef.current + ' ' + chunkFinal).trim()
        }
        interimRef.current = chunkInterim

        const displayString = (accumulatedRef.current + ' ' + chunkInterim).trim()
        setInterim(displayString)

        // Reset silence timer: wait 2.4 seconds of continuous silence before auto-submitting
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        silenceTimerRef.current = setTimeout(() => {
          finalizeAndSubmit()
        }, 2400)
      }

      recognition.onerror = (e) => {
        if (e.error !== 'aborted' && e.error !== 'no-speech') {
          setError(ERR_MESSAGES[e.error] || `Voice recognition error: ${e.error}`)
        }
        if (e.error === 'not-allowed') {
          setListening(false)
        }
      }

      recognition.onend = () => {
        // If there was text in buffer, finalize it
        const remaining = (accumulatedRef.current + ' ' + interimRef.current).trim()
        if (remaining.length >= 2) {
          finalizeAndSubmit()
        } else {
          setListening(false)
          setInterim('')
        }
      }

      recRef.current = recognition
      recognition.start()
    } catch (err) {
      console.warn('SpeechRecognition activation failed:', err)
      setError('Could not start microphone. Please check browser permissions.')
      setListening(false)
    }
  }, [language, finalizeAndSubmit])

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      if (recRef.current) {
        try {
          recRef.current.abort()
        } catch (_) {}
      }
    }
  }, [])

  const toggle = useCallback(() => {
    if (listening) {
      stop()
    } else {
      start()
    }
  }, [listening, start, stop])

  return {
    listening,
    interim,
    error,
    start,
    stop,
    toggle,
    clearError: () => setError('')
  }
}
