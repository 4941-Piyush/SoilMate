// Comprehensive Localization for Indian Geography, States, Crops & Soils
// Ensures that on-screen entities (farm location, state, crop, soil) strictly match
// the selected UI language across Hindi, Telugu, Marathi, Tamil, Punjabi, Bengali,
// Gujarati, Kannada, Malayalam, Odia & English.

export const INDIAN_STATES = {
  "Haryana": { hi: "हरियाणा", te: "హర్యానా", mr: "हरियाणा", ta: "ஹரியானா", pa: "ਹਰਿਆਣਾ", bn: "হরিয়ানা", gu: "હરિયાણા", kn: "ಹರಿಯಾಣ", ml: "ഹരിയാന", od: "ହରିୟାଣା", en: "Haryana" },
  "Punjab": { hi: "पंजाब", te: "పంజాబ్", mr: "पंजाब", ta: "பஞ்சாப்", pa: "ਪੰਜਾਬ", bn: "পাঞ্জাব", gu: "પંજાબ", kn: "ಪಂಜಾಬ್", ml: "പഞ്ചാബ്", od: "ପଞ୍ଜାବ", en: "Punjab" },
  "Maharashtra": { hi: "महाराष्ट्र", te: "మహారాష్ట్ర", mr: "महाराष्ट्र", ta: "மகாராஷ்டிரா", pa: "ਮਹਾਰਾਸ਼ਟਰ", bn: "মহারাষ্ট্র", gu: "મહારાષ્ટ્ર", kn: "ಮಹಾರಾಷ್ಟ್ರ", ml: "മഹാരാഷ്ട്ര", od: "ମହାରାଷ୍ଟ୍ର", en: "Maharashtra" },
  "Madhya Pradesh": { hi: "मध्य प्रदेश", te: "మధ్యప్రదేశ్", mr: "मध्य प्रदेश", ta: "மத்தியப் பிரதேசம்", pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼", bn: "মধ্যপ্রদেশ", gu: "મધ્યપ્રદેશ", kn: "ಮಧ್ಯಪ್ರದೇಶ", ml: "മധ്യപ്രദേശ്", od: "ମଧ୍ୟପ୍ରଦେଶ", en: "Madhya Pradesh" },
  "MP": { hi: "मध्य प्रदेश", te: "మధ్యప్రదేశ్", mr: "मध्य प्रदेश", ta: "மத்தியப் பிரதேசம்", pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼", bn: "মধ্যপ্রদেশ", gu: "મધ્યપ્રદેશ", kn: "ಮಧ್ಯಪ್ರದೇಶ", ml: "മധ്യപ്രദേശ്", od: "ମଧ୍ୟପ୍ରଦେଶ", en: "Madhya Pradesh" },
  "Rajasthan": { hi: "राजस्थान", te: "రాజస్థాన్", mr: "राजस्थान", ta: "ராஜஸ்தான்", pa: "ਰਾਜਸਥਾਨ", bn: "রাজস্থান", gu: "રાજસ્થાન", kn: "ರಾಜಸ್ಥಾನ", ml: "രാജസ്ഥാൻ", od: "ରାଜସ୍ଥାନ", en: "Rajasthan" },
  "Andhra Pradesh": { hi: "आंध्र प्रदेश", te: "ఆంధ్రప్రదేశ్", mr: "आंध्र प्रदेश", ta: "ஆந்திரப் பிரதேசம்", pa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼", bn: "অন্ধ্রপ্রদেশ", gu: "આંધ્રપ્રદેશ", kn: "ಆಂಧ್ರಪ್ರದೇಶ", ml: "ആന്ധ്രാപ്രദേശ്", od: "ଆନ୍ଧ୍ରପ୍ରଦେଶ", en: "Andhra Pradesh" },
  "AP": { hi: "आंध्र प्रदेश", te: "ఆంధ్రప్రదేశ్", mr: "आंध्र प्रदेश", ta: "ஆந்திரப் பிரதேசம்", pa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼", bn: "অন্ধ্রপ্রদেশ", gu: "આંધ્રપ્રદેશ", kn: "ಆಂಧ್ರಪ್ರದೇಶ", ml: "ആന്ധ്രാപ്രദേശ്", od: "ଆନ୍ଧ୍ରପ୍ରଦେଶ", en: "Andhra Pradesh" },
  "Uttar Pradesh": { hi: "उत्तर प्रदेश", te: "ఉత్తరప్రదేశ్", mr: "उत्तर प्रदेश", ta: "உத்தரப் பிரதேசம்", pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼", bn: "উত্তরপ্রদেশ", gu: "ઉત્તર પ્રદેશ", kn: "ಉತ್ತರ ಪ್ರದೇಶ", ml: "ഉത്തർപ്രദേശ്", od: "ଉତ୍ତର ପ୍ରଦେଶ", en: "Uttar Pradesh" },
  "UP": { hi: "उत्तर प्रदेश", te: "ఉత్తరప్రదేశ్", mr: "उत्तर प्रदेश", ta: "உத்தரப் பிரதேசம்", pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼", bn: "উত্তরপ্রদেশ", gu: "ઉત્તર પ્રદેશ", kn: "ಉತ್ತರ ಪ್ರದೇಶ", ml: "ഉത്തർപ്രദേശ്", od: "ଉତ୍ତର ପ୍ରଦେଶ", en: "Uttar Pradesh" },
  "Gujarat": { hi: "गुजरात", te: "గుజరాత్", mr: "गुजरात", ta: "குஜராத்", pa: "ਗੁਜਰਾਤ", bn: "গুজরাট", gu: "ગુજરાત", kn: "ಗುಜರಾತ್", ml: "ഗുജറാത്ത്", od: "ଗୁଜରାଟ", en: "Gujarat" },
  "Karnataka": { hi: "कर्नाटक", te: "కర్ణాటక", mr: "कर्नाटक", ta: "ಕರ್ನಾಟಕಾ", pa: "ਕਰਨਾਟਕ", bn: "কর্ণাটক", gu: "કર્ણાટક", kn: "ಕರ್ನಾಟಕ", ml: "കർണാടക", od: "କର୍ଣ୍ଣାଟକ", en: "Karnataka" },
  "Tamil Nadu": { hi: "तमिलनाडु", te: "తమిళనాడు", mr: "तमिळनाडू", ta: "தமிழ்நாடு", pa: "ਤਾਮਿਲਨਾਡੂ", bn: "তামিলনাড়ু", gu: "તમિલનાડુ", kn: "ತಮಿಳುನಾಡು", ml: "തമിഴ്നാട്", od: "ତାମିଲନାଡୁ", en: "Tamil Nadu" },
  "Telangana": { hi: "तेलंगाना", te: "తెలంగాణ", mr: "तेलंगणा", ta: "தெலங்கானா", pa: "ਤੇਲੰਗਾਨਾ", bn: "তেলেঙ্গানা", gu: "તેલંગાણા", kn: "ತೆಲಂಗಾಣ", ml: "തെലങ്കാന", od: "ତେଲେଙ୍ଗାନା", en: "Telangana" },
  "West Bengal": { hi: "पश्चिम बंगाल", te: "పశ్చిమ బెంగాల్", mr: "पश्चिम बंगाल", ta: "மேற்கு வங்காளம்", pa: "ਪੱਛਮੀ ਬੰਗਾਲ", bn: "পশ্চিমবঙ্গ", gu: "પશ્ચિમ બંગાળ", kn: "ಪಶ್ಚಿಮ ಬಂಗಾಳ", ml: "പശ്ചിമ ബംഗാൾ", od: "ପଶ୍ଚିମ ବଙ୍ଗ", en: "West Bengal" },
  "Bihar": { hi: "बिहार", te: "బీహార్", mr: "बिहार", ta: "பீகார்", pa: "ਬਿਹਾਰ", bn: "বিহার", gu: "બિહાર", kn: "ಬಿಹಾರ", ml: "ബിഹാർ", od: "ବିହାର", en: "Bihar" },
  "Odisha": { hi: "ओडिशा", te: "ఒడిశా", mr: "ओडिशा", ta: "ஒடிசா", pa: "ਓਡੀਸ਼ା", bn: "ওড়িশା", gu: "ઓડિશા", kn: "ಒಡಿಶಾ", ml: "ഒഡീഷ", od: "ଓଡ଼ିଶା", en: "Odisha" },
  "Kerala": { hi: "केरल", te: "కేరళ", mr: "केरळ", ta: "கேரளா", pa: "ਕੇਰਲ", bn: "কেরালা", gu: "કેરળ", kn: "ಕೇರಳ", ml: "കേരളം", od: "କେରଳ", en: "Kerala" },
  "Assam": { hi: "असम", te: "అస్సాం", mr: "आसाम", ta: "அசாம்", pa: "ਅਸਾਮ", bn: "আসাম", gu: "આસામ", kn: "ಅಸ್ಸಾಂ", ml: "അസം", od: "ଆସାମ", en: "Assam" },
  "Himachal Pradesh": { hi: "हिमाचल प्रदेश", te: "హిమాచల్ ప్రదేశ్", mr: "हिमाचल प्रदेश", ta: "இமாச்சலப் பிரதேசம்", pa: "ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼", bn: "হিমাচল প্রদেশ", gu: "હિમાચલ પ્રદેશ", kn: "ಹಿಮಾಚಲ ಪ್ರದೇಶ", ml: "ഹിമാചൽ പ്രദേശ്", od: "ହିମାଚଳ ପ୍ରଦେଶ", en: "Himachal Pradesh" },
  "Uttarakhand": { hi: "उत्तराखंड", te: "ఉత్తరాఖండ్", mr: "उत्तराखंड", ta: "உத்தராகண்ட்", pa: "ਉੱਤਰਾਖੰਡ", bn: "উত্তরাখণ্ড", gu: "ઉત્તરાખંડ", kn: "ಉತ್ತರಾಖಂಡ", ml: "ഉത്തരാഖണ്ഡ്", od: "ଉତ୍ତରାଖଣ୍ଡ", en: "Uttarakhand" },
  "Chhattisgarh": { hi: "छत्तीसगढ़", te: "ఛత్తీస్‌ଗఢ్", mr: "छत्तीसगड", ta: "சத்தீஸ்கர்", pa: "ਛੱਤੀਸਗੜ੍ਹ", bn: "ছত্তিশগড়", gu: "છત્તીસગઢ", kn: "ಛತ್ತೀಸ್‌ಗಢ", ml: "ഛത്തീസ്ഗഡ്", od: "ଛତିଶଗଡ଼", en: "Chhattisgarh" },
  "Jharkhand": { hi: "झारखंड", te: "జార్ఖండ్", mr: "झारखंड", ta: "ஜார்க்கண்ட்", pa: "ਝਾਰਖੰਡ", bn: "ঝাড়খণ্ড", gu: "ઝારખંડ", kn: "ಜಾರ್ಖಂಡ್", ml: "ജാർഖണ്ഡ്", od: "ଝାଡ଼ଖଣ୍ଡ", en: "Jharkhand" },
  "Delhi": { hi: "दिल्ली", te: "ఢిల్లీ", mr: "दिल्ली", ta: "டெல்லி", pa: "ਦਿੱਲੀ", bn: "দিল্লি", gu: "દિલ્હી", kn: "ದೆಹಲಿ", ml: "ഡൽഹി", od: "ଦିଲ୍ଲୀ", en: "Delhi" }
}

export const INDIAN_CITIES = {
  "Kurukshetra": { hi: "कुरुक्षेत्र", te: "కురుక్షేత్రం", mr: "कुरुक्षेत्र", ta: "குருக்ஷேத்திரம்", pa: "ਕੁਰੂਕਸ਼ੇਤਰ", bn: "কुरुক্ষেত্র", gu: "કુરુક્ષેત્ર", kn: "ಕುರುಕ್ಷೇತ್ರ", ml: "കുരുക്ഷേത്ര", od: "କୁରୁକ୍ଷେତ୍ର", en: "Kurukshetra" },
  "Karnal": { hi: "करनाल", te: "కర్నాల్", mr: "करनाल", ta: "கர்னால்", pa: "ਕਰਨਾਲ", bn: "কার্নাল", gu: "કરનાલ", kn: "ಕರ್ನಾಲ್", ml: "കർണാൽ", od: "କର୍ଣ୍ଣାଲ", en: "Karnal" },
  "Ambala": { hi: "अंबाला", te: "అంబాలా", mr: "अंबाला", ta: "அம்பாலா", pa: "ਅੰਬਾਲਾ", bn: "আম্বালা", gu: "અંબાલા", kn: "ಅಂಬಾಲಾ", ml: "അംബാല", od: "ଅମ୍ବାଲା", en: "Ambala" },
  "Panipat": { hi: "पानीपत", te: "పానిపట్", mr: "पानीपत", ta: "பானிபட்", pa: "ਪਾਨੀਪਤ", bn: "পানিপথ", gu: "પાણીપત", kn: "ಪಾಣಿಪತ್", ml: "പാനിപ്പത്ത്", od: "ପାନିପତ", en: "Panipat" },
  "Sonipat": { hi: "सोनीपत", te: "సోనిపట్", mr: "सोनीपत", ta: "சோனிபட்", pa: "ਸੋਨੀਪਤ", bn: "সোনিপত", gu: "સોનીપત", kn: "ಸೋನಿಪತ್", ml: "സോനിപ്പത്ത്", od: "ସୋନିପତ", en: "Sonipat" },
  "Rohtak": { hi: "रोहतक", te: "రోహ్‌తక్", mr: "रोहतक", ta: "ரோஹ்தக்", pa: "ਰੋਹਤਕ", bn: "রোহতক", gu: "રોહતક", kn: "ರೋಹ್ಟಕ್", ml: "റോഹ്തക്", od: "ରୋହତକ", en: "Rohtak" },
  "Hisar": { hi: "हिसार", te: "హిసార్", mr: "हिसार", ta: "ஹிசார்", pa: "ਹਿਸਾਰ", bn: "হিসার", gu: "હિસાર", kn: "ಹಿಸಾರ್", ml: "ഹിസാർ", od: "ହିସାର", en: "Hisar" },
  "Sirsa": { hi: "सिरसा", te: "సిర్సా", mr: "सिरसा", ta: "சிர்சா", pa: "ਸਿਰਸਾ", bn: "সিরসা", gu: "સિરસા", kn: "ಸಿರ್ಸಾ", ml: "സിർസ", od: "ସିରସା", en: "Sirsa" },
  "Nashik": { hi: "नासिक", te: "నాసిక్", mr: "नाशिक", ta: "நாசிக்", pa: "ਨਾਸਿਕ", bn: "নাসিক", gu: "નાસિક", kn: "ನಾಸಿಕ್", ml: "നാസിക്", od: "ନାସିକ", en: "Nashik" },
  "Pune": { hi: "पुणे", te: "పుణె", mr: "पुणे", ta: "புனே", pa: "ਪੁਣੇ", bn: "পুনে", gu: "પુણે", kn: "ಪುಣೆ", ml: "പുണെ", od: "ପୁଣେ", en: "Pune" },
  "Nagpur": { hi: "नागपुर", te: "నాగ్‌పూర్", mr: "नागपूर", ta: "நாக்பூர்", pa: "ਨਾਗਪੁਰ", bn: "নাগপুর", gu: "નાગપુર", kn: "ನಾಗಪುರ", ml: "നാഗ്പൂർ", od: "ନାଗପୁର", en: "Nagpur" },
  "Solapur": { hi: "सोलापुर", te: "సోలాపూర్", mr: "सोलापूर", ta: "சோலாப்பூர்", pa: "ਸੋਲਾਪੁਰ", bn: "সোলাপুর", gu: "સોલાપુર", kn: "ಸೋಲಾಪುರ", ml: "സോലാപൂർ", od: "ସୋଲାପୁର", en: "Solapur" },
  "Indore": { hi: "इंदौर", te: "ఇందోర్", mr: "इंदूर", ta: "இந்தோர்", pa: "ਇੰਦੌਰ", bn: "ইন্দোর", gu: "ઇન્દોર", kn: "ಇಂದೋರ್", ml: "ഇൻഡോർ", od: "ଇନ୍ଦୋର", en: "Indore" },
  "Bhopal": { hi: "भोपाल", te: "భోపాల్", mr: "भोपाळ", ta: "போபால்", pa: "ਭੋਪਾਲ", bn: "ভোপাল", gu: "ભોપાલ", kn: "ಭೋಪಾಲ್", ml: "ഭോപ്പാൽ", od: "ଭୋପାଳ", en: "Bhopal" },
  "Ujjain": { hi: "उज्जैन", te: "ఉజ్జయిని", mr: "उज्जैन", ta: "உஜ்ஜைன்", pa: "ਉਜੈਨ", bn: "উজ্জয়িনী", gu: "ઉજ્જૈન", kn: "ಉಜ್ಜಯಿನಿ", ml: "ഉജ്ജയിൻ", od: "ଉଜ୍ଜୟିନୀ", en: "Ujjain" },
  "Jabalpur": { hi: "जबलपुर", te: "జబల్‌పూర్", mr: "जबलपूर", ta: "ஜபல்பூர்", pa: "ਜਬਲਪੁਰ", bn: "জবলপুর", gu: "જબલપુર", kn: "ಜಬಲ್ಪುರ", ml: "ജബൽപൂർ", od: "ଜବଲପୁର", en: "Jabalpur" },
  "Guntur": { hi: "गुंटूर", te: "గుంటూరు", mr: "గుంటూరు", ta: "குண்டூர்", pa: "ਗੁੰਟੂਰ", bn: "গুন্টুর", gu: "ગુંટૂર", kn: "ಗುಂಟೂರು", ml: "ഗുണ്ടൂർ", od: "ଗୁଣ୍ଟୁର", en: "Guntur" },
  "Vijayawada": { hi: "विजयवाड़ा", te: "విజయవాడ", mr: "विजयवाडा", ta: "விஜயவாடா", pa: "ਵਿਜੇਵਾੜਾ", bn: "বিজয়ওয়াড়া", gu: "વિજયવાડા", kn: "ವಿಜಯವಾಡ", ml: "വിജയവാഡ", od: "ବିଜୟୱାଡ଼ା", en: "Vijayawada" },
  "Visakhapatnam": { hi: "विशाखापट्टनम", te: "విశాఖపట్నం", mr: "विशाखापट्टणम", ta: "விசாகப்பட்டினம்", pa: "ਵਿਸ਼ਾਖਾਪਟਨਮ", bn: "বিশাখাপত্তনম", gu: "વિશાખાપટ્ટનમ", kn: "ವಿಶಾಖಪಟ್ಟಣ", ml: "വിശാഖപട്ടണം", od: "ବିଶାଖାପାଟଣା", en: "Visakhapatnam" },
  "Ludhiana": { hi: "लुधियाना", te: "లూధియానా", mr: "लुधियाना", ta: "லூதியானா", pa: "ਲੁਧਿਆਣਾ", bn: "লুধিয়ানা", gu: "લુધિયાણા", kn: "ಲುಧಿಯಾನ", ml: "ലുധിയാന", od: "ଲୁଧିଆନା", en: "Ludhiana" },
  "Amritsar": { hi: "अमृतसर", te: "అమృతసర్", mr: "अमृतसर", ta: "அமிர்தசரஸ்", pa: "ਅੰਮ੍ਰਿਤਸਰ", bn: "অমৃতসর", gu: "અમૃતસર", kn: "ಅಮೃತಸರ", ml: "അമൃത്സർ", od: "ଅମୃତସର", en: "Amritsar" },
  "Jalandhar": { hi: "जालंधर", te: "జలంధర్", mr: "जालंधर", ta: "ஜலந்தர்", pa: "ਜਲੰਧਰ", bn: "জলন্ধর", gu: "જલંધર", kn: "ಜಲಂಧರ್", ml: "ജലന്ധർ", od: "ଜଳନ୍ଧର", en: "Jalandhar" },
  "Patiala": { hi: "पटियाला", te: "పాటియాలా", mr: "पटियाला", ta: "பாட்டியாலா", pa: "ਪਟਿਆਲਾ", bn: "পাটিয়ালা", gu: "પટિયાલા", kn: "ಪಟಿಯಾಲ", ml: "പട്യാല", od: "ପଟିଆଲା", en: "Patiala" },
  "Bathinda": { hi: "बठिंडा", te: "బటిండా", mr: "बठिंडा", ta: "பட்டிண்டா", pa: "ਬਠਿੰਡਾ", bn: "ভাটিণ্ডਾ", gu: "ભટિંડા", kn: "ಬಥಿಂಡಾ", ml: "ഭട്ടിൻഡ", od: "ବଠିଣ୍ଡା", en: "Bathinda" },
  "Jaipur": { hi: "जयपुर", te: "జైపూర్", mr: "जयपूर", ta: "ஜெய்ப்பூர்", pa: "ਜੈਪੁਰ", bn: "জয়পুর", gu: "જયપુર", kn: "ಜೈಪುರ", ml: "ജയ്പൂർ", od: "ଜୟପୁର", en: "Jaipur" },
  "Jodhpur": { hi: "जोधपुर", te: "జోధ్‌పూర్", mr: "जोधपूर", ta: "ஜோத்பூர்", pa: "ਜੋਧਪੁਰ", bn: "যোধপুর", gu: "જોધપુર", kn: "ಜೋಧಪುರ", ml: "ജോധ്പൂർ", od: "ଯୋଧପୁର", en: "Jodhpur" },
  "Kota": { hi: "कोटा", te: "కోటా", mr: "કોટા", ta: "கோட்டா", pa: "ਕੋਟਾ", bn: "কোটা", gu: "કોટા", kn: "ಕೋಟಾ", ml: "കോട്ട", od: "କୋଟା", en: "Kota" },
  "Bikaner": { hi: "बीकानेर", te: "బికనీర్", mr: "बिकानेर", ta: "பிகானேர்", pa: "ਬੀਕਾਨੇਰ", bn: "বিকানের", gu: "બિકાનેર", kn: "ಬಿಕಾನೇರ್", ml: "ബിക്കാനീർ", od: "ବିକାନେର", en: "Bikaner" },
  "Varanasi": { hi: "वाराणसी", te: "వారణాసి", mr: "वाराणसी", ta: "வாரணாசி", pa: "ਵਾਰਾਣਸੀ", bn: "বারাণসী", gu: "વારાણસી", kn: "ವಾರಣಾಸಿ", ml: "വാരണാസി", od: "ବାରାଣସୀ", en: "Varanasi" },
  "Lucknow": { hi: "लखनऊ", te: "లక్నో", mr: "लखनौ", ta: "லக்னோ", pa: "ਲਖਨਊ", bn: "লখনউ", gu: "લખનૌ", kn: "ಲಕ್ನೋ", ml: "ലഖ്‌നൗ", od: "ଲକ୍ଷ୍ନୌ", en: "Lucknow" },
  "Coimbatore": { hi: "कोयंबटूर", te: "కోయంబత్తూరు", mr: "कोईम्बतूर", ta: "கோயம்புத்தூர்", pa: "ਕੋਇੰਬਟੂਰ", bn: "কোয়েম্বাটুর", gu: "કોયમ્બતૂર", kn: "ಕೊಯಮತ್ತೂರು", ml: "കോയമ്പത്തൂർ", od: "କୋଏମ୍ବାଟୁର", en: "Coimbatore" },
  "Madurai": { hi: "मदुरै", te: "మదురై", mr: "मदुराई", ta: "மதுரை", pa: "ਮਦੁਰਾਈ", bn: "মাদুরাই", gu: "મદુરાઈ", kn: "ಮಧುರೆ", ml: "മധുര", od: "ମଦୁରାଇ", en: "Madurai" },
  "Thanjavur": { hi: "तंजावुर", te: "తంజావూరు", mr: "तंजावर", ta: "தஞ்சாவூர்", pa: "ਤੰਜਾਵੁਰ", bn: "তাঞ্জাভুর", gu: "તંજાવુર", kn: "ತಂಜಾವೂರು", ml: "തഞ്ചാവൂർ", od: "ତାଞ୍ଜାଭୁର", en: "Thanjavur" },
  "Bengaluru": { hi: "बेंगलुरु", te: "బెంగళూరు", mr: "बंगळूर", ta: "பெங்களூரு", pa: "ਬੈਂਗਲੁਰੂ", bn: "বেঙ্গালুরু", gu: "બેંગલુરુ", kn: "ಬೆಂಗಳೂರು", ml: "ബംഗളൂരു", od: "ବେଙ୍ଗାଲୁରୁ", en: "Bengaluru" },
  "Bangalore": { hi: "बेंगलुरु", te: "బెంగళూరు", mr: "बंगळूर", ta: "பெங்களூரு", pa: "ਬੈਂਗਲੁਰੂ", bn: "বেঙ্গালুরু", gu: "બેંગલુરુ", kn: "ಬೆಂಗಳೂರು", ml: "ബംഗളൂരു", od: "ବେଙ୍ଗାଲୁରୁ", en: "Bangalore" },
  "Bhubaneswar": { hi: "भुवनेश्वर", te: "భువనేశ్వర్", mr: "भुवनेश्वर", ta: "புவனேஸ்வர்", pa: "ਭੁਵਨੇਸ਼ਵਰ", bn: "ভুবনেশ্বর", gu: "ભુવનેશ્વર", kn: "ಭುವನೇಶ್ವರ", ml: "ഭുവനേശ്വർ", od: "ଭୁବନେଶ୍ୱର", en: "Bhubaneswar" },
  "Cuttack": { hi: "कटक", te: "కటక్", mr: "कटक", ta: "கட்டாக்", pa: "ਕਟਕ", bn: "কটক", gu: "કટક", kn: "ಕಟಕ್", ml: "കട്ടക്ക്", od: "କଟକ", en: "Cuttack" },
  "Mysuru": { hi: "मैसूर", te: "మైసూర్", mr: "म्हैसूर", ta: "மைசூர்", pa: "ਮੈਸੂਰ", bn: "মহীশূর", gu: "મૈસૂર", kn: "ಮೈಸೂರು", ml: "മൈസൂർ", od: "ମହୀଶୂର", en: "Mysuru" },
  "Mysore": { hi: "मैसूर", te: "మైసూర్", mr: "म्हैसूर", ta: "மைசூர்", pa: "ਮੈਸੂਰ", bn: "মহীশূর", gu: "મૈસૂર", kn: "ಮೈಸೂರು", ml: "മൈസൂർ", od: "ମହୀଶୂର", en: "Mysore" }
}

export const AGRI_CROPS = {
  "Wheat": { hi: "गेहूं", te: "గోధుమ", mr: "गहू", ta: "கோதுமை", pa: "ਕਣਕ", bn: "গম", gu: "ઘઉં", kn: "ಗೋಧಿ", ml: "ഗോതമ്പ്", od: "ଗହମ", en: "Wheat" },
  "Mustard": { hi: "सरसों", te: "ఆవాలు", mr: "मोहरी", ta: "கடுகு", pa: "ਸਰ੍ਹੋਂ", bn: "সরিষা", gu: "રાયડો / સરસવ", kn: "ಸಾಸಿವೆ", ml: "കടുക്", od: "ସୋରିଷ", en: "Mustard" },
  "Rice": { hi: "चावल / धान", te: "వరి / బియ్యం", mr: "भात", ta: "நெல்", pa: "ਝੋਨਾ", bn: "ধান", gu: "ડાંગર / ચોખા", kn: "ಭತ್ತ / ಅಕ್ಕಿ", ml: "നെല്ല് / അരി", od: "ଧାନ / ଚାଉଳ", en: "Rice" },
  "Paddy": { hi: "धान", te: "వరి", mr: "भात", ta: "நெல்", pa: "ਝੋਨਾ", bn: "ধান", gu: "ડાંગર", kn: "ಭತ್ತ", ml: "നെല്ല്", od: "ଧାନ", en: "Paddy" },
  "Cotton": { hi: "कपास", te: "పత్తి", mr: "कापूस", ta: "பருத்தி", pa: "ਨਰਮਾ / ਕਪਾਹ", bn: "তুলা", gu: "કપાસ", kn: "ಹತ್ತಿ", ml: "പരുത്തി", od: "କପା", en: "Cotton" },
  "Sugarcane": { hi: "गन्ना", te: "చెరకు", mr: "ऊस", ta: "கரும்பு", pa: "ਗੰਨਾ", bn: "আখ", gu: "શેરડી", kn: "ಕಬ್ಬು", ml: "കരിമ്പ്", od: "ଆଖୁ", en: "Sugarcane" },
  "Maize": { hi: "मक्का", te: "మొక్కజొన్న", mr: "मका", ta: "மக்காச்சோளம்", pa: "ਮੱਕੀ", bn: "ভুট্টা", gu: "મકાઈ", kn: "ಮೆಕ್ಕೆಜೋಳ", ml: "മക്കച്ചോളം", od: "ମକା", en: "Maize" },
  "Chickpea": { hi: "चना", te: "శనగలు", mr: "हरभरा", ta: "கொண்டைக்கடலை", pa: "ਛੋਲੇ", bn: "ছোলা", gu: "ચણા", kn: "ಕಡಲೆ", ml: "കടല", od: "ବୁଟ / ଚଣା", en: "Chickpea" },
  "Gram": { hi: "चना", te: "శనగలు", mr: "हरभरा", ta: "கொண்டைக்கடலை", pa: "ਛੋਲੇ", bn: "ছোলা", gu: "ચણા", kn: "ಕಡಲೆ", ml: "കടല", od: "ବୁଟ / ଚଣା", en: "Gram" },
  "Soybean": { hi: "सोयाबीन", te: "సోయాబీన్", mr: "सोयाबीन", ta: "சோயாபீன்", pa: "ਸੋਇਆਬੀਨ", bn: "সয়াবিন", gu: "સોયાબીન", kn: "ಸೋಯಾಬೀನ್", ml: "സോയാബീൻ", od: "ସୋୟାବିନ୍", en: "Soybean" },
  "Bajra": { hi: "बाजरा", te: "సజ్జలు", mr: "बाजरी", ta: "கம்பு", pa: "ਬਾਜਰਾ", bn: "বাজরা", gu: "બાજરી", kn: "ಸಜ್ಜೆ", ml: "കമ്പ്", od: "ବାଜରା", en: "Bajra" },
  "Pearl Millet": { hi: "बाजरा", te: "సజ్జలు", mr: "बाजरी", ta: "கம்பு", pa: "ਬਾਜਰਾ", bn: "বাজরা", gu: "બાજરી", kn: "ಸಜ್ಜೆ", ml: "കമ്പ്", od: "ବାଜରା", en: "Pearl Millet" },
  "Potato": { hi: "आलू", te: "బంగాళాదుంప", mr: "బటాటా", ta: "உருளைக்கிழங்கு", pa: "ਆਲੂ", bn: "আলু", gu: "બટાકા", kn: "ಆಲೂಗಡ್ಡೆ", ml: "ഉരുളക്കിഴങ്ങ്", od: "ଆଳୁ", en: "Potato" },
  "Tomato": { hi: "टमाटर", te: "టమోటా", mr: "टोमॅटो", ta: "தக்காளி", pa: "ਟਮਾਟਰ", bn: "টমেটো", gu: "ટામેટા", kn: "ಟೊಮೆಟೊ", ml: "തക്കാളി", od: "ଟମାଟୋ", en: "Tomato" },
  "Onion": { hi: "प्याज", te: "ఉల్లిపాయ", mr: "कांदा", ta: "வெங்காயம்", pa: "ਪਿਆਜ਼", bn: "পেঁয়াজ", gu: "ડુંગળી", kn: "ಈರುಳ್ಳಿ", ml: "സവാള / ഉള്ളി", od: "ପିଆଜ", en: "Onion" },
  "Garlic": { hi: "लहसुन", te: "వెల్లుల్లి", mr: "लसूण", ta: "பூண்டு", pa: "ਲਸਣ", bn: "রসুন", gu: "લસણ", kn: "ಬೆಳ್ಳುಳ್ಳಿ", ml: "വെളുത്തുള്ളി", od: "ରସୁଣ", en: "Garlic" }
}

export const SOIL_TYPES = {
  "Black cotton soil": { hi: "काली कपास मिट्टी", te: "నల్లరేగడి నేల", mr: "काळी कसदार माती", ta: "கரிசல் மண்", pa: "ਕਾਲੀ ਮਿੱਟੀ", bn: "কালো মাটি", gu: "કાળી કપાસની જમીન", kn: "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು", ml: "കറുത്ത പരുത്തി മണ്ണ്", od: "କଳା କପା ମାଟି", en: "Black cotton soil" },
  "Black soil": { hi: "काली मिट्टी", te: "నల్లరేగడి నేల", mr: "काळी माती", ta: "கரிசல் மண்", pa: "ਕਾਲੀ ਮਿੱਟੀ", bn: "কালো মাটি", gu: "કાળી જમીન", kn: "ಕಪ್ಪು ಮಣ್ಣು", ml: "കറുത്ത മണ്ണ്", od: "କଳା ମାଟି", en: "Black soil" },
  "Alluvial soil": { hi: "जलोढ़ मिट्टी", te: "ఒండ్రు నేల", mr: "गाळाची माती", ta: "வண்டல் மண்", pa: "ਜਲੋਢ ਮਿੱਟੀ", bn: "পলি মাটি", gu: "કાંપવાળી જમીન", kn: "ಮೆಕ್ಕಲು ಮಣ್ಣು", ml: "എക്കൽ മണ്ണ്", od: "ପଟୁ ମାଟି", en: "Alluvial soil" },
  "Red soil": { hi: "लाल मिट्टी", te: "ఎర్ర నేల", mr: "तांबडी माती", ta: "செம்மண்", pa: "ਲਾਲ ਮਿੱਟੀ", bn: "লাল মাটি", gu: "રાતી જમીન", kn: "ಕೆಂಪು ಮಣ್ಣು", ml: "ചെമ്മണ്ണ്", od: "ଲାଲ ମାଟି", en: "Red soil" },
  "Sandy loam": { hi: "बलुई दोमट मिट्टी", te: "ఇసుక నేల", mr: "वालुकामय माती", ta: "மணல் மண்", pa: "ਰੇਤਲੀ ਦੋਮਟ", bn: "বেলে দোআঁশ", gu: "રેતાળ ગોરાડુ જમીન", kn: "ಮರಳು ಮಿಶ್ರಿತ ಮಣ್ಣು", ml: "മണൽ കലർന്ന മണ്ണ്", od: "ବାଲିଆ ଦୋରସା ମାଟି", en: "Sandy loam" },
  "Loamy": { hi: "दोमट मिट्टी", te: "ఒండ్రు నేల", mr: "पोयटा माती", ta: "வண்டல் மண்", pa: "ਦੋਮਟ ਮਿੱਟੀ", bn: "দোআঁশ মাটি", gu: "ગોરાડુ જમીન", kn: "ಗೋಡು ಮಣ್ಣು", ml: "എക്കൽ കലർന്ന മണ്ണ്", od: "ଦୋରସା ମାଟି", en: "Loamy soil" },
  "Clayey": { hi: "चिकनी मिट्टी", te: "బంకమట్టి", mr: "चिकणमाती", ta: "களிமண்", pa: "ਚੀਕਣੀ ਮਿੱਟੀ", bn: "এঁটেল মাটি", gu: "ચીકણી માટી", kn: "ಜೇಡಿ ಮಣ್ಣು", ml: "കളിമണ്ണ്", od: "ଚေးଟ ମାଟି", en: "Clay soil" }
}

function normalizeLang(lang) {
  if (!lang || lang === 'en') return 'en'
  if (lang === 'or') return 'od'
  return lang
}

/** Localize place string like 'Kurukshetra' or 'Kurukshetra, Haryana' or 'Karnal, Haryana' */
export function localizePlaceName(placeStr, langCode = 'hi') {
  const code = normalizeLang(langCode)
  if (!placeStr || code === 'en') return placeStr || ''
  const trimmed = placeStr.trim()

  // Exact city match
  if (INDIAN_CITIES[trimmed]?.[code]) {
    return INDIAN_CITIES[trimmed][code]
  }

  // Exact state match
  if (INDIAN_STATES[trimmed]?.[code]) {
    return INDIAN_STATES[trimmed][code]
  }

  // Check 'City, State' format (e.g. 'Kurukshetra, Haryana')
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map((p) => p.trim())
    const city = parts[0]
    const state = parts.slice(1).join(', ')

    const locCity = INDIAN_CITIES[city]?.[code] || city
    const locState = INDIAN_STATES[state]?.[code] || state

    if (locCity !== city || locState !== state) {
      return `${locCity}, ${locState}`
    }
  }

  // Case-insensitive lookup
  for (const [key, map] of Object.entries(INDIAN_CITIES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return map[code] || trimmed
    }
  }
  for (const [key, map] of Object.entries(INDIAN_STATES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return map[code] || trimmed
    }
  }

  return trimmed
}

/** Localize state string like 'Haryana' or 'Punjab' */
export function localizeState(stateStr, langCode = 'hi') {
  const code = normalizeLang(langCode)
  if (!stateStr || code === 'en') return stateStr || ''
  const trimmed = stateStr.trim()
  if (INDIAN_STATES[trimmed]?.[code]) {
    return INDIAN_STATES[trimmed][code]
  }
  for (const [key, map] of Object.entries(INDIAN_STATES)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return map[code] || trimmed
    }
  }
  return trimmed
}

/** Localize crop string like 'Wheat and Mustard' */
export function localizeCropName(cropStr, langCode = 'hi') {
  const code = normalizeLang(langCode)
  if (!cropStr || code === 'en') return cropStr || ''
  let result = cropStr
  for (const [eng, map] of Object.entries(AGRI_CROPS)) {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi')
    if (regex.test(result)) {
      result = result.replace(regex, map[code] || eng)
    }
  }
  return result
}

/** Localize soil string like 'Black cotton soil' */
export function localizeSoilType(soilStr, langCode = 'hi') {
  const code = normalizeLang(langCode)
  if (!soilStr || code === 'en') return soilStr || ''
  for (const [eng, map] of Object.entries(SOIL_TYPES)) {
    if (soilStr.toLowerCase().includes(eng.toLowerCase())) {
      return map[code] || soilStr
    }
  }
  return soilStr
}
