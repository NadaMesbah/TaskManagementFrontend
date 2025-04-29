import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

const ManageEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await axios.get("http://localhost:8080/employees/summary");
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employee summaries", err);
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">{t('employee_management')}</h2>
        <button
          onClick={() => navigate("/employees/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ {t('add_employee')}
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-gray-500 text-center">{t('no_employees_found')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">{t('username')}</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">{t('total_tasks')}</th>
                <th className="p-2 border">{t('completed')}</th>
                <th className="p-2 border">{t('in_progress')}</th>
                <th className="p-2 border">{t('todo')}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{emp.username}</td>
                  <td className="p-2 border">{emp.email}</td>
                  <td className="p-2 border">{emp.totalTasks}</td>
                  <td className="p-2 border">{emp.completedTasks}</td>
                  <td className="p-2 border">{emp.inProgressTasks}</td>
                  <td className="p-2 border">{emp.todoTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEmployeesPage;
