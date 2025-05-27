import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../components/PublicLayout";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage("❌ Jeton invalide ou manquant.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/auth/reset_password?token=${token}`,
        { password }
      );
      setMessage(response.data || "✅ Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data || "❌ Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <PublicLayout>
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Réinitialiser le mot de passe</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Entrez votre nouveau mot de passe</p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Réinitialiser le mot de passe
          </button>
        </form>

        {message && (
          <div className={`mt-4 text-center text-sm px-4 py-2 rounded ${
            message.startsWith('✅') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
    </PublicLayout>
  );
};

export default ResetPassword;
