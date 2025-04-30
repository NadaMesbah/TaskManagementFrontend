import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const role = localStorage.getItem("role"); // Adjust if you use context instead

  return (
    <header className="bg-blue-800 text-white px-8 py-5 flex justify-between items-center shadow-md">
      <Link to="/admin" className="text-2xl font-bold">{t('dashboard')}</Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/tasks/all"
          className="hover:text-blue-300 text-lg font-medium transition duration-150"
        >
           {t('tasks')}
        </Link>

        {role === "ADMIN" && (
          <Link
            to="/employees/summary"
            className="hover:text-blue-300 text-lg font-medium transition duration-150"
          >
            {t('employees')}
          </Link>
        )}
        {role === "ADMIN" && (
          <Link
          to="/stats"
          className="hover:text-blue-300 text-lg font-medium transition duration-150"
      
        >
         {t('stats')}
        </Link>
          
        )}
        

        <button
          onClick={() => logout(navigate)}
          className="bg-white text-blue-800 font-medium px-4 py-2 rounded hover:bg-gray-100 transition duration-150"
        >
          {t('logout')}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
