import React, { useState } from 'react';
import axios from 'axios';
import PublicLayout from "../components/PublicLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await await axios.post(`http://localhost:8080/auth/forgot_password?email=${email}`);
      setMessage(response.data);
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation :', error);
      setMessage("Une erreur est survenue. Veuillez vérifier votre email.");
    }
  };

  return (
    <PublicLayout>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Mot de passe oublié ?</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Réinitialiser le mot de passe</h2>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold transition"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
    </PublicLayout>
  );
};

export default ForgotPassword;
