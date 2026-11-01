import React, { useState, useEffect } from 'react'
import ChatPanel from './components/ChatPanel'
import DashboardPanel from './components/DashboardPanel'
import { fetchChatHistory, fetchSessionDetail, fetchAdvisoryDetail } from './services/api'
import { stopCurrentAudio } from './utils/audioManager'

export default function App() {
  // 1. UI Language: persistent in localStorage, defaults to 'hi'
  const [uiLanguage, setUiLanguageState] = useState(() => {
    try {
      return localStorage.getItem('soilmate_ui_lang') || 'hi'
    } catch (_) {
      return 'hi'
    }
  })

  // 2. Spoken Language: language spoken or typed by farmer for chat, voice TTS & agronomic advice.
  const [spokenLanguage, setSpokenLanguageState] = useState(() => {
    try {
      return localStorage.getItem('soilmate_spoken_lang') || 'hi'
    } catch (_) {
      return 'hi'
    }
  })

  // User explicitly selects UI Language from top dropdown
  const handleUiLanguageChange = (newLang) => {
    setUiLanguageState(newLang)
    try {
      localStorage.setItem('soilmate_ui_lang', newLang)
    } catch (_) {}
    // Seamless voice readiness: synchronize listening model with chosen UI language
    setSpokenLanguageState(newLang)
    try {
      localStorage.setItem('soilmate_spoken_lang', newLang)
    } catch (_) {}
  }

  // System dynamically detects spoken or typed language from conversation
  const handleSpokenLanguageChange = (detectedLang) => {
    if (detectedLang && detectedLang !== spokenLanguage) {
      setSpokenLanguageState(detectedLang)
      try {
        localStorage.setItem('soilmate_spoken_lang', detectedLang)
      } catch (_) {}
    }
  }

  // Zero mock location: starts as null, populated only when added by user or detected by agent
  const [location, setLocation] = useState(null)
  const [farmerProfile, setFarmerProfile] = useState(null)

  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [streamingEvent, setStreamingEvent] = useState(null)

  // 5 Tabs: 'workflow' (default) -> switches to 'advice'/'schedule'/'profile' -> back to 'workflow' on talk
  const [activeTab, setActiveTab] = useState('workflow')
  const [latestAdvisory, setLatestAdvisory] = useState(null)

  // Find latest assistant message and tool calls
  const assistantMessages = messages.filter((m) => m.role === 'assistant')
  const latestAssistantMessage = assistantMessages[assistantMessages.length - 1] || null
  const latestToolCalls = latestAssistantMessage?.tool_calls || []

  // Automatic tab switching based on talk & output
  useEffect(() => {
    if (latestAssistantMessage?.advisory_id) {
      fetchAdvisoryDetail(latestAssistantMessage.advisory_id)
        .then((adv) => {
          if (adv) {
            setLatestAdvisory(adv)
            setActiveTab('advice')
          }
        })
        .catch(() => {})
    } else if (latestAssistantMessage?.tool_calls?.some(t => t.tool === 'query_crop_database')) {
      setActiveTab('advice')
    } else if (latestAssistantMessage?.tool_calls?.some(t => t.tool === 'update_farmer_profile')) {
      setActiveTab('profile')
    } else if (
      latestAssistantMessage?.content &&
      (latestAssistantMessage.content.toLowerCase().includes('schedule') ||
       latestAssistantMessage.content.toLowerCase().includes('sowing') ||
       latestAssistantMessage.content.includes('बुवाई') ||
       latestAssistantMessage.content.includes('कटाई'))
    ) {
      setActiveTab('schedule')
    }
  }, [latestAssistantMessage])

  // When user begins talking or messaging again, automatically flip back to 'workflow'
  const handleUserActivity = () => {
    setActiveTab('workflow')
  }

  // Create a brand new session from frontend
  const handleNewSession = () => {
    stopCurrentAudio()
    setSessionId(null)
    setMessages([])
    setStreamingEvent(null)
    setLatestAdvisory(null)
    setFarmerProfile(null)
    setActiveTab('workflow')
  }

  // Load chat history & remembered farmer profile when a previous session is selected
  const handleSelectSession = async (sid) => {
    if (!sid) return
    setSessionId(sid)
    try {
      const [history, sess] = await Promise.all([
        fetchChatHistory(sid),
        fetchSessionDetail(sid).catch(() => null)
      ])
      setMessages(history)
      if (sess) {
        if (sess.language) handleSpokenLanguageChange(sess.language)
        setFarmerProfile({
          location_name: sess.location_name,
          latitude: sess.latitude,
          longitude: sess.longitude,
          state: sess.state,
          district: sess.district,
          land_size_acres: sess.land_size_acres,
          primary_crop: sess.primary_crop,
          soil_type: sess.soil_type
        })
        if (sess.location_name && sess.latitude != null && sess.longitude != null) {
          setLocation({
            name: sess.location_name,
            lat: sess.latitude,
            lon: sess.longitude,
            state: sess.state || ''
          })
        }
      }
    } catch (e) {
      console.error('Failed to load session history:', e)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-950 font-sans text-stone-100 antialiased select-none">
      {/* Left: Push-to-Talk Voice & Interaction Panel with Chat Overlay */}
      <ChatPanel
        uiLanguage={uiLanguage}
        setUiLanguage={handleUiLanguageChange}
        spokenLanguage={spokenLanguage}
        setSpokenLanguage={handleSpokenLanguageChange}
        location={location}
        setLocation={setLocation}
        sessionId={sessionId}
        setSessionId={setSessionId}
        messages={messages}
        setMessages={setMessages}
        onUserActivity={handleUserActivity}
        onNewSession={handleNewSession}
        streamingEvent={streamingEvent}
        setStreamingEvent={setStreamingEvent}
        setFarmerProfile={setFarmerProfile}
      />

      {/* Right: Rounded Box Tabs (Workflow, Advice, Schedule, Profile, History) */}
      <DashboardPanel
        location={location}
        uiLanguage={uiLanguage}
        activeSessionId={sessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        latestToolCalls={latestToolCalls}
        streamingEvent={streamingEvent}
        latestAdvisory={latestAdvisory}
        latestAssistantMessage={latestAssistantMessage}
        farmerProfile={farmerProfile}
      />
    </div>
  )
}
