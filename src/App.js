import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './i18n';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import WelcomePage from "./pages/WelcomePage";
import TaskCreatePage from "./pages/TaskCreatePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import TaskPage from "./pages/TaskPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import ManageEmployeesPage from "./pages/ManageEmployeesPage";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Unauthorized from "./pages/Unauthorized";

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
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify" element={<Verify />} />
                    
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Now these will have the Navbar automatically */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/employees/add" element={<AddEmployeePage />} />
                        <Route path="/employees/summary" element={<ManageEmployeesPage />} />
                        <Route path="/tasks/all" element={<TaskPage />} />
                        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                        <Route path="/tasks/create" element={<TaskCreatePage />} />
                        <Route path="/employee" element={<EmployeeDashboard />} />
                        {/* <Route path="/employee/tasks" element={<EmployeeTasks />} /> */}
                    </Route>
                    {/* <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Employee Route */}
                    {/*<Route
                        path="/employee"
                        element={
                            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    /> */}

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
