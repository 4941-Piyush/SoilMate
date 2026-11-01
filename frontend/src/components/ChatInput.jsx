import { useState } from 'react'
import { Mic, Send, Square } from 'lucide-react'
export default function ChatInput({ onSend, onMic, listening, disabled }) {
  const [v, setV] = useState('')
  const submit = () => { if (!v.trim() || disabled) return; onSend(v.trim()); setV('') }
  return (
    <div className="flex items-end gap-2 rounded-2xl border border-navy-200 bg-white p-2 shadow-soft focus-within:border-navy">
      <textarea rows={1} value={v} onChange={(e) => setV(e.target.value)} aria-label="Type your question"
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
        placeholder="Ask anything about farming..." className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] text-navy placeholder:text-navy-600/70 focus:outline-none" />
      <button onClick={onMic} aria-label={listening ? 'Stop voice input' : 'Start voice input'} className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${listening ? 'bg-crimson text-white' : 'bg-navy-50 text-navy hover:bg-navy-100'}`}>{listening ? <Square size={16} fill="currentColor" /> : <Mic size={20} />}</button>
      <button onClick={submit} disabled={!v.trim() || disabled} aria-label="Send message" className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white transition hover:bg-navy-800 disabled:opacity-40"><Send size={18} /></button>
    </div>
  )
}
