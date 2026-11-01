import { useState } from 'react'
import { Sprout } from 'lucide-react'
import VoiceAssistant from './VoiceAssistant'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import LanguageSelector from './LanguageSelector'
import useSpeech from '../hooks/useSpeech'
import { sendTextMessage, sendVoiceMessage, USE_MOCK } from '../services/api'

const now = () => new Date().toISOString()
const seed = [
  { id: 's1', role: 'user', text: 'My wheat leaves have yellow stripes. What should I do?', time: now(), demo: true },
  { id: 's2', role: 'assistant', text: 'Demo answer: This could be yellow rust. Your real advice will appear here once the backend is connected.', time: now(), demo: true },
]
export default function ChatPanel({ language, setLanguage, location, notify, onReply }) {
  const [messages, setMessages] = useState(USE_MOCK ? seed : [])
  const [typing, setTyping] = useState(false)
  const send = async (text, voice = false) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', text, time: now(), voice }])
    setTyping(true)
    try {
      const res = voice ? await sendVoiceMessage({ transcript: text, language, location }) : await sendTextMessage(text, language, location)
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', text: res.reply, time: now(), demo: USE_MOCK }])
      onReply?.(res)
    } catch { notify('Could not get a reply. Check your connection and try again.', 'error') }
    finally { setTyping(false) }
  }
  const speech = useSpeech(language, (t) => send(t, true))
  return (
    <aside className="flex min-h-screen flex-col gap-3 p-5 lg:h-full lg:min-h-0 lg:w-[var(--lw)] lg:shrink-0">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white"><Sprout /></div>
        <div><h1 className="text-lg font-extrabold leading-tight">Your Personal Farming Assistant</h1>
          <p className="text-sm text-navy-600">Ask anything about your crops in your own language.</p></div>
      </header>
      <LanguageSelector value={language} onChange={(l) => { setLanguage(l); notify(`Language set to ${l}`) }} />
      <VoiceAssistant speech={speech} />
            <div className="flex min-h-[200px] flex-1 flex-col overflow-hidden">
        <ChatMessages messages={messages} typing={typing} interim={speech.interim} listening={speech.listening} />
      </div>
      <ChatInput onSend={(t) => send(t)} onMic={speech.toggle} listening={speech.listening} disabled={typing} />
    </aside>
  )
}
