import React, { useEffect, useState } from 'react'
import { Coins, Search, ArrowUpRight, TrendingUp, RefreshCw } from 'lucide-react'
import { fetchLiveMandi } from '../services/api'

const COMMODITIES = ['Wheat', 'Mustard', 'Soybean', 'Onion', 'Potato', 'Cotton', 'Maize', 'Gram']

export default function MandiWidget({ location }) {
  const [commodity, setCommodity] = useState('Wheat')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadMandi = async () => {
    setLoading(true)
    setError(null)
    try {
      const stateToQuery = location?.state || ''
      const res = await fetchLiveMandi(stateToQuery, commodity)
      setData(res)
    } catch (e) {
      setError(e.message || 'Could not fetch mandi rates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMandi()
  }, [commodity, location?.state])

  const markets = data?.markets || []
  const best = data?.best_market

  return (
    <div className="rounded-2xl border border-purple-500/25 bg-dark-900/70 p-5 shadow-glass space-y-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Coins className="text-yellow-400" size={24} />
          <div>
            <h3 className="text-sm font-bold text-white">APMC Mandi Price Intelligence</h3>
            <p className="text-xs text-purple-300/70">
              Live quotes from Agmarknet (data.gov.in)
              {location?.state && ` in ${location.state}`}
            </p>
          </div>
        </div>
        <button
          onClick={loadMandi}
          className="text-xs text-purple-400 hover:text-white flex items-center gap-1 transition"
          title="Refresh mandi rates"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Commodity Selector Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {COMMODITIES.map((c) => (
          <button
            key={c}
            onClick={() => setCommodity(c)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
              commodity === c
                ? 'bg-purple-600 text-white shadow-glass border border-purple-400/40'
                : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-500/20'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center gap-2 text-purple-300 text-xs">
          <RefreshCw size={16} className="animate-spin text-purple-400" />
          <span>Searching Agmarknet database for {commodity} quotes...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-purple-950/40 text-xs text-purple-300 border border-purple-500/20">
          <p className="font-semibold text-white">Notice</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : (
        <>
          {/* Best Market Highlight Card */}
          {best ? (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-yellow-300 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-yellow-400" /> Best Local Market Price
                </span>
                <span className="text-[11px] font-mono text-stone-300">
                  {best.arrival_date || 'Today'}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h4 className="text-base font-bold text-white">{best.market}</h4>
                  <p className="text-xs text-stone-300">{best.district}, {best.state}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-yellow-300">₹{best.modal_price}</span>
                  <span className="text-[10px] text-stone-400 block font-semibold">/ quintal (Modal)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300">
              No recent quotes found for {commodity} in this state. Try selecting another commodity.
            </div>
          )}

          {/* Markets List */}
          {markets.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/80 block">
                Regional APMC Mandi Listings ({markets.length})
              </span>
              <div className="max-h-56 overflow-y-auto space-y-1.5 scroll-thin pr-1">
                {markets.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/15 hover:border-purple-500/30 transition text-xs"
                  >
                    <div>
                      <h5 className="font-bold text-white">{m.market}</h5>
                      <p className="text-[11px] text-purple-300/70">{m.district} · {m.variety || 'Standard'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-100">₹{m.modal_price}</span>
                      <span className="text-[10px] text-purple-400/60 block">₹{m.min_price} - ₹{m.max_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
