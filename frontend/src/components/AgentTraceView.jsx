import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CloudSun,
  Sprout,
  Coins,
  ShieldAlert,
  BookOpen,
  Landmark,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

const TOOL_ICONS = {
  get_weather: CloudSun,
  get_soil_data: Sprout,
  get_mandi_prices: Coins,
  query_crop_database: BookOpen,
  get_pest_and_disease_risk: ShieldAlert,
  get_government_schemes: Landmark,
  update_farmer_profile: MapPin
}

const TOOL_LABELS = {
  get_weather: 'Open-Meteo Weather API',
  get_soil_data: 'ISRIC SoilGrids API',
  get_mandi_prices: 'Agmarknet Mandi Prices (OGD)',
  query_crop_database: 'ICAR Agronomy Catalog',
  get_pest_and_disease_risk: 'Agro-Pest Risk Engine',
  get_government_schemes: 'Govt Schemes & Subsidies',
  update_farmer_profile: 'Farmer Location & Profile Geocoder'
}

export default function AgentTraceView({ toolCalls, t }) {
  const [expanded, setExpanded] = useState(true)
  const [selectedTool, setSelectedTool] = useState(null)

  if (!toolCalls || toolCalls.length === 0) return null

  return (
    <div className="rounded-xl border border-purple-500/25 bg-purple-950/40 p-2.5 text-xs backdrop-blur-md shadow-glass">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between font-bold text-purple-200 hover:text-white transition"
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          {t?.tabWorkflow || 'Autonomous Agent Workflow'} ({toolCalls.length} {t?.toolsInvoked || 'tools'})
        </span>
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 pt-2 border-t border-purple-500/20">
          {toolCalls.map((tc, idx) => {
            const Icon = TOOL_ICONS[tc.tool] || Sprout
            const label = TOOL_LABELS[tc.tool] || tc.tool
            const isSelected = selectedTool === idx

            return (
              <div
                key={idx}
                className="rounded-lg border border-purple-500/20 bg-dark-900/70 p-2.5 text-stone-200 space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Icon size={14} className="text-cyan-400" />
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-purple-400/80">
                    {tc.duration_ms && <span>{tc.duration_ms}ms</span>}
                    {tc.status === 'success' ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold">
                        <CheckCircle2 size={11} /> OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-amber-400 font-bold">
                        <AlertCircle size={11} /> Handled
                      </span>
                    )}
                  </div>
                </div>

                {tc.summary && (
                  <p className="text-[11px] text-stone-300 leading-snug">{tc.summary}</p>
                )}

                <button
                  onClick={() => setSelectedTool(isSelected ? null : idx)}
                  className="text-[10px] font-mono text-cyan-400 hover:underline inline-block"
                >
                  {isSelected ? 'Hide raw payloads' : 'View raw API payloads'}
                </button>

                {isSelected && (
                  <div className="mt-1 space-y-1 bg-dark-950/90 text-stone-200 p-2 rounded-lg text-[10px] font-mono overflow-x-auto max-h-48 border border-purple-500/30">
                    <div>
                      <span className="text-purple-400 font-bold">Inputs:</span>
                      <pre className="text-purple-200">{JSON.stringify(tc.inputs, null, 2)}</pre>
                    </div>
                    <div className="pt-1 border-t border-purple-500/20">
                      <span className="text-cyan-400 font-bold">Outputs:</span>
                      <pre className="text-cyan-200">{JSON.stringify(tc.outputs, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
