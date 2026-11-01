import React, { useEffect, useState } from 'react'
import { Sprout, RefreshCw, Layers, Droplet, FlaskConical } from 'lucide-react'
import { fetchLiveSoil } from '../services/api'

export default function SoilWidget({ location }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSoil = async () => {
    if (!location?.lat || !location?.lon) {
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetchLiveSoil(location.lat, location.lon)
      setData(res)
    } catch (e) {
      setError(e.message || 'Could not fetch soil analysis')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSoil()
  }, [location?.lat, location?.lon])

  if (!location?.lat || !location?.lon) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-dark-900/50 p-6 text-center backdrop-blur-md shadow-glass flex flex-col items-center justify-center space-y-2.5">
        <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-emerald-400">
          <FlaskConical size={26} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Soil Analysis Awaiting Location</h4>
          <p className="text-xs text-purple-300/70 max-w-sm mt-1 leading-relaxed">
            Set your location in the top bar or mention your village in chat to query real-time ISRIC SoilGrids texture, pH, and nitrogen metrics.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-purple-500/25 bg-dark-900/70 p-6 shadow-glass flex items-center justify-center gap-2.5 text-purple-300 text-xs backdrop-blur-md">
        <RefreshCw size={18} className="animate-spin text-purple-400" />
        <span>Querying ISRIC SoilGrids 250m satellite layers...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-dark-900/60 p-4 text-xs text-purple-300 shadow-glass">
        <p className="font-semibold text-white">Soil Data Unavailable</p>
        <p className="mt-1 text-purple-400/80">{error || 'Could not retrieve soil profile.'}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-purple-500/25 bg-dark-900/70 p-5 shadow-glass space-y-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sprout className="text-emerald-400" size={24} />
          <div>
            <h3 className="text-sm font-bold text-white">Topsoil Properties (ISRIC SoilGrids)</h3>
            <p className="text-xs text-purple-300/70">
              Live physical & chemical soil profile for {location.name || 'farm'}
            </p>
          </div>
        </div>
        <button
          onClick={loadSoil}
          className="text-xs text-purple-400 hover:text-white flex items-center gap-1 transition"
          title="Refresh soil metrics"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Soil Texture</span>
          <span className="text-base font-black text-white">{data.soil_type || 'Loamy'}</span>
        </div>
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">pH Level</span>
          <span className="text-base font-black text-cyan-300">{data.ph}</span>
        </div>
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Organic Carbon</span>
          <span className="text-base font-black text-white">{data.organic_carbon_g_kg} g/kg</span>
        </div>
        <div className="rounded-xl bg-purple-950/40 p-2.5 border border-purple-500/15">
          <span className="text-[10px] text-purple-400/80 uppercase font-bold block">Total Nitrogen</span>
          <span className="text-base font-black text-white">{data.nitrogen_g_kg} g/kg</span>
        </div>
      </div>

      {/* pH Agronomic Interpretation */}
      <div className="rounded-xl bg-purple-950/50 border border-purple-500/20 p-3 space-y-1">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
          Agronomic Soil Interpretation
        </span>
        <p className="text-xs text-stone-200 leading-relaxed">
          {data.ph_interpretation}
        </p>
      </div>

      {/* Granular Texture Breakdown */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/80 block mb-2">
          Soil Granulometry (USDA Texture Triangle)
        </span>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-purple-200">
              <span>Sand ({data.sand_pct}%)</span>
              <span className="text-[11px] text-purple-400">Aeration & Drainage</span>
            </div>
            <div className="h-1.5 w-full bg-purple-950/80 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(data.sand_pct, 100)}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-purple-200">
              <span>Silt ({data.silt_pct}%)</span>
              <span className="text-[11px] text-purple-400">Nutrient Holding</span>
            </div>
            <div className="h-1.5 w-full bg-purple-950/80 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(data.silt_pct, 100)}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-purple-200">
              <span>Clay ({data.clay_pct}%)</span>
              <span className="text-[11px] text-purple-400">Moisture Retention</span>
            </div>
            <div className="h-1.5 w-full bg-purple-950/80 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(data.clay_pct, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
