import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import TaskPage from "./pages/TaskPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import { useAuth } from "./context/AuthContext";

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">Loading...</p>
            </div>
        );
    }
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/tasks" element={<TaskPage />} />
                    <Route path="/tasks/:id" element={<TaskDetailsPage />} />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Employee Route */}
                    <Route
                        path="/employee"
                        element={
                            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
