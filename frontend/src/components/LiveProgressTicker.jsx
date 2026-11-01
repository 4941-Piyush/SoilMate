import React from 'react'
import { Loader2, Sparkles, CloudSun, Sprout, Coins, Globe, Volume2, MapPin } from 'lucide-react'

export default function LiveProgressTicker({ event }) {
  if (!event) return null

  const getIcon = () => {
    switch (event.type) {
      case 'tool_start':
        if (event.tool === 'get_weather') return <CloudSun size={15} className="text-amber-400 animate-spin" />
        if (event.tool === 'get_soil_data') return <Sprout size={15} className="text-emerald-400 animate-bounce" />
        if (event.tool === 'get_mandi_prices') return <Coins size={15} className="text-yellow-400 animate-pulse" />
        if (event.tool === 'update_farmer_profile') return <MapPin size={15} className="text-cyan-400 animate-bounce" />
        return <Loader2 size={15} className="animate-spin text-purple-400" />
      case 'translating':
        return <Globe size={15} className="text-cyan-400 animate-spin" />
      case 'speaking':
        return <Volume2 size={15} className="text-purple-300 animate-pulse" />
      case 'synthesizing':
      default:
        return <Sparkles size={15} className="text-purple-300 animate-pulse" />
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/60 px-3.5 py-2 text-xs font-semibold text-purple-100 shadow-glass backdrop-blur-md animate-pulse">
      {getIcon()}
      <span className="flex-1 truncate">{event.message || 'SoilMate is reasoning...'}</span>
      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/30">
        AGENT
      </span>
    </div>
  )
}
