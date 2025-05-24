import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import DashboardLink from './DashboardLink';

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const role = localStorage.getItem("role"); // Adjust if you use context instead

  return (
    <header className="bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#63a5fa]
 text-white px-8 py-5 flex justify-between items-center shadow-md">
      <DashboardLink />
      <nav className="flex items-center gap-6">
        <Link
          to="/tasks/all"
          className="hover:text-indigo-300 text-lg font-medium transition duration-150"
        >
          {t('tasks')}
        </Link>

        {role === "EMPLOYEE" && (
          <Link to="/my-tasks" className="hover:text-indigo-300 text-lg font-medium transition duration-150">
            {t('my_tasks')}
          </Link>
        )}
        {role === "ADMIN" && (
          <Link
            to="/employees/summary"
            className="hover:text-indigo-300 text-lg font-medium transition duration-150"
          >
            {t('employees')}
          </Link>
        )}

        {role === "ADMIN" && (
          <Link
            to="/stats"
            className="hover:text-indigo-300 text-lg font-medium transition duration-150"

          >
            {t('stats')}
          </Link>

        )}


        <button
          onClick={() => logout(navigate)}
          className="bg-white text-[#1d4ed8] font-medium px-4 py-2 rounded hover:bg-gray-100 transition duration-150"
        >
          {t('logout')}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
