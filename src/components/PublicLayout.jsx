// import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PublicLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
//   const [isDark, setIsDark] = useState(false);

  // Restore theme from localStorage
//   useEffect(() => {
//     const dark = localStorage.getItem("theme") === "dark";
//     setIsDark(dark);
//     document.documentElement.classList.toggle("dark", dark);
//   }, []);

//   const toggleDark = () => {
//     const newMode = !isDark;
//     setIsDark(newMode);
//     document.documentElement.classList.toggle("dark", newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header with toolbar */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-[#dbeafe] dark:bg-gray-800 shadow">
        <Link to="/" style={{ color: "#1d4ed8" }} className="text-2xl font-bold dark:text-white flex flex-row items-center">
        <img src="/logoapp.png" alt="TF" className="w-20 h-auto"/>
          TaskFlow
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <nav className="flex gap-4">
            <Link to="/login" style={{ color: "#1d4ed8" }} className="font-medium hover:underline dark:text-white">
              {t("login")}
            </Link>
            <Link to="/signup" style={{ color: "#1d4ed8" }} className="font-medium hover:underline dark:text-white">
              {t("register")}
            </Link>
          </nav>

          {/* Theme toggle 
          <button
            onClick={toggleDark}
            className="px-3 py-1 rounded border text-sm dark:text-white"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>*/}

          {/* Language switcher */}
          <div className="flex gap-1">
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 rounded text-sm ${
                i18n.language === "en"
                  ? "bg-[#1d4ed8] text-white"
                  : "text-[#1d4ed8] border border-[#1d4ed8]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("fr")}
              className={`px-2 py-1 rounded text-sm ${
                i18n.language === "fr"
                  ? "bg-[#1d4ed8] text-white"
                  : "text-[#1d4ed8] border border-[#1d4ed8]"
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#dbeafe] dark:bg-gray-800 shadow p-4 text-center text-sm text-indigo-500 dark:text-gray-400">
        © {new Date().getFullYear()} {t("task_manager")}. {t("all_rights_are_reserved")}.
      </footer>
    </div>
  );
};

export default PublicLayout;
