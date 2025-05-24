import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, navigate);
  };

  return (
    <PublicLayout>
      <div className="flex h-full pt-24 pb-24 items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-5 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-800">{t("Login")}</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("Email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("EnterEmail")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t("Password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full px-4 py-2 text-white bg-[#1d4ed8] rounded-lg hover:bg-[#3b82f6] transition duration-300">
              {t("Login")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {t("NoAccount")} <a href="/signup" className="text-[#1d4ed8] hover:underline">{t("SignUp")}</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;