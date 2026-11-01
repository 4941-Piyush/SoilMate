import React, { useEffect, useState } from 'react'
import { History, MessageSquare, RefreshCw, ChevronRight, MapPin } from 'lucide-react'
import { fetchSessions } from '../services/api'
import { localizePlaceName } from '../utils/geoLocalization'

export default function SessionHistory({ activeSessionId, onSelectSession, t }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)

  const loadSessions = async () => {
    setLoading(true)
    try {
      const res = await fetchSessions()
      setSessions(res)
    } catch (e) {
      console.error('Failed to load sessions:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [activeSessionId])

  return (
    <div className="rounded-2xl border border-purple-500/25 bg-dark-900/70 p-5 shadow-glass space-y-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <History className="text-purple-400" size={24} />
          <div>
            <h3 className="text-sm font-bold text-white">{t?.historySessionsTitle || 'Conversation Sessions'}</h3>
            <p className="text-xs text-purple-300/70">{t?.historySessionsSubtitle || 'Persistent sessions in SQLite database'}</p>
          </div>
        </div>
        <button
          onClick={loadSessions}
          className="text-xs text-purple-400 hover:text-white flex items-center gap-1 transition"
          title="Refresh sessions"
        >
          <RefreshCw size={12} /> {t?.historyRefresh || 'Refresh'}
        </button>
      </div>

      {loading && (
        <div className="p-6 text-center text-xs text-purple-300">
          <RefreshCw size={16} className="animate-spin mx-auto mb-2 text-purple-400" />
          {t?.historySessionsLoading || 'Loading chat sessions...'}
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="p-6 text-center text-xs text-purple-300/70 bg-purple-950/30 rounded-xl border border-purple-500/20">
          <MessageSquare size={24} className="mx-auto mb-1 text-purple-400 opacity-60" />
          <p className="font-semibold text-white">{t?.historyNoSessionsTitle || 'No previous sessions yet'}</p>
          <p className="mt-1 text-purple-400/80">{t?.historyNoSessionsDesc || 'Speak or send a message on the left to start a persistent session.'}</p>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="divide-y divide-purple-500/15 border border-purple-500/20 rounded-xl overflow-hidden max-h-72 overflow-y-auto scroll-thin">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId
            return (
              <button
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`w-full text-left p-3 flex items-center justify-between transition ${
                  isActive
                    ? 'bg-purple-900/50 border-l-4 border-purple-400'
                    : 'bg-dark-900/40 hover:bg-purple-950/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white truncate">
                      {s.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-950/80 px-1.5 py-0.2 rounded border border-purple-500/30">
                      {s.language}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-300/70 mt-1 flex items-center gap-2">
                    {s.location_name && (
                      <span className="flex items-center gap-1 text-cyan-300">
                        <MapPin size={11} /> {localizePlaceName(s.location_name, t?._langCode || 'hi')}
                      </span>
                    )}
                    <span>{new Date(s.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <ChevronRight size={16} className={isActive ? 'text-purple-300' : 'text-purple-600'} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
