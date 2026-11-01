import { useEffect, useRef } from 'react'
import { Square, AlertTriangle } from 'lucide-react'
const S = 280
function Mesh({ listening }) {
  const ref = useRef(null); const live = useRef(listening); live.current = listening
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d'), dpr = window.devicePixelRatio || 1
    c.width = c.height = S * dpr; ctx.scale(dpr, dpr)
    let amp = 0.12, speed = 0.5, t = 0, raf
    const R = S * 0.3
    const pt = (th, ph) => {
      const r = R * (1 + amp * (Math.sin(2 * th + t * 1.2) * Math.cos(3 * ph + t) + 0.6 * Math.sin(2 * ph - t * 0.8) * Math.cos(th * 3 + t)))
      const x = r * Math.sin(th) * Math.cos(ph), y = r * Math.cos(th), z = r * Math.sin(th) * Math.sin(ph)
      const a = t * 0.4, cs = Math.cos(a), sn = Math.sin(a)
      return [S / 2 + x * cs - z * sn, S / 2 + y, x * sn + z * cs]
    }
    const draw = (fn, n) => {
      let prev = fn(0)
      for (let i = 1; i <= n; i++) {
        const q = fn(i / n)
        const m = Math.min(1, Math.max(0, (q[1] - (S / 2 - R * 1.4)) / (R * 2.8)))
        ctx.strokeStyle = `rgba(${Math.round(37 + 87 * m)},${Math.round(99 - 41 * m)},${Math.round(235 + 2 * m)},${0.15 + 0.65 * (q[2] + R * 1.5) / (R * 3)})`
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); prev = q
      }
    }
    const loop = () => {
      amp += ((live.current ? 0.4 : 0.14) - amp) * 0.05; speed += ((live.current ? 2.2 : 0.5) - speed) * 0.05; t += 0.016 * speed
      ctx.clearRect(0, 0, S, S); ctx.lineWidth = 0.8
      for (let i = 1; i < 24; i++) draw((u) => pt((i / 24) * Math.PI, u * Math.PI * 2), 56)
      for (let j = 0; j < 32; j++) draw((u) => pt(u * Math.PI, (j / 32) * Math.PI * 2), 40)
      raf = requestAnimationFrame(loop)
    }
    loop(); return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} style={{ width: S, height: S }} aria-hidden />
}
export default function VoiceAssistant({ speech }) {
  const { listening, interim, error, toggle, clearError } = speech
  return (
    <section aria-label="Voice assistant" className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: S, height: S }}>
        {listening && <span className="ring absolute inset-6 rounded-full bg-sky-300/40" />}
        <button onClick={toggle} aria-label={listening ? 'Stop recording' : 'Start voice input'}
          className="relative flex items-center justify-center rounded-full border border-white/80 shadow-[0_20px_60px_-12px_rgba(56,189,248,0.7),0_0_40px_rgba(124,58,237,0.25)] transition active:scale-95"
          style={{ width: S - 20, height: S - 20, background: 'radial-gradient(circle at 30% 25%, #ffffff 0%, #BAE6FD 38%, #93B4FF 68%, #C4B5FD 100%)' }}>
          <Mesh listening={listening} />
        </button>
      </div>
      {listening ? (
        <>
          <p role="status" className="text-sm font-bold">Listening… speak now</p>
          <button onClick={toggle} className="flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-800"><Square size={14} fill="currentColor" />Stop recording</button>
        </>
      ) : <p className="text-sm text-navy-600">Tap the orb and ask your question</p>}
      {error && (
        <div role="alert" className="flex w-full items-start gap-2 rounded-xl bg-blush-200 p-3 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" /><span className="flex-1">{error}</span>
          <button onClick={clearError} className="font-bold underline">Dismiss</button>
        </div>
      )}
    </section>
  )
}
