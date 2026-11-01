import React, { useEffect, useRef } from 'react'
import { Square, AlertTriangle, Mic } from 'lucide-react'

const SIZE = 240

function MeshSphere({ listening }) {
  const canvasRef = useRef(null)
  const isListeningRef = useRef(listening)
  isListeningRef.current = listening

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    let amp = 0.14
    let speed = 0.6
    let t = 0
    let rafId

    const R = SIZE * 0.32

    const calcPoint = (th, ph) => {
      const deformation = (
        Math.sin(2 * th + t * 1.3) * Math.cos(3 * ph + t) +
        0.6 * Math.sin(2 * ph - t * 0.8) * Math.cos(th * 3 + t)
      )
      const r = R * (1 + amp * deformation)
      const x = r * Math.sin(th) * Math.cos(ph)
      const y = r * Math.cos(th)
      const z = r * Math.sin(th) * Math.sin(ph)

      const a = t * 0.45
      const cs = Math.cos(a)
      const sn = Math.sin(a)
      return [SIZE / 2 + x * cs - z * sn, SIZE / 2 + y, x * sn + z * cs]
    }

    const drawLine = (fn, n) => {
      let prev = fn(0)
      for (let i = 1; i <= n; i++) {
        const q = fn(i / n)
        const m = Math.min(1, Math.max(0, (q[1] - (SIZE / 2 - R * 1.4)) / (R * 2.8)))
        // Luminous purple to cyan electric gradient
        const rColor = Math.round(140 + 70 * m)
        const gColor = Math.round(80 + 120 * m)
        const bColor = Math.round(245 + 10 * m)
        const alpha = 0.2 + 0.7 * ((q[2] + R * 1.5) / (R * 3))

        ctx.strokeStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(prev[0], prev[1])
        ctx.lineTo(q[0], q[1])
        ctx.stroke()
        prev = q
      }
    }

    const render = () => {
      const targetAmp = isListeningRef.current ? 0.42 : 0.15
      const targetSpeed = isListeningRef.current ? 2.4 : 0.6

      amp += (targetAmp - amp) * 0.06
      speed += (targetSpeed - speed) * 0.06
      t += 0.016 * speed

      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.lineWidth = 1.0

      for (let i = 1; i < 22; i++) {
        drawLine((u) => calcPoint((i / 22) * Math.PI, u * Math.PI * 2), 52)
      }
      for (let j = 0; j < 28; j++) {
        drawLine((u) => calcPoint(u * Math.PI, (j / 28) * Math.PI * 2), 38)
      }

      rafId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: SIZE, height: SIZE }}
      className="pointer-events-none"
      aria-hidden="true"
    />
  )
}

export default function VoiceAssistant({
  speech,
  t,
  onSendInterim
}) {
  const { listening, interim, error, toggle, clearError } = speech

  return (
    <section aria-label="Voice Interaction" className="flex flex-col items-center justify-center py-2 select-none">
      <div className="relative flex items-center justify-center" style={{ width: SIZE + 20, height: SIZE + 20 }}>
        {/* Animated glowing rings when listening */}
        {listening && (
          <>
            <span className="pulse-ring absolute inset-2 rounded-full bg-purple-500/30 blur-sm pointer-events-none" />
            <span className="pulse-ring absolute inset-6 rounded-full bg-cyan-400/20 blur-md pointer-events-none" style={{ animationDelay: '0.6s' }} />
          </>
        )}

        {/* Glowing Orb Button */}
        <button
          onClick={toggle}
          aria-label={listening ? 'Stop listening' : 'Start push to talk voice'}
          className={`relative flex items-center justify-center rounded-full transition-transform active:scale-95 group focus:outline-none ${
            listening
              ? 'shadow-[0_0_80px_rgba(168,85,247,0.7),0_0_120px_rgba(56,189,248,0.4)] scale-105'
              : 'shadow-[0_15px_50px_-10px_rgba(124,58,237,0.5),0_0_30px_rgba(56,189,248,0.2)] hover:scale-102'
          }`}
          style={{
            width: SIZE - 10,
            height: SIZE - 10,
            background: 'radial-gradient(circle at 32% 28%, #ffffff 0%, #E9D5FF 28%, #A855F7 65%, #4C1D95 95%, #1E0E45 100%)',
            border: '2px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          <MeshSphere listening={listening} />
          
          {/* Subtle center icon indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`p-3 rounded-full backdrop-blur-md transition ${
              listening 
                ? 'bg-purple-900/60 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] scale-110' 
                : 'bg-black/20 text-purple-100 opacity-60 group-hover:opacity-90'
            }`}>
              {listening ? <Square size={20} fill="currentColor" /> : <Mic size={24} />}
            </div>
          </div>
        </button>
      </div>

      {/* Voice Status Text */}
      <div className="mt-3 text-center">
        {listening ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-semibold tracking-wide animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              {t?.listening || "Listening... Speak clearly"}
            </div>
            {interim && (
              <p className="max-w-xs text-sm font-medium text-purple-100 italic bg-purple-950/40 px-3 py-1 rounded-xl border border-purple-500/20">
                "{interim}"
              </p>
            )}
            <button
              onClick={toggle}
              className="mt-1 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold transition shadow-glass border border-red-400/40 cursor-pointer"
            >
              <Square size={12} fill="currentColor" /> {t?.endLiveCall || "End Live Call"}
            </button>
          </div>
        ) : (
          <p className="text-xs font-medium text-purple-300/80 tracking-wide">
            {t?.tapToSpeak || "Tap the orb to speak with SoilMate"}
          </p>
        )}
      </div>

      {/* Error alert if mic fails */}
      {error && (
        <div role="alert" className="mt-3 flex w-full max-w-sm items-start gap-2 rounded-xl bg-red-950/80 border border-red-500/40 p-2.5 text-xs text-red-200 shadow-lg">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
          <span className="flex-1">{error}</span>
          <button onClick={clearError} className="font-bold text-red-300 underline hover:text-white">
            Dismiss
          </button>
        </div>
      )}
    </section>
  )
}

