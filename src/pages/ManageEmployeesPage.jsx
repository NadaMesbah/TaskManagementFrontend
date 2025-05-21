import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    <div className="max-w-6xl mx-auto p-4 bg-white mt-12 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700">{t('employee_management')}</h2>
        <button
          onClick={() => navigate("/employees/add")}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ➕ {t('add_employee')}
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="text-gray-500 text-center">{t('no_employees_found')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-r">{t('username')}</th>
                <th className="px-6 py-3 border-r">Email</th>
                <th className="px-6 py-3 border-r">{t('FirstName')}</th>
                <th className="px-6 py-3 border-r">{t('LastName')}</th>
                <th className="px-6 py-3 border-r">{t('total_tasks')}</th>
                <th className="px-6 py-3 border-r">{t('completed')}</th>
                <th className="px-6 py-3 border-r">{t('in_progress')}</th>
                <th className="px-6 py-3">{t('todo')}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr
                  key={idx}
                  className={`bg-white hover:bg-blue-50 transition duration-200 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <td className="px-6 py-4 border-r font-medium">{emp.username}</td>
                  <td className="px-6 py-4 border-r">{emp.email}</td>
                  <td className="px-6 py-4 border-r">{emp.firstname}</td>
                  <td className="px-6 py-4 border-r">{emp.lastname}</td>
                  <td className="px-6 py-4 border-r">{emp.totalTasks}</td>
                  <td className="px-6 py-4 border-r text-green-600">{emp.completedTasks}</td>
                  <td className="px-6 py-4 border-r text-yellow-600">{emp.inProgressTasks}</td>
                  <td className="px-6 py-4 text-red-600">{emp.todoTasks}</td>
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
