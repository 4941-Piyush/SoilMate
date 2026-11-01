import { useState } from 'react'
import WeatherWidget from './WeatherWidget'
import AdvicePanel from './AdvicePanel'
import SchedulePanel from './SchedulePanel'
function Tab({ id, tab, setTab, children }) {
  return <button onClick={() => setTab(id)} aria-pressed={tab === id}
    className={`flex-1 rounded-xl border border-navy px-4 py-3 text-sm font-bold transition ${tab === id ? 'border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-soft' : 'bg-transparent text-navy hover:bg-blush-200'}`}>{children}</button>
}
export default function DashboardPanel({ weather, location, onLocation, advice, schedule, loading }) {
  const [tab, setTab] = useState('advice')
  return (
    <main className="scroll-thin min-w-0 flex-1 space-y-4 p-5 lg:h-full lg:overflow-y-auto lg:p-8">
      <WeatherWidget weather={weather} location={location} onLocation={onLocation} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Tab id="advice" tab={tab} setTab={setTab}>Crop Protection Advice</Tab>
        <Tab id="schedule" tab={tab} setTab={setTab}>Planting &amp; Harvesting Schedule</Tab>
      </div>
      <div key={tab} className="pane">{tab === 'advice' ? <AdvicePanel data={advice} loading={loading} /> : <SchedulePanel data={schedule} loading={loading} />}</div>
    </main>
  )
}
