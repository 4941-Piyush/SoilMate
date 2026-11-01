import { MapPin } from 'lucide-react'
const STATES = ['Haryana', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Maharashtra', 'Gujarat', 'Madhya Pradesh', 'Bihar', 'West Bengal', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Odisha']
const Item = ({ label, value }) => <div><p className="text-[11px] opacity-70">{label}</p><p className="text-base font-bold">{value ?? '--'}</p></div>
// weather = {summary, temperatureC, humidity, rainProbability, forecast:[{day, summary}]} ; null = API not connected
export default function WeatherWidget({ weather, location, onLocation }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-gradient-to-r from-navy via-[#3B3FB8] to-violet-600 p-4 text-white shadow-soft">
      <label className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm">
        <MapPin size={16} /><span className="sr-only">Location</span>
        <select value={location} onChange={(e) => onLocation(e.target.value)} className="bg-transparent font-semibold focus:outline-none">
          {STATES.map((s) => <option key={s} className="text-black">{s}</option>)}
        </select>
      </label>
      <Item label="Weather" value={weather?.summary} />
      <Item label="Temperature" value={weather && `${weather.temperatureC}°C`} />
      <Item label="Humidity" value={weather && `${weather.humidity}%`} />
      <Item label="Rain chance" value={weather && `${weather.rainProbability}%`} />
      <Item label="Forecast" value={weather?.forecast?.map((f) => `${f.day}: ${f.summary}`).join(' · ')} />
      {!weather && <p className="w-full text-xs opacity-70">Weather API not connected. Live values will appear here.</p>}
    </div>
  )
}
