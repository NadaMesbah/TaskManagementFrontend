import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUser({ token, role });

      const validateToken = async () => {
        try {
          await axios.get("http://localhost:8080/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, navigate) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;
      console.log("Login success:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      setUser({ token: data.token, role: data.role });

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + (error?.response?.data?.message || "Unexpected error"));
    }
  };

  const signup = async (email, username, password, navigate) => {
    try {
      await axios.post(
        "http://localhost:8080/auth/signup",
        { email, username, password },
        { withCredentials: true }
      );
      navigate("/verify");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + (error?.response?.data?.message || "Unexpected error"));
    }
  };

  const verify = async (email, verificationCode, navigate) => {
    try {
      await axios.post(
        "http://localhost:8080/auth/verify",
        { email, verificationCode },
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed: " + (error?.response?.data?.message || "Unexpected error"));
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login", { replace: true });
  };
  
  return (
    <AuthContext.Provider value={{ user, login, signup, verify, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
