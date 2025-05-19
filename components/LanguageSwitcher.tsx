import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const getNextLanguage = (currentLang: string) => {
    switch (currentLang) {
      case 'en':
        return 'ta';
      case 'ta':
        return 'hi';
      case 'hi':
        return 'en';
      default:
        return 'en';
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'en':
        return 'ENGLISH';
      case 'ta':
        return 'தமிழ்';
      case 'hi':
        return 'हिंदी';
      default:
        return 'ENGLISH';
    }
  };

  const toggleLanguage = () => {
    const newLang = getNextLanguage(i18n.language);
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 text-black hover:text-[#D4AF37] transition-colors"
    >
      <span className="font-serif tracking-widest">
        {getLanguageLabel(i18n.language)}
      </span>
    </button>
  );
} 