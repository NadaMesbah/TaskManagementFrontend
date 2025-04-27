// src/pages/Verify.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email; 
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("No email provided. Please sign up again.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/verify", { email, verificationCode });
      setMessage(response.data);
      navigate("/login");  // After successful verification, go to login
    } catch (error) {
      setMessage(error.response?.data || "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Vérification du compte</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="text-center text-gray-500">
            <p>Un code a été envoyé à : <span className="font-semibold">{email}</span></p>
          </div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre code de vérification"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Vérifier
          </button>
        </form>
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default Verify;
