import React, { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown, Check } from 'lucide-react'

export const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'od', name: 'Odia', native: 'ଓଡ଼ିଆ' }
]

export default function LanguageSelector({ value, onChange, label = 'UI:' }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Auto-close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = INDIAN_LANGUAGES.find((l) => l.code === value) || INDIAN_LANGUAGES[0]

  return (
    <div className="relative min-w-0" ref={dropdownRef}>
      {/* Pill Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-1.5 rounded-xl border border-purple-500/25 bg-purple-950/40 px-3 py-1.5 shadow-glass backdrop-blur-md hover:border-purple-400/60 transition cursor-pointer text-left focus:outline-none focus:border-purple-400"
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          <Languages size={15} className="text-purple-400 shrink-0" />
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider shrink-0 whitespace-nowrap hidden sm:inline">
            {label}
          </span>
          <span className="truncate text-xs sm:text-sm font-semibold text-purple-200">
            {current.native} <span className="text-purple-400 text-[11px] font-normal">({current.name})</span>
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-purple-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Floating Glassmorphism Menu */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-60 max-h-64 overflow-y-auto rounded-2xl border border-purple-500/30 bg-[#120B24] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50 scroll-thin">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 border-b border-purple-500/20 mb-1">
            {label ? `${label} Language` : 'Select UI Language'}
          </div>
          {INDIAN_LANGUAGES.map((lang) => {
            const isSelected = lang.code === current.code
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onChange(lang.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white shadow-sm'
                    : 'text-purple-200 hover:text-white hover:bg-purple-900/40'
                }`}
              >
                <span>
                  {lang.native} <span className="text-purple-300 text-[11px]">({lang.name})</span>
                </span>
                {isSelected && <Check size={14} className="text-white shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
