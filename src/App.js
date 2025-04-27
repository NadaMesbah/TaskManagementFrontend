import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import TaskPage from "./pages/TaskPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/tasks" element={<TaskPage />} />
                    <Route path="/profile" component={ProfilePage} />
                    {/* Protected Admin Route */}
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
                            <ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
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
