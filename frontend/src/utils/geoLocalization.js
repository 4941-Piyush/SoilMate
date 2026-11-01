// Comprehensive Localization for Indian Geography, States, Crops & Soils
// Ensures that on-screen entities (farm location, state, crop, soil) strictly match
// the selected UI language across Hindi, Telugu, Marathi, Tamil, Punjabi, Bengali & English.

export const INDIAN_STATES = {
  "Haryana": { hi: "हरियाणा", te: "హర్యానా", mr: "हरियाणा", ta: "ஹரியானா", pa: "ਹਰਿਆਣਾ", bn: "হরিয়ানা", en: "Haryana" },
  "Punjab": { hi: "पंजाब", te: "పంజాబ్", mr: "पंजाब", ta: "பஞ்சாப்", pa: "ਪੰਜਾਬ", bn: "পাঞ্জাব", en: "Punjab" },
  "Maharashtra": { hi: "महाराष्ट्र", te: "మహారాష్ట్ర", mr: "महाराष्ट्र", ta: "மகாராஷ்டிரா", pa: "ਮਹਾਰਾਸ਼ਟਰ", bn: "মহারাষ্ট্র", en: "Maharashtra" },
  "Madhya Pradesh": { hi: "मध्य प्रदेश", te: "మధ్యప్రదేశ్", mr: "मध्य प्रदेश", ta: "மத்தியப் பிரதேசம்", pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼", bn: "মধ্যপ্রদেশ", en: "Madhya Pradesh" },
  "MP": { hi: "मध्य प्रदेश", te: "మధ్యప్రదేశ్", mr: "मध्य प्रदेश", ta: "மத்தியப் பிரதேசம்", pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼", bn: "মধ্যপ্রদেশ", en: "Madhya Pradesh" },
  "Rajasthan": { hi: "राजस्थान", te: "రాజస్థాన్", mr: "राजस्थान", ta: "ராஜஸ்தான்", pa: "ਰਾਜਸਥਾਨ", bn: "রাজস্থান", en: "Rajasthan" },
  "Andhra Pradesh": { hi: "आंध्र प्रदेश", te: "ఆంధ్రప్రదేశ్", mr: "आंध्र प्रदेश", ta: "ஆந்திரப் பிரதேசம்", pa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼", bn: "অন্ধ্রপ্রদেশ", en: "Andhra Pradesh" },
  "AP": { hi: "आंध्र प्रदेश", te: "ఆంధ్రప్రదేశ్", mr: "आंध्र प्रदेश", ta: "ஆந்திரப் பிரதேசம்", pa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼", bn: "অন্ধ্রপ্রদেশ", en: "Andhra Pradesh" },
  "Uttar Pradesh": { hi: "उत्तर प्रदेश", te: "ఉత్తరప్రదేశ్", mr: "उत्तर प्रदेश", ta: "உத்தரப் பிரதேசம்", pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼", bn: "উত্তরপ্রদেশ", en: "Uttar Pradesh" },
  "UP": { hi: "उत्तर प्रदेश", te: "ఉత్తరప్రదేశ్", mr: "उत्तर प्रदेश", ta: "உத்தரப் பிரதேசம்", pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼", bn: "উত্তরপ্রদেশ", en: "Uttar Pradesh" },
  "Gujarat": { hi: "गुजरात", te: "గుజరాత్", mr: "गुजरात", ta: "குஜராத்", pa: "ਗੁਜਰਾਤ", bn: "গুজরাট", en: "Gujarat" },
  "Karnataka": { hi: "कर्नाटक", te: "కర్ణాటక", mr: "कर्नाटक", ta: "கர்நாடகா", pa: "ਕਰਨਾਟਕ", bn: "কর্ণাটক", en: "Karnataka" },
  "Tamil Nadu": { hi: "तमिलनाडु", te: "తమిళనాడు", mr: "तमिळनाडू", ta: "தமிழ்நாடு", pa: "ਤਾਮਿਲਨਾਡੂ", bn: "তামিলনাড়ু", en: "Tamil Nadu" },
  "Telangana": { hi: "तेलंगाना", te: "తెలంగాణ", mr: "तेलंगणा", ta: "தெலங்கானா", pa: "ਤੇਲੰਗਾਨਾ", bn: "তেলেঙ্গানা", en: "Telangana" },
  "West Bengal": { hi: "पश्चिम बंगाल", te: "పశ్చిమ బెంగాల్", mr: "पश्चिम बंगाल", ta: "மேற்கு வங்காளம்", pa: "ਪੱਛਮੀ ਬੰਗਾਲ", bn: "পশ্চিমবঙ্গ", en: "West Bengal" },
  "Bihar": { hi: "बिहार", te: "బీహార్", mr: "बिहार", ta: "பீகார்", pa: "ਬਿਹਾਰ", bn: "বিহার", en: "Bihar" },
  "Odisha": { hi: "ओडिशा", te: "ఒడిశా", mr: "ओडिशा", ta: "ஒடிசா", pa: "ਓਡੀਸ਼ਾ", bn: "ওড়িশা", en: "Odisha" },
  "Kerala": { hi: "केरल", te: "కేరళ", mr: "केरळ", ta: "கேரளா", pa: "ਕੇਰਲ", bn: "কেরালা", en: "Kerala" },
  "Assam": { hi: "असम", te: "అస్సాం", mr: "आसाम", ta: "அசாம்", pa: "ਅਸਾਮ", bn: "আসাম", en: "Assam" },
  "Himachal Pradesh": { hi: "हिमाचल प्रदेश", te: "హిమాచల్ ప్రదేశ్", mr: "हिमाचल प्रदेश", ta: "இமாச்சலப் பிரதேசம்", pa: "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼", bn: "হিমাচল প্রদেশ", en: "Himachal Pradesh" },
  "Uttarakhand": { hi: "उत्तराखंड", te: "ఉత్తరాఖండ్", mr: "उत्तराखंड", ta: "உத்தராகண்ட்", pa: "ਉੱਤਰਾਖੰਡ", bn: "উত্তরাখণ্ড", en: "Uttarakhand" },
  "Chhattisgarh": { hi: "छत्तीसगढ़", te: "ఛత్తీస్‌గఢ్", mr: "छत्तीसगड", ta: "சத்தீஸ்கர்", pa: "ਛੱਤੀਸਗੜ੍ਹ", bn: "ছত্তিশগড়", en: "Chhattisgarh" },
  "Jharkhand": { hi: "झारखंड", te: "జార్ఖండ్", mr: "झारखंड", ta: "ஜார்க்கண்ட்", pa: "ਝਾਰਖੰਡ", bn: "ঝাড়খণ্ড", en: "Jharkhand" },
  "Delhi": { hi: "दिल्ली", te: "ఢిల్లీ", mr: "दिल्ली", ta: "டெல்லி", pa: "ਦਿੱਲੀ", bn: "দিল্লি", en: "Delhi" }
}

export const INDIAN_CITIES = {
  "Kurukshetra": { hi: "कुरुक्षेत्र", te: "కురుక్షేత్రం", mr: "कुरुक्षेत्र", ta: "குருக்ஷேத்திரம்", pa: "ਕੁਰੂਕਸ਼ੇਤਰ", bn: "কুরুক্ষেত্র", en: "Kurukshetra" },
  "Karnal": { hi: "करनाल", te: "కర్నాల్", mr: "करनाल", ta: "கர்னால்", pa: "ਕਰਨਾਲ", bn: "কার্নাল", en: "Karnal" },
  "Ambala": { hi: "अंबाला", te: "అంబాలా", mr: "अंबाला", ta: "அம்பாலா", pa: "ਅੰਬਾਲਾ", bn: "আম্বালা", en: "Ambala" },
  "Panipat": { hi: "पानीपत", te: "పానిపట్", mr: "पानीपत", ta: "பானிபட்", pa: "ਪਾਨੀਪਤ", bn: "পানিপথ", en: "Panipat" },
  "Sonipat": { hi: "सोनीपत", te: "సోనిపట్", mr: "सोनीपत", ta: "சோனிபட்", pa: "ਸੋਨੀਪਤ", bn: "সোনিপত", en: "Sonipat" },
  "Rohtak": { hi: "रोहतक", te: "రోహ్‌తక్", mr: "रोहतक", ta: "ரோஹ்தக்", pa: "ਰੋਹਤਕ", bn: "রোহতক", en: "Rohtak" },
  "Hisar": { hi: "हिसार", te: "హిసార్", mr: "हिसार", ta: "ஹிசார்", pa: "ਹਿਸਾਰ", bn: "হিসার", en: "Hisar" },
  "Sirsa": { hi: "सिरसा", te: "సిర్సా", mr: "सिरसा", ta: "சிர்சா", pa: "ਸਿਰਸਾ", bn: "সিরসা", en: "Sirsa" },
  "Nashik": { hi: "नासिक", te: "నాసిక్", mr: "नाशिक", ta: "நாசிக்", pa: "ਨਾਸਿਕ", bn: "নাসিক", en: "Nashik" },
  "Pune": { hi: "पुणे", te: "పుణె", mr: "पुणे", ta: "புனே", pa: "ਪੁਣੇ", bn: "পুনে", en: "Pune" },
  "Nagpur": { hi: "नागपुर", te: "నాగ్‌పూర్", mr: "नागपूर", ta: "நாக்பூர்", pa: "ਨਾਗਪੁਰ", bn: "নাগপুর", en: "Nagpur" },
  "Solapur": { hi: "सोलापुर", te: "సోలాపూర్", mr: "सोलापूर", ta: "சோலாப்பூர்", pa: "ਸੋਲਾਪੁਰ", bn: "সোলাপুর", en: "Solapur" },
  "Indore": { hi: "इंदौर", te: "ఇందోర్", mr: "इंदूर", ta: "இந்தோர்", pa: "ਇੰਦੌਰ", bn: "ইন্দোর", en: "Indore" },
  "Bhopal": { hi: "भोपाल", te: "భోపాల్", mr: "भोपाळ", ta: "போபால்", pa: "ਭੋਪਾਲ", bn: "ভোপাল", en: "Bhopal" },
  "Ujjain": { hi: "उज्जैन", te: "ఉజ్జయిని", mr: "उज्जैन", ta: "உஜ்ஜைன்", pa: "ਉਜੈਨ", bn: "উজ্জয়িনী", en: "Ujjain" },
  "Jabalpur": { hi: "जबलपुर", te: "జబల్‌పూర్", mr: "जबलपूर", ta: "ஜபல்பூர்", pa: "ਜਬਲਪੁਰ", bn: "জবলপুর", en: "Jabalpur" },
  "Guntur": { hi: "गुंटूर", te: "గుంటూరు", mr: "गुंटूर", ta: "குண்டூர்", pa: "ਗੁੰਟੂਰ", bn: "গুন্টুর", en: "Guntur" },
  "Vijayawada": { hi: "विजयवाड़ा", te: "విజయవాడ", mr: "विजयवाडा", ta: "விஜயவாடா", pa: "ਵਿਜੇਵਾੜਾ", bn: "বিজয়ওয়াড়া", en: "Vijayawada" },
  "Visakhapatnam": { hi: "विशाखापट्टनम", te: "విశాఖపట్నం", mr: "विशाखापट्टणम", ta: "விசாகப்பட்டினம்", pa: "ਵਿਸ਼ਾਖਾਪਟਨਮ", bn: "বিশাখাপত্তনম", en: "Visakhapatnam" },
  "Ludhiana": { hi: "लुधियाना", te: "లూధియానా", mr: "लुधियाना", ta: "லூதியானா", pa: "ਲੁਧਿਆਣਾ", bn: "লুধিয়ানা", en: "Ludhiana" },
  "Amritsar": { hi: "अमृतसर", te: "అమృతసర్", mr: "अमृतसर", ta: "அமிர்தசரஸ்", pa: "ਅੰਮ੍ਰਿਤਸਰ", bn: "অমৃতসর", en: "Amritsar" },
  "Jalandhar": { hi: "जालंधर", te: "జలంధర్", mr: "जालंधर", ta: "ஜலந்தர்", pa: "ਜਲੰਧਰ", bn: "জলন্ধর", en: "Jalandhar" },
  "Patiala": { hi: "पटियाला", te: "పాటియాలా", mr: "पटियाला", ta: "பாட்டியாலா", pa: "ਪਟਿਆਲਾ", bn: "পাটিয়ালা", en: "Patiala" },
  "Bathinda": { hi: "बठिंडा", te: "బటిండా", mr: "बठिंडा", ta: "பட்டிண்டா", pa: "ਬਠਿੰਡਾ", bn: "ভাটিণ্ডা", en: "Bathinda" },
  "Jaipur": { hi: "जयपुर", te: "జైపూర్", mr: "जयपूर", ta: "ஜெய்ப்பூர்", pa: "ਜੈਪੁਰ", bn: "জয়পুর", en: "Jaipur" },
  "Jodhpur": { hi: "जोधपुर", te: "జోధ్‌పూర్", mr: "जोधपूर", ta: "ஜோத்பூர்", pa: "ਜੋਧਪੁਰ", bn: "যোধপুর", en: "Jodhpur" },
  "Kota": { hi: "कोटा", te: "కోటా", mr: "कोटा", ta: "கோட்டா", pa: "ਕੋਟਾ", bn: "কোটা", en: "Kota" },
  "Bikaner": { hi: "बीकानेर", te: "బికనీర్", mr: "बिकानेर", ta: "பிகானேர்", pa: "ਬੀਕਾਨੇਰ", bn: "বিকানের", en: "Bikaner" },
  "Varanasi": { hi: "वाराणसी", te: "వారణాసి", mr: "वाराणसी", ta: "வாரணாசி", pa: "ਵਾਰਾਣਸੀ", bn: "বারাণসী", en: "Varanasi" },
  "Lucknow": { hi: "लखनऊ", te: "లక్నో", mr: "लखनौ", ta: "லக்னோ", pa: "ਲਖਨਊ", bn: "লখনউ", en: "Lucknow" },
  "Coimbatore": { hi: "कोयंबटूर", te: "కోయంబత్తూరు", mr: "कोईम्बतूर", ta: "கோயம்புத்தூர்", pa: "ਕੋਇੰਬਟੂਰ", bn: "কোয়েম্বাটুর", en: "Coimbatore" },
  "Madurai": { hi: "मदुरै", te: "మదురై", mr: "मदुराई", ta: "மதுரை", pa: "ਮਦੁਰਾਈ", bn: "মাদুরাই", en: "Madurai" },
  "Thanjavur": { hi: "तंजावुर", te: "తంజావూరు", mr: "तंजावर", ta: "தஞ்சாவூர்", pa: "ਤੰਜਾਵੁਰ", bn: "তাঞ্জাভুর", en: "Thanjavur" }
}

export const AGRI_CROPS = {
  "Wheat": { hi: "गेहूं", te: "గోధుమ", mr: "गहू", ta: "கோதுமை", pa: "ਕਣਕ", bn: "গম", en: "Wheat" },
  "Mustard": { hi: "सरसों", te: "ఆవాలు", mr: "मोहरी", ta: "கடுகு", pa: "ਸਰ੍ਹੋਂ", bn: "সরিষা", en: "Mustard" },
  "Rice": { hi: "चावल / धान", te: "వరి / బియ్యం", mr: "भात", ta: "நெல்", pa: "ਝੋਨਾ", bn: "ধান", en: "Rice" },
  "Paddy": { hi: "धान", te: "వరి", mr: "भात", ta: "நெல்", pa: "ਝੋਨਾ", bn: "ধান", en: "Paddy" },
  "Cotton": { hi: "कपास", te: "పత్తి", mr: "कापूस", ta: "பருத்தி", pa: "ਨਰਮਾ / ਕਪਾਹ", bn: "তুলা", en: "Cotton" },
  "Sugarcane": { hi: "गन्ना", te: "చెరకు", mr: "ऊस", ta: "கரும்பு", pa: "ਗੰਨਾ", bn: "আখ", en: "Sugarcane" },
  "Maize": { hi: "मक्का", te: "మొక్కజొన్న", mr: "मका", ta: "மக்காச்சோளம்", pa: "ਮੱਕੀ", bn: "ভুট্টা", en: "Maize" },
  "Chickpea": { hi: "चना", te: "శనగలు", mr: "हरभरा", ta: "கொண்டைக்கடலை", pa: "ਛੋਲੇ", bn: "ছোলা", en: "Chickpea" },
  "Gram": { hi: "चना", te: "శనగలు", mr: "हरभरा", ta: "கொண்டைக்கடலை", pa: "ਛੋਲੇ", bn: "ছোলা", en: "Gram" },
  "Soybean": { hi: "सोयाबीन", te: "సోయాబీన్", mr: "सोयाबीन", ta: "சோயாபீன்", pa: "ਸੋਇਆਬੀਨ", bn: "সয়াবিন", en: "Soybean" },
  "Bajra": { hi: "बाजरा", te: "సజ్జలు", mr: "बाजरी", ta: "கம்பு", pa: "ਬਾਜਰਾ", bn: "বাজরা", en: "Bajra" },
  "Pearl Millet": { hi: "बाजरा", te: "సజ్జలు", mr: "बाजरी", ta: "கம்பு", pa: "ਬਾਜਰਾ", bn: "বাজরা", en: "Pearl Millet" },
  "Potato": { hi: "आलू", te: "బంగాళాదుంప", mr: "बटाटा", ta: "உருளைக்கிழங்கு", pa: "ਆਲੂ", bn: "আলু", en: "Potato" },
  "Tomato": { hi: "टमाटर", te: "టమోటా", mr: "टोमॅटो", ta: "தக்காளி", pa: "ਟਮਾਟਰ", bn: "টমেটো", en: "Tomato" },
  "Onion": { hi: "प्याज", te: "ఉల్లిపాయ", mr: "कांदा", ta: "வெங்காயம்", pa: "ਪਿਆਜ਼", bn: "পেঁয়াজ", en: "Onion" },
  "Garlic": { hi: "लहसुन", te: "వెల్లుల్లి", mr: "लसूण", ta: "பூண்டு", pa: "ਲਸਣ", bn: "রসুন", en: "Garlic" }
}

export const SOIL_TYPES = {
  "Black cotton soil": { hi: "काली कपास मिट्टी", te: "నల్లరేగడి నేల", mr: "काळी कसदार माती", ta: "கரிசல் மண்", pa: "ਕਾਲੀ ਮਿੱਟੀ", bn: "কালো মাটি", en: "Black cotton soil" },
  "Black soil": { hi: "काली मिट्टी", te: "నల్లరేగడి నేల", mr: "काळी माती", ta: "கரிசல் மண்", pa: "ਕਾਲੀ ਮਿੱਟੀ", bn: "কালো মাটি", en: "Black soil" },
  "Alluvial soil": { hi: "जलोढ़ मिट्टी", te: "ఒండ్రు నేల", mr: "गाळाची माती", ta: "வண்டல் மண்", pa: "ਜਲੋਢ ਮਿੱਟੀ", bn: "পলি মাটি", en: "Alluvial soil" },
  "Red soil": { hi: "लाल मिट्टी", te: "ఎర్ర నేల", mr: "तांबडी माती", ta: "செம்மண்", pa: "ਲਾਲ ਮਿੱਟੀ", bn: "লাল মাটি", en: "Red soil" },
  "Sandy loam": { hi: "बलुई दोमट मिट्टी", te: "ఇసుక నేల", mr: "वालुकामय माती", ta: "மணல் மண்", pa: "ਰੇਤਲੀ ਦੋਮਟ", bn: "বেলে দোআঁশ", en: "Sandy loam" },
  "Loamy": { hi: "दोमट मिट्टी", te: "ఒండ్రు నేల", mr: "पोयटा माती", ta: "வண்டல் மண்", pa: "ਦੋਮਟ ਮਿੱਟੀ", bn: "দোআঁশ মাটি", en: "Loamy soil" },
  "Clayey": { hi: "चिकनी मिट्टी", te: "బంకమట్టి", mr: "चिकणमाती", ta: "களிமண்", pa: "ਚੀਕਣੀ ਮਿੱਟੀ", bn: "এঁটেল মাটি", en: "Clay soil" }
}

/** Localize place string like 'Kurukshetra' or 'Kurukshetra, Haryana' or 'Karnal, Haryana' */
export function localizePlaceName(placeStr, langCode = 'hi') {
  if (!placeStr || langCode === 'en') return placeStr || ''
  const trimmed = placeStr.trim()

  // Exact city match
  if (INDIAN_CITIES[trimmed]?.[langCode]) {
    return INDIAN_CITIES[trimmed][langCode]
  }

  // Exact state match
  if (INDIAN_STATES[trimmed]?.[langCode]) {
    return INDIAN_STATES[trimmed][langCode]
  }

  // Check 'City, State' format (e.g. 'Kurukshetra, Haryana')
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map((p) => p.trim())
    const city = parts[0]
    const state = parts.slice(1).join(', ')

    const locCity = INDIAN_CITIES[city]?.[langCode] || city
    const locState = INDIAN_STATES[state]?.[langCode] || state

    if (locCity !== city || locState !== state) {
      return `${locCity}, ${locState}`
    }
  }

  // Case-insensitive lookup
  for (const [key, map] of Object.entries(INDIAN_CITIES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return map[langCode] || trimmed
    }
  }
  for (const [key, map] of Object.entries(INDIAN_STATES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return map[langCode] || trimmed
    }
  }

  return trimmed
}

/** Localize state string like 'Haryana' or 'Punjab' */
export function localizeState(stateStr, langCode = 'hi') {
  if (!stateStr || langCode === 'en') return stateStr || ''
  const trimmed = stateStr.trim()
  if (INDIAN_STATES[trimmed]?.[langCode]) {
    return INDIAN_STATES[trimmed][langCode]
  }
  for (const [key, map] of Object.entries(INDIAN_STATES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return map[langCode] || trimmed
    }
  }
  return trimmed
}

/** Localize crop string like 'Wheat and Mustard' */
export function localizeCropName(cropStr, langCode = 'hi') {
  if (!cropStr || langCode === 'en') return cropStr || ''
  let result = cropStr
  for (const [eng, map] of Object.entries(AGRI_CROPS)) {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi')
    if (regex.test(result)) {
      result = result.replace(regex, map[langCode] || eng)
    }
  }
  return result
}

/** Localize soil string like 'Black cotton soil' */
export function localizeSoilType(soilStr, langCode = 'hi') {
  if (!soilStr || langCode === 'en') return soilStr || ''
  for (const [eng, map] of Object.entries(SOIL_TYPES)) {
    if (soilStr.toLowerCase().includes(eng.toLowerCase())) {
      return map[langCode] || soilStr
    }
  }
  return soilStr
}

