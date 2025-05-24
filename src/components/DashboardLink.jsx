import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardLink = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/employee');
    }
  };

  return (
    <button onClick={handleClick} className="text-2xl font-bold">
      {t('dashboard')}
    </button>
  );
};

export default DashboardLink;
