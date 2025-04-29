import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng); // Optional: Save preference
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded border ${
          i18n.language === 'en' ? 'bg-primary text-white' : 'bg-white text-primary'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-1 rounded border ${
          i18n.language === 'fr' ? 'bg-primary text-white' : 'bg-white text-primary'
        }`}
      >
        FR
      </button>
    </div>
  );
}
