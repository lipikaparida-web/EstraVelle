import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "dashboard": "Dashboard",
        "logs": "Daily Log",
        "insights": "Health Report",
        "wellness": "Wellness Plan",
        "community": "Community",
        "profile": "Profile"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "Your hormonal health sanctuary.",
        "stage": "Current Stage",
        "cycle_day": "Cycle Day",
        "next_period": "Expected Period",
        "days": "Days",
        "log_today": "Log Today's Vibration",
        "phase_description": "Estrogen is rising. Your energy and creativity are beginning to bloom."
      },
      "phases": {
        "menstrual": "Menstrual Phase",
        "follicular": "Follicular Phase",
        "ovulation": "Ovulation Phase",
        "luteal": "Luteal Phase"
      },
      "common": {
        "save": "Save Changes",
        "cancel": "Cancel",
        "loading": "Loading...",
        "language": "Language"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "dashboard": "डैशबोर्ड",
        "logs": "दैनिक लॉग",
        "insights": "स्वास्थ्य रिपोर्ट",
        "wellness": "वेलनेस प्लान",
        "community": "समुदाय",
        "profile": "प्रोफ़ाइल"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "आपका हार्मोनल स्वास्थ्य अभयारण्य।",
        "stage": "वर्तमान चरण",
        "cycle_day": "चक्र का दिन",
        "next_period": "अपेक्षित अवधि",
        "days": "दिन",
        "log_today": "आज का स्वास्थ्य लॉग करें",
        "phase_description": "एस्ट्रोजन बढ़ रहा है। आपकी ऊर्जा और रचनात्मकता खिलने लगी है।"
      },
      "phases": {
        "menstrual": "मासिक धर्म चरण",
        "follicular": "कूपिक चरण",
        "ovulation": "ओव्यूलेशन चरण",
        "luteal": "ल्यूटियल चरण"
      },
      "common": {
        "save": "सहेजें",
        "cancel": "रद्द करें",
        "loading": "लोड हो रहा है...",
        "language": "भाषा"
      }
    }
  },
  bn: {
    translation: {
      "nav": {
        "dashboard": "ড্যাশবোর্ড",
        "logs": "দৈনিক লগ",
        "insights": "স্বাস্থ্য রিপোর্ট",
        "wellness": "ওয়েলনেস প্ল্যান",
        "community": "সম্প্রদায়",
        "profile": "প্রোফাইল"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "আপনার হরমোন স্বাস্থ্যের অভয়ারণ্য।",
        "stage": "বর্তমান পর্যায়",
        "cycle_day": "চক্রের দিন",
        "next_period": "প্রত্যাশিত পিরিয়ড",
        "days": "দিন",
        "log_today": "আজকের স্বাস্থ্য লগ করুন",
        "phase_description": "এস্ট্রোজেন বাড়ছে। আপনার শক্তি এবং সৃজনশীলতা বিকশিত হতে শুরু করেছে।"
      },
      "phases": {
        "menstrual": "মাসিক পর্যায়",
        "follicular": "ফলিকুলার পর্যায়",
        "ovulation": "ডিম্বস্ফোটন পর্যায়",
        "luteal": "লুটিয়াল পর্যায়"
      },
      "common": {
        "save": "সংরক্ষণ করুন",
        "cancel": "বাতিল করুন",
        "loading": "লোড হচ্ছে...",
        "language": "ভাষা"
      }
    }
  },
  ta: {
    translation: {
      "nav": {
        "dashboard": "டாஷ்போர்டு",
        "logs": "தினசரி பதிவு",
        "insights": "சுய அறிக்கை",
        "wellness": "நலத் திட்டம்",
        "community": "சமூகம்",
        "profile": "சுயவிபரம்"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "உங்கள் ஹார்மோன் ஆரோக்கிய சரணாலயம்.",
        "stage": "தற்போதைய நிலை",
        "cycle_day": "சுழற்சி நாள்",
        "next_period": "எதிர்பார்க்கப்படும் காலம்",
        "days": "நாட்கள்",
        "log_today": "இன்றைய பதிவைச் சேர்க்கவும்",
        "phase_description": "ஈஸ்ட்ரோஜன் அதிகரித்து வருகிறது. உங்கள் ஆற்றல் மற்றும் படைப்பாற்றல் மலரத் தொடங்குகிறது."
      },
      "phases": {
        "menstrual": "மாதவிடாய் நிலை",
        "follicular": "ஃபோலிகுலர் நிலை",
        "ovulation": "கருமுட்டை வெளியேற்ற நிலை",
        "luteal": "லூட்டியல் நிலை"
      },
      "common": {
        "save": "சேமி",
        "cancel": "ரத்துசெய்",
        "loading": "ஏற்றப்படுகிறது...",
        "language": "மொழி"
      }
    }
  },
  te: {
    translation: {
      "nav": {
        "dashboard": "డాష్‌బోర్డ్",
        "logs": "రోజువారీ లాగ్",
        "insights": "ఆరోగ్య నివేదిక",
        "wellness": "వెల్నెస్ ప్లాన్",
        "community": "కమ్యూనిటీ",
        "profile": "ప్రొఫైల్"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "మీ హార్మోన్ల ఆరోగ్య అభయారణ్యం.",
        "stage": "ప్రస్తుత దశ",
        "cycle_day": "చక్రం రోజు",
        "next_period": "అంచనా పీరియడ్",
        "days": "రోజులు",
        "log_today": "నేటి లాగ్‌ను నమోదు చేయండి",
        "phase_description": "ఈస్ట్రోజెన్ పెరుగుతోంది. మీ శక్తి మరియు సృజనాత్మకత వికసించడం ప్రారంభిస్తున్నాయి."
      },
      "phases": {
        "menstrual": "ఋతు దశ",
        "follicular": "ఫోలిక్యులర్ దశ",
        "ovulation": "అండోత్సర్గము దశ",
        "luteal": "లూటియల్ దశ"
      },
      "common": {
        "save": "సేవ్ చేయండి",
        "cancel": "రద్దు చేయండి",
        "loading": "లోడ్ అవుతోంది...",
        "language": "భాష"
      }
    }
  },
  mr: {
    translation: {
      "nav": {
        "dashboard": "डॅशबोर्ड",
        "logs": "दैनिक लॉग",
        "insights": "आरोग्य अहवाल",
        "wellness": "वेलनेस प्लॅन",
        "community": "समुदाय",
        "profile": "प्रोफाइल"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "तुमचे हार्मोनल आरोग्य अभयारण्य।",
        "stage": "सध्याचा टप्पा",
        "cycle_day": "चक्राचा दिवस",
        "next_period": "अपेक्षित कालावधी",
        "days": "दिवस",
        "log_today": "आजची नोंद करा",
        "phase_description": "इस्ट्रोजेन वाढत आहे. तुमची ऊर्जा आणि कल्पकता फुलू लागली आहे."
      },
      "phases": {
        "menstrual": "मासिक पाळीचा टप्पा",
        "follicular": "फॉलिक्युलर टप्पा",
        "ovulation": "ओव्हुलेशन टप्पा",
        "luteal": "ल्युटियल टप्पा"
      },
      "common": {
        "save": "जतन करा",
        "cancel": "रद्द करा",
        "loading": "लोड होत आहे...",
        "language": "भाषा"
      }
    }
  },
  kn: {
    translation: {
      "nav": {
        "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "logs": "ದೈನಂದಿನ ಲಾಗ್",
        "insights": "ಆರೋಗ್ಯ ವರದಿ",
        "wellness": "ವೆಲ್ನೆಸ್ ಪ್ಲಾನ್",
        "community": "ಸಮುದಾಯ",
        "profile": "ಪ್ರೊಫೈಲ್"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "ನಿಮ್ಮ ಹಾರ್ಮೋನುಗಳ ಆರೋಗ್ಯ ತಾಣ.",
        "stage": "ಪ್ರಸ್ತುತ ಹಂತ",
        "cycle_day": "ಚಕ್ರದ ದಿನ",
        "next_period": "ನಿರೀಕ್ಷಿತ ಅವಧಿ",
        "days": "ದಿನಗಳು",
        "log_today": "ಇಂದಿನ ವಿವರ ದಾಖಲಿಸಿ",
        "phase_description": "ಈಸ್ಟ್ರೊಜೆನ್ ಹೆಚ್ಚುತ್ತಿದೆ. ನಿಮ್ಮ ಶಕ್ತಿ ಮತ್ತು ಸೃಜನಶೀಲತೆ ಅರಳಲಾರಂಭಿಸಿದೆ."
      },
      "phases": {
        "menstrual": "ಮುಟ್ಟಿನ ಹಂತ",
        "follicular": "ಫೋಲಿಕ್ಯುಲರ್ ಹಂತ",
        "ovulation": "ಅಂಡೋತ್ಪತ್ತಿ ಹಂತ",
        "luteal": "ಲ್ಯೂಟಿಯಲ್ ಹಂತ"
      },
      "common": {
        "save": "ಉಳಿಸಿ",
        "cancel": "ರದ್ದುಮಾಡಿ",
        "loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        "language": "ಭಾಷೆ"
      }
    }
  },
  ml: {
    translation: {
      "nav": {
        "dashboard": "ഡാഷ്ബോർഡ്",
        "logs": "ദൈനംദിന ലോഗ്",
        "insights": "ആരോഗ്യ റിപ്പോർട്ട്",
        "wellness": "വെൽനസ് പ്ലാൻ",
        "community": "കമ്മ്യൂണിറ്റി",
        "profile": "പ്രൊഫൈൽ"
      },
      "dashboard": {
        "title": "EstraVelle",
        "subtitle": "നിങ്ങളുടെ ഹോർമോൺ ആരോഗ്യ സങ്കേതം.",
        "stage": "നിലവിലെ ഘട്ടം",
        "cycle_day": "സൈക്കിൾ ദിവസം",
        "next_period": "പ്രതീക്ഷിക്കുന്ന പീരിയഡ്",
        "days": "ദിവസങ്ങൾ",
        "log_today": "ഇന്നത്തെ വിവരങ്ങൾ രേഖപ്പെടുത്തുക",
        "phase_description": "ഈസ്ട്രജൻ വർദ്ധിക്കുന്നു. നിങ്ങളുടെ ഊർജ്ജവും സർഗ്ഗാത്മകതയും വിടരാൻ തുടങ്ങുന്നു."
      },
      "phases": {
        "menstrual": "ആർത്തവ ഘട്ടം",
        "follicular": "ഫോളികുലാർ ഘട്ടം",
        "ovulation": "അണ്ഡോത്സർഗ്ഗ ഘട്ടം",
        "luteal": "ലൂട്ടിയൽ ഘട്ടം"
      },
      "common": {
        "save": "സേവ് ചെയ്യുക",
        "cancel": "റദ്ദാക്കുക",
        "loading": "ലോഡ് ആകുന്നു...",
        "language": "ഭാഷ"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
