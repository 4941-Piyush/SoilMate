import React, { useEffect, useState } from 'react'
import { CloudSun, CloudRain, Wind, AlertTriangle, ShieldCheck, RefreshCw, MapPin } from 'lucide-react'
import { fetchLiveWeather } from '../services/api'
import { localizePlaceName } from '../utils/geoLocalization'

export default function WeatherWidget({ location }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadWeather = async () => {
    if (!location?.lat || !location?.lon) {
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetchLiveWeather(location.lat, location.lon)
      setData(res)
    } catch (e) {
      setError(e.message || 'Could not fetch weather')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather()
  }, [location?.lat, location?.lon])

  if (!location?.lat || !location?.lon) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-dark-900/50 p-6 text-center backdrop-blur-md shadow-glass flex flex-col items-center justify-center space-y-2.5">
        <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-amber-400">
          <CloudSun size={26} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Live Weather Awaiting Location</h4>
          <p className="text-xs text-purple-300/70 max-w-sm mt-1 leading-relaxed">
            Please set your location in the top bar or mention your village to SoilMate in conversation to load real-time agro-weather data.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-purple-500/25 bg-dark-900/70 p-6 shadow-glass flex items-center justify-center gap-2.5 text-purple-300 text-xs backdrop-blur-md">
        <RefreshCw size={18} className="animate-spin text-purple-400" />
        <span>Fetching live 7-day forecast from Open-Meteo...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-dark-900/60 p-4 text-xs text-purple-300 shadow-glass">
        <p className="font-semibold text-white">Weather Data Unavailable</p>
        <p className="mt-1 text-purple-400/80">{error || 'Could not retrieve forecast.'}</p>
      </div>
    )
  }

  const current = data.current || {}
  const daily = data.daily || {}
  const alerts = data.alerts || []

  return (
    <div className="rounded-2xl border border-purple-500/25 bg-dark-900/70 p-5 shadow-glass space-y-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CloudSun className="text-amber-400" size={24} />
          <div>
            <h3 className="text-sm font-bold text-white">7-Day Agro-Weather Outlook</h3>
            <p className="text-xs text-purple-300/70">
              Live numerical forecast for {localizePlaceName(location.name, 'hi') || 'farm'}
            </p>
          </div>
        </div>
        <button
          onClick={loadWeather}
          className="text-xs text-purple-400 hover:text-white flex items-center gap-1 transition"
          title="Refresh forecast"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Current Temp</span>
          <span className="text-lg font-black text-white">{current.temperature_2m ?? 'N/A'}°C</span>
        </div>
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Humidity</span>
          <span className="text-lg font-black text-white">{current.relative_humidity_2m ?? 'N/A'}%</span>
        </div>
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Precipitation</span>
          <span className="text-lg font-black text-cyan-300">{current.precipitation ?? 0} mm</span>
        </div>
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Wind Speed</span>
          <span className="text-lg font-black text-white">{current.wind_speed_10m ?? 'N/A'} km/h</span>
        </div>
      </div>

      {/* Agro-Weather Alerts if any */}
      {alerts.length > 0 ? (
        <div className="rounded-xl bg-amber-950/40 border border-amber-500/30 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
            <AlertTriangle size={14} className="text-amber-400" />
            <span>Active Agricultural Weather Alerts ({alerts.length})</span>
          </div>
          {alerts.map((al, idx) => (
            <p key={idx} className="text-[11px] text-amber-100 leading-snug">
              • <strong className="text-amber-300">{al.type}:</strong> {al.message}
            </p>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
          <ShieldCheck size={16} />
          <span>No critical weather threats or heatwave alerts for this location.</span>
        </div>
      )}

      {/* 7-Day Forecast Row */}
      {daily.time && (
        <div className="pt-2 border-t border-purple-500/15">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/80 block mb-2">
            Next 7 Days Forecast
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center text-xs">
            {daily.time.slice(0, 7).map((d, i) => (
              <div key={d} className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/10">
                <span className="text-[10px] text-purple-400/80 block font-mono">
                  {new Date(d).toLocaleDateString([], { weekday: 'short' })}
                </span>
                <span className="text-xs font-bold text-white block mt-0.5">
                  {daily.temperature_2m_max?.[i] ?? '-'}°
                </span>
                <span className="text-[10px] text-cyan-300 block">
                  {daily.precipitation_sum?.[i] ?? 0}mm
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
