import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Doctors": "Doctors",
      "Appointments": "Appointments",
      "Messages": "Messages",
      "AI Assistant": "AI Assistant",
      "Favorites": "Favorites",
      "Profile": "Profile",
      "hero_title": "The future of digital healthcare is here.",
      "hero_subtitle": "Experience zero wait times. Chat with our intelligent AI symptom checker, consult elite specialists via HD video, and manage your family's health—all from one secure, beautifully designed platform.",
      "explore_doctors": "Explore top doctors",
      "try_ai": "Try AI Assistant"
    }
  },
  hi: {
    translation: {
      "Doctors": "डॉक्टर",
      "Appointments": "अपॉइंटमेंट",
      "Messages": "मैसेंजर",
      "AI Assistant": "एआई सहायक",
      "Favorites": "पसंदीदा",
      "Profile": "प्रोफ़ाइल",
      "hero_title": "डिजिटल स्वास्थ्य सेवा का भविष्य यहाँ है।",
      "hero_subtitle": "जीरो वेटिंग टाइम का अनुभव लें। हमारे बुद्धिमान एआई असिस्टेंट से बात करें, एचडी वीडियो के माध्यम से विशेषज्ञ डॉक्टरों से परामर्श लें, और अपने परिवार के स्वास्थ्य को एक सुरक्षित प्लेटफ़ॉर्म से प्रबंधित करें।",
      "explore_doctors": "शीर्ष डॉक्टरों की खोज करें",
      "try_ai": "एआई असिस्टेंट आज़माएं"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
