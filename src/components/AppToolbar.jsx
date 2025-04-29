import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function AppToolbar() {
  const { i18n, t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  // Restore theme from localStorage (optional)
  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDark = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
      <h1 className="text-xl font-bold text-primary dark:text-white">{t('welcome')}</h1>
      <div className="flex gap-4 items-center">
        <button
          onClick={toggleDark}
          className="px-3 py-1 rounded border text-sm dark:text-white"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-2 py-1 rounded text-sm ${
              i18n.language === 'en'
                ? 'bg-primary text-white'
                : 'text-primary border border-primary'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('fr')}
            className={`px-2 py-1 rounded text-sm ${
              i18n.language === 'fr'
                ? 'bg-primary text-white'
                : 'text-primary border border-primary'
            }`}
          >
            FR
          </button>
        </div>
      </div>
    </div>
  );
}
