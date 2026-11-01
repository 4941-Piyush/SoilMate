import { useEffect, useState, useCallback } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import ChatPanel from './components/ChatPanel'
import DashboardPanel from './components/DashboardPanel'
import { fetchCropAdvice, fetchSchedule, fetchWeather } from './services/api'

export default function App() {
  const [language, setLanguage] = useState('English')
  const [leftW, setLeftW] = useState(460)
  const [location, setLocation] = useState('Haryana')
  const [weather, setWeather] = useState(null)
  const [advice, setAdvice] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const notify = useCallback((msg, kind = 'ok') => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3500) }, [])

  useEffect(() => {
    setLoading(true)
    const p = { language, location }
    Promise.all([fetchCropAdvice(p), fetchSchedule(p), fetchWeather(p)])
      .then(([a, s, w]) => { setAdvice(a); setSchedule(s); setWeather(w) })
      .catch(() => notify('Could not load dashboard data.', 'error'))
      .finally(() => setLoading(false))
  }, [language, location, notify])

  // Backend chat replies may include fresh advice/schedule
  const onReply = (res) => { if (res.advice) setAdvice(res.advice); if (res.schedule) setSchedule(res.schedule) }

  return (
    <div className="min-h-full lg:flex lg:h-full lg:overflow-hidden" style={{ '--lw': `${leftW}px`, background: 'radial-gradient(circle at 15% 25%, #BAE6FD99, transparent 50%), radial-gradient(circle at 92% 8%, #C4B5FD66, transparent 45%), #F5F8FF' }}>
      <ChatPanel language={language} setLanguage={setLanguage} location={location} notify={notify} onReply={onReply} />
      <div aria-hidden title="Drag to resize · double-click to reset" className="relative z-10 -mx-1.5 hidden w-3 shrink-0 cursor-col-resize touch-none lg:block"
        onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
        onPointerMove={(e) => { if (e.buttons === 1) setLeftW(Math.round(Math.min(Math.max(e.clientX, 320), window.innerWidth * 0.7))) }}
        onDoubleClick={() => setLeftW(460)} />
      <DashboardPanel weather={weather} location={location} onLocation={setLocation} advice={advice} schedule={schedule} loading={loading} />
      {toast && (
        <div role="status" className={`fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-soft ${toast.kind === 'error' ? 'bg-black' : 'bg-navy'}`}>
          {toast.kind === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}{toast.msg}
        </div>
      )}
    </div>
  )
}
