import { Languages } from 'lucide-react'
import { SPEECH_CODES } from '../hooks/useSpeech'
const NATIVE = { English: 'English', Hindi: 'हिन्दी', Punjabi: 'ਪੰਜਾਬੀ', Haryanvi: 'हरियाणवी', Bengali: 'বাংলা', Marathi: 'मराठी', Gujarati: 'ગુજરાતી', Tamil: 'தமிழ்', Telugu: 'తెలుగు', Kannada: 'ಕನ್ನಡ', Malayalam: 'മലയാളം', Odia: 'ଓଡ଼ିଆ', Urdu: 'اردو' }
export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 rounded-xl border border-navy bg-blush px-3 py-2">
        <Languages size={18} aria-hidden />
        <span className="sr-only">Language</span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm font-semibold focus:outline-none">
          {Object.keys(SPEECH_CODES).map((l) => <option key={l} value={l}>{NATIVE[l]}</option>)}
        </select>
      </label>
      <p className="px-1 text-xs text-navy-600">Speak naturally in your own language.</p>
    </div>
  )
}
