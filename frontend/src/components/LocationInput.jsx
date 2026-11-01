import React, { useState } from 'react'
import { MapPin, Search, Loader2, X } from 'lucide-react'
import { geocodePlace } from '../services/api'
import { localizePlaceName } from '../utils/geoLocalization'

const PRESETS = [
  { name: 'Nashik, Maharashtra', lat: 19.9975, lon: 73.7898, state: 'Maharashtra' },
  { name: 'Indore, MP', lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  { name: 'Guntur, AP', lat: 16.3067, lon: 80.4365, state: 'Andhra Pradesh' },
  { name: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  { name: 'Karnal, Haryana', lat: 29.6857, lon: 76.9905, state: 'Haryana' },
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873, state: 'Rajasthan' }
]

export default function LocationInput({ location, onLocationChange, t }) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await geocodePlace(query.trim())
      onLocationChange({
        name: `${res.name}${res.state ? ', ' + res.state : ''}`,
        lat: res.lat,
        lon: res.lon,
        state: res.state || ''
      })
      setQuery('')
      setOpen(false)
    } catch (err) {
      alert(`Could not find "${query}". Please try another place name.`)
    } finally {
      setSearching(false)
    }
  }

  const selectPreset = (p) => {
    onLocationChange({
      name: p.name,
      lat: p.lat,
      lon: p.lon,
      state: p.state
    })
    setOpen(false)
  }

  const clearLocation = (e) => {
    e.stopPropagation()
    onLocationChange(null)
  }

  return (
    <div className="relative">
      {/* Pill trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-purple-500/25 bg-purple-950/40 px-3 py-1.5 shadow-glass backdrop-blur-md cursor-pointer hover:border-purple-400 transition"
      >
        <MapPin size={16} className={location ? "text-cyan-400 shrink-0" : "text-purple-400 shrink-0"} />

        {location && location.name ? (
          <>
            <span className="flex-1 truncate text-xs sm:text-sm font-semibold text-purple-100">
              {localizePlaceName(location.name, t?._langCode || 'hi')}
            </span>
            {location.lat != null && (
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 hidden xs:inline">
                {location.lat.toFixed(1)}°, {location.lon.toFixed(1)}°
              </span>
            )}
            <button
              onClick={clearLocation}
              title="Clear location"
              className="text-purple-400 hover:text-red-400 p-0.5 transition"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <span className="flex-1 text-xs text-purple-300/70 font-medium">
            {t?.setLocation || 'Set Location (or tell agent)'}
          </span>
        )}
      </div>

      {/* Dropdown Modal */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-purple-500/30 bg-dark-900/95 p-3.5 shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-purple-500/20">
            <span className="text-xs font-bold text-purple-200">
              {t?.setLocationModalTitle || 'Set Farm Location'}
            </span>
            <button onClick={() => setOpen(false)} className="text-purple-400 hover:text-white cursor-pointer">
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder={t?.searchLocationPlaceholder || 'Search village, city, district...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-purple-500/30 bg-purple-950/50 px-3 py-1.5 text-xs sm:text-sm text-purple-100 placeholder-purple-400/50 outline-none focus:border-purple-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={searching}
              className="flex items-center justify-center rounded-xl bg-purple-600 px-3 text-white hover:bg-purple-500 transition disabled:opacity-50 cursor-pointer"
            >
              {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            </button>
          </form>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400/70 mb-1.5">
              {t?.popularAgroHubs || 'Popular Agro Hubs'}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => selectPreset(p)}
                  className="text-left text-xs font-medium text-purple-200 hover:bg-purple-800/40 hover:text-white px-2 py-1.5 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition truncate"
                >
                  {localizePlaceName(p.name, t?._langCode || 'hi')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
