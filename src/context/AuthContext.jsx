import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LOGIN
  const login = async (email, password, navigate) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      }, {
        withCredentials: true,
      });

      const data = response.data;
      console.log("Login success:", data); // ADD THIS
  
      setUser(data);
      localStorage.setItem("token", data.token);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "EMPLOYEE") {
        navigate("/employee");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + (error?.response?.data?.message || "Unexpected error"));
    }
  };

  // SIGNUP
  const signup = async (email, username, password, navigate) => {
    try {
      await axios.post("http://localhost:8080/auth/signup", {
        email,
        username,
        password,
      }, {
        withCredentials: true,
      });

      navigate("/verify");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + (error?.response?.data?.message || "Unexpected error"));
    }
  };

  // VERIFY
  const verify = async (email, verificationCode, navigate) => {
    try {
      await axios.post("http://localhost:8080/auth/verify", {
        email,
        verificationCode,
      }, {
        withCredentials: true,
      });

      navigate("/login");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed: " + (error?.response?.data?.message || "Unexpected error"));
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
