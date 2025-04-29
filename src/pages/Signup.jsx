import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicLayout from "../components/PublicLayout";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("PasswordsNoMatch"));
      return;
    }
    try {
      await signup(email, username, password);
      navigate("/verify", { state: { email: email } });
    } catch (error) {
      console.error("Signup failed:", error);
      navigate("/signup");
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-800">{t("CreateAccount")}</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("Email")}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm" placeholder={t("EnterEmail")} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t("Username")}</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm" placeholder={t("EnterUsername")} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t("Password")}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm" placeholder="••••••••" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t("ConfirmPassword")}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm" placeholder="••••••••" required />
            </div>

            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              {t("SignUp")}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {t("AlreadyAccount")} <a href="/login" className="text-blue-600 hover:underline">{t("Login")}</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Signup;