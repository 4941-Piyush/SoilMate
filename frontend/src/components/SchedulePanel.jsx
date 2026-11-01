import React from 'react'
import { Calendar, Clock, Droplets, Scissors, Sprout } from 'lucide-react'
import { localizeCropName } from '../utils/geoLocalization'

export default function SchedulePanel({ advisory, t }) {
  if (advisory) {
    const sowing = advisory.sowing_window
    const harvesting = advisory.harvesting_window
    const irrigation = advisory.irrigation_schedule

    return (
      <div className="space-y-4">
        {/* Timeline Summary Header */}
        <div className="rounded-2xl border border-purple-500/25 bg-purple-950/40 p-4 shadow-glass backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            {t?.scheduleTitle || 'Seasonal Calendar'}
          </span>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-0.5">
            <Calendar className="text-cyan-400" />
            {localizeCropName(advisory.crop_name, t?._langCode || 'hi')} {t?.tabSchedule || 'Schedule'}
          </h2>
          {advisory.season && (
            <p className="text-xs text-purple-300 mt-1">
              Season: <strong className="text-white capitalize">{advisory.season}</strong>
            </p>
          )}
        </div>

        {/* Windows Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-glass">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
              <Sprout size={16} /> {t?.optimalSowing || 'Optimal Sowing Window'}
            </div>
            <p className="text-sm font-semibold text-white">
              {sowing || 'Calculated dynamically based on monsoon and temperature onset'}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 shadow-glass">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
              <Scissors size={16} /> {t?.harvestingWindow || 'Harvesting Window'}
            </div>
            <p className="text-sm font-semibold text-white">
              {harvesting || 'Targeted at 110-120 days maturity'}
            </p>
          </div>
        </div>

        {/* Irrigation & Operations Milestones */}
        <div className="rounded-2xl border border-purple-500/20 bg-dark-900/70 p-4 shadow-glass backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Droplets size={15} className="text-cyan-400" /> {t?.irrigationStages || 'Critical Irrigation Stages'}
          </h3>

          <div className="space-y-2 text-xs text-stone-200">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/15 flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-900/60 text-cyan-300 text-[10px] font-bold">1</span>
              <div>
                <p className="font-semibold text-white">Basal / Crown Root Initiation (CRI)</p>
                <p className="text-stone-300 text-[11px] mt-0.5">20-25 days after sowing. Most critical water stage for root branching.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/15 flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-900/60 text-cyan-300 text-[10px] font-bold">2</span>
              <div>
                <p className="font-semibold text-white">Tillering & Flowering Stage</p>
                <p className="text-stone-300 text-[11px] mt-0.5">Ensure consistent moisture to prevent grain abortion and maximize spikes.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/15 flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-900/60 text-cyan-300 text-[10px] font-bold">3</span>
              <div>
                <p className="font-semibold text-white">Milking & Grain Filling</p>
                <p className="text-stone-300 text-[11px] mt-0.5">Light irrigation during dough stage. Cease watering 10 days before harvest.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Zero mock empty state
  return (
    <div className="rounded-2xl border border-purple-500/20 bg-dark-900/50 p-8 text-center backdrop-blur-md shadow-glass flex flex-col items-center justify-center space-y-3">
      <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-cyan-400">
        <Calendar size={28} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{t?.noScheduleTitle || 'No Planting Schedule Generated'}</h3>
        <p className="text-xs text-purple-300/70 max-w-sm mt-1 leading-relaxed">
          {t?.noScheduleDesc || 'Ask SoilMate for sowing dates to generate a seasonal timeline.'}
        </p>
      </div>
    </div>
  )
}

