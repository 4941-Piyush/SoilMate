// Languages supported by Sarvam AI (checked against docs.sarvam.ai).
// stt/translate: all 23 (Saaras v4 speech-to-text, Sarvam-Translate).
// core=true: also supported by Chat, Text-to-Speech, Mayura, Language-ID, Transliterate (10 Indian + English).
const L = (code, name, native, core) => ({ code, name, native, core: !!core, stt: true, translate: true, tts: !!core, chat: !!core })
export const LANGUAGES = [
  L('en-IN', 'English', 'English', 1), L('hi-IN', 'Hindi', 'हिन्दी', 1), L('bn-IN', 'Bengali', 'বাংলা', 1),
  L('gu-IN', 'Gujarati', 'ગુજરાતી', 1), L('kn-IN', 'Kannada', 'ಕನ್ನಡ', 1), L('ml-IN', 'Malayalam', 'മലയാളം', 1),
  L('mr-IN', 'Marathi', 'मराठी', 1), L('od-IN', 'Odia', 'ଓଡ଼ିଆ', 1), L('pa-IN', 'Punjabi', 'ਪੰਜਾਬੀ', 1),
  L('ta-IN', 'Tamil', 'தமிழ்', 1), L('te-IN', 'Telugu', 'తెలుగు', 1),
  L('as-IN', 'Assamese', 'অসমীয়া'), L('brx-IN', 'Bodo', 'बड़ो'), L('doi-IN', 'Dogri', 'डोगरी'),
  L('kok-IN', 'Konkani', 'कोंकणी'), L('ks-IN', 'Kashmiri', 'کٲشُر'), L('mai-IN', 'Maithili', 'मैथिली'),
  L('mni-IN', 'Manipuri', 'ꯃꯩꯇꯩꯂꯣꯟ'), L('ne-IN', 'Nepali', 'नेपाली'), L('sa-IN', 'Sanskrit', 'संस्कृतम्'),
  L('sat-IN', 'Santali', 'ᱥᱟᱱᱛᱟᱲᱤ'), L('sd-IN', 'Sindhi', 'سنڌي'), L('ur-IN', 'Urdu', 'اردو'),
]
// Frontend dropdown value -> Sarvam entry. Haryanvi is NOT a Sarvam language: it falls back to Hindi.
export function resolveLanguage(name = 'English') {
  if (name === 'Haryanvi') return { ...LANGUAGES.find((l) => l.code === 'hi-IN'), name: 'Haryanvi (reply in Hindi script)', fallback: true }
  return LANGUAGES.find((l) => l.name === name) || LANGUAGES[0]
}
