import { useEffect, useRef } from 'react'
import { Sprout, User, MessageCircleQuestion } from 'lucide-react'
const fmt = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
function Msg({ m }) {
  const me = m.role === 'user'
  return (
    <div className={`flex gap-2 ${me ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${me ? 'bg-crimson text-white' : 'bg-navy text-white'}`}>{me ? <User size={18} /> : <Sprout size={18} />}</div>
      <div className={`flex max-w-[80%] flex-col gap-1 ${me ? 'items-end' : ''}`}>
        <div className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-soft ${me ? 'rounded-tr-sm bg-navy text-white' : 'rounded-tl-sm border border-navy-100 bg-white text-navy'}`}>{m.text}</div>
        <span className="px-1 text-[11px] text-navy-600">{me ? 'You' : 'Assistant'} · {fmt(m.time)}{m.voice && ' · voice'}{m.demo && <span className="ml-1 rounded bg-blush-200 px-1.5 py-0.5 font-bold text-crimson">Demo</span>}</span>
      </div>
    </div>
  )
}
export default function ChatMessages({ messages, typing, interim, listening }) {
  const end = useRef(null)
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [messages, typing, interim])
  if (!messages.length && !listening) return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-navy-600">
      <MessageCircleQuestion size={40} className="text-crimson" />
      <p className="font-bold text-navy">No questions yet</p>
      <p className="text-sm">Tap the microphone or type below. Try: “My wheat leaves are turning yellow.”</p>
    </div>
  )
  return (
    <div className="scroll-thin flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
      {messages.map((m) => <Msg key={m.id} m={m} />)}
      {listening && (
        <div className="flex flex-row-reverse gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson text-white"><User size={18} /></div>
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm border-2 border-dashed border-navy-200 bg-white/70 px-4 py-2.5 text-[15px] text-navy-600">{interim || 'Listening…'}</div>
        </div>
      )}
      {typing && (
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white"><Sprout size={18} /></div>
          <div className="flex gap-1 rounded-2xl border border-navy-100 bg-white px-4 py-3" role="status" aria-label="Assistant is typing">{[0, 1, 2].map((i) => <span key={i} className="dot h-2 w-2 rounded-full bg-navy" style={{ animationDelay: `${i * 0.2}s` }} />)}</div></div>
      )}
      <div ref={end} />
    </div>
  )
}
