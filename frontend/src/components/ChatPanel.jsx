import React, { useState, useRef } from 'react'
import { Sprout, MessageSquare, X, ChevronUp } from 'lucide-react'
import VoiceAssistant from './VoiceAssistant'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import LanguageSelector from './LanguageSelector'
import LocationInput from './LocationInput'
import LiveProgressTicker from './LiveProgressTicker'
import useSpeech from '../hooks/useSpeech'
import { chatStream, chatSync } from '../services/api'
import { getUITranslations } from '../utils/translations'
import { stopCurrentAudio, playAudioBase64 } from '../utils/audioManager'

export default function ChatPanel({
  uiLanguage = 'hi',
  setUiLanguage,
  spokenLanguage = 'hi',
  setSpokenLanguage,
  location,
  setLocation,
  sessionId,
  setSessionId,
  messages,
  setMessages,
  onUserActivity,
  streamingEvent,
  setStreamingEvent,
  setFarmerProfile
}) {
  const [loading, setLoading] = useState(false)
  const [chatWindowOpen, setChatWindowOpen] = useState(false)
  const abortControllerRef = useRef(null)

  // Dynamic UI Translation dictionary for current UI Language
  const t = getUITranslations(uiLanguage)

  const handleSendMessage = async (text, isVoice = false) => {
    if (!text.trim()) return

    // 1. Conversational Barge-In: immediately silence any ongoing speech playback
    stopCurrentAudio()

    // 2. Abort any in-flight response generation from previous turn
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort()
      } catch (_) {}
      abortControllerRef.current = null
    }

    const currentController = new AbortController()
    abortControllerRef.current = currentController

    // Immediately switch dynamic view back to 'workflow' on any talk or message
    onUserActivity?.()

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      language: spokenLanguage,
      created_at: new Date().toISOString()
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      await chatStream(
        {
          message: text,
          sessionId: sessionId,
          language: spokenLanguage,
          location: location || null,
          voiceOutput: true,
          signal: currentController.signal
        },
        {
          onProgress: (ev) => {
            if (currentController.signal.aborted) return
            setStreamingEvent(ev)
          },
          onComplete: (data) => {
            if (currentController.signal.aborted) return
            abortControllerRef.current = null

            if (data.session_id) {
              setSessionId(data.session_id)
            }

            // If backend identified the spoken/typed Indian language, update spokenLanguage
            if (data.language && data.language !== spokenLanguage) {
              setSpokenLanguage?.(data.language)
            }
            // CRITICAL: UI Language is untouched; it is solely controlled by the top selector.

            // Save and update profile
            if (data.farmer_profile) {
              setFarmerProfile?.(data.farmer_profile)
              if (data.farmer_profile.location_name && data.farmer_profile.latitude != null) {
                setLocation({
                  name: data.farmer_profile.location_name,
                  lat: data.farmer_profile.latitude,
                  lon: data.farmer_profile.longitude,
                  state: data.farmer_profile.state || ''
                })
              }
            }

            const assistantMsg = {
              id: `asst_${Date.now()}`,
              role: 'assistant',
              content: data.response,
              content_english: data.response_english,
              language: data.language,
              audio_base64: data.audio_base64,
              tool_calls: data.tool_calls || [],
              created_at: new Date().toISOString()
            }
            setMessages((prev) => [...prev, assistantMsg])
            setStreamingEvent(null)
            setLoading(false)

            // Auto-play audio response with single-playback guarantee
            if (data.audio_base64 && !currentController.signal.aborted) {
              playAudioBase64(data.audio_base64)
            }
          },
          onError: async (err) => {
            if (currentController.signal.aborted) return
            console.warn('SSE stream error, falling back to sync chat:', err)
            try {
              const res = await chatSync({
                message: text,
                sessionId: sessionId,
                language: spokenLanguage,
                location: location || null,
                voiceOutput: true
              })

              if (currentController.signal.aborted) return
              abortControllerRef.current = null

              if (res.session_id) setSessionId(res.session_id)
              if (res.language && res.language !== spokenLanguage) {
                setSpokenLanguage?.(res.language)
              }

              if (res.farmer_profile) {
                setFarmerProfile?.(res.farmer_profile)
                if (res.farmer_profile.location_name && res.farmer_profile.latitude != null) {
                  setLocation({
                    name: res.farmer_profile.location_name,
                    lat: res.farmer_profile.latitude,
                    lon: res.farmer_profile.longitude,
                    state: res.farmer_profile.state || ''
                  })
                }
              }

              setMessages((prev) => [
                ...prev,
                {
                  id: `asst_${Date.now()}`,
                  role: 'assistant',
                  content: res.response,
                  content_english: res.response_english,
                  language: res.language,
                  audio_base64: res.audio_base64,
                  tool_calls: res.tool_calls || [],
                  created_at: new Date().toISOString()
                }
              ])

              if (res.audio_base64 && !currentController.signal.aborted) {
                playAudioBase64(res.audio_base64)
              }
            } catch (syncErr) {
              if (currentController.signal.aborted) return
              alert(`Error: ${syncErr.message || 'Failed to reach SoilMate server'}`)
            } finally {
              if (!currentController.signal.aborted) {
                setStreamingEvent(null)
                setLoading(false)
              }
            }
          }
        }
      )
    } catch (e) {
      if (!currentController.signal.aborted) {
        console.error('Chat error:', e)
        setStreamingEvent(null)
        setLoading(false)
      }
    }
  }

  // Voice speech hook uses the active spokenLanguage
  const speech = useSpeech(spokenLanguage, (transcript) => {
    handleSendMessage(transcript, true)
  })

  // Trigger tab switch when user starts speech listening
  const handleOrbToggle = () => {
    // Silence audio immediately upon tapping to talk
    stopCurrentAudio()
    if (!speech.listening) {
      onUserActivity?.()
    }
    speech.toggle()
  }

  const speechProxy = {
    ...speech,
    toggle: handleOrbToggle
  }

  const latestMessage = messages[messages.length - 1]

  return (
    <aside className="relative flex flex-col h-full w-full lg:w-[480px] xl:w-[520px] border-r border-purple-500/20 bg-[#07040D] shrink-0 overflow-hidden">
      {chatWindowOpen ? (
        /* ================= FULL CHAT VIEW (COVERS TALK BUTTON, 100% OPAQUE) ================= */
        <div className="flex-1 flex flex-col h-full w-full bg-[#07040D] overflow-hidden">
          {/* Dedicated Chat Header with Cross Button */}
          <header className="p-3.5 border-b border-purple-500/25 flex items-center justify-between bg-dark-900/90 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white shadow-glass">
                <MessageSquare size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">
                  {t.chatTitle}
                </h2>
                <span className="text-[11px] text-purple-300/70">
                  {messages.length} {t.chatMessagesCount}
                </span>
              </div>
            </div>

            {/* Cross Button to return to Voice Orb Screen */}
            <button
              onClick={() => {
                stopCurrentAudio()
                setChatWindowOpen(false)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900 transition shadow-glass cursor-pointer"
              title="Close and return to talk button"
            >
              <X size={18} />
            </button>
          </header>

          {/* Compact context pill row inside chat */}
          <div className="px-3.5 py-1.5 border-b border-purple-500/15 bg-dark-950/60 flex items-center justify-between gap-2 shrink-0">
            <div className="flex-1 min-w-0">
              <LanguageSelector value={uiLanguage} onChange={setUiLanguage} label={t.uiLangLabel} />
            </div>
            <div className="flex-1 min-w-0">
              <LocationInput location={location} onLocationChange={setLocation} t={t} />
            </div>
          </div>

          {/* Scrollable Chat Messages */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatMessages
              messages={messages}
              streamingEvent={streamingEvent}
              loading={loading}
              t={t}
            />

            {/* Chat Typing Input */}
            <ChatInput
              onSendMessage={(txt) => handleSendMessage(txt, false)}
              language={spokenLanguage}
              placeholder={t.typePlaceholder}
              disabled={loading}
              t={t}
            />
          </div>
        </div>
      ) : (
        /* ================= VOICE ORB VIEW ================= */
        <div className="flex-1 flex flex-col h-full w-full bg-[#07040D] overflow-hidden">
          {/* Top Header */}
          <header className="p-3.5 border-b border-purple-500/20 space-y-2.5 bg-dark-950/80 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white shadow-glass">
                  <Sprout size={20} />
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-white leading-tight flex items-center gap-1.5">
                    {t.appTitle}
                    <span className="text-[10px] font-medium text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                      {t.appBadge}
                    </span>
                  </h1>
                  <p className="text-[11px] text-purple-300/70 font-medium">{t.appSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Controls: UI Language and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <LanguageSelector value={uiLanguage} onChange={setUiLanguage} label={t.uiLangLabel} />
              <LocationInput location={location} onLocationChange={setLocation} t={t} />
            </div>
          </header>

          {/* Center: Push-to-Talk Animated 3D Glowing Mesh Orb */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
            <VoiceAssistant
              speech={speechProxy}
              t={t}
            />
          </div>

          {/* Bottom: Clickable Live Transcript Banner */}
          <div className="p-4 pt-1 pb-3 shrink-0">
            {speech.listening ? (
              <div
                onClick={() => setChatWindowOpen(true)}
                className="w-full cursor-pointer rounded-2xl border-2 border-cyan-400 bg-dark-900 p-3.5 shadow-[0_0_30px_rgba(56,189,248,0.4)] transition hover:border-cyan-300 group"
              >
                <div className="flex items-center justify-between text-xs text-cyan-300 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    {t.liveTranscript}
                  </span>
                  <span className="text-[10px] text-purple-300 group-hover:text-white">
                    {t.clickToChat}
                  </span>
                </div>
                <p className="text-sm font-bold live-highlight tracking-wide leading-relaxed min-h-[24px]">
                  {speech.interim ? speech.interim : t.listening}
                </p>
              </div>
            ) : streamingEvent ? (
              <div
                onClick={() => setChatWindowOpen(true)}
                className="w-full cursor-pointer transition hover:opacity-90"
              >
                <LiveProgressTicker event={streamingEvent} />
              </div>
            ) : (
              <div
                onClick={() => setChatWindowOpen(true)}
                className="w-full cursor-pointer rounded-2xl border border-purple-500/25 bg-dark-850 p-3.5 shadow-glass hover:border-purple-400/50 transition group"
              >
                <div className="flex items-center justify-between text-xs text-purple-300 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-purple-400" />
                    {latestMessage ? (latestMessage.role === 'user' ? 'You:' : 'SoilMate:') : t.chatTitle}
                  </span>
                  <span className="text-[10px] text-purple-400 group-hover:text-white flex items-center gap-0.5">
                    {t.clickToChat} ({messages.length}) <ChevronUp size={12} />
                  </span>
                </div>
                <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                  {latestMessage ? latestMessage.content : t.tapToSpeak}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
