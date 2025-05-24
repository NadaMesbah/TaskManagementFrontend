// --- WelcomePage.jsx ---
import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { useTranslation } from "react-i18next";

const WelcomePage = () => {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center text-center pt-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
          alt="TaskFlow"
          className="w-48 h-48 mb-6"
        />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t("WelcomeToApp")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          {t("WelcomeDescription")}
        </p>
        <div className="flex gap-4">
          <Link to="/login" className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition">
            {t("LoginAsAdmin")}
          </Link>
          <Link to="/login" className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition">
            {t("LoginAsEmployee")}
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default WelcomePage;
