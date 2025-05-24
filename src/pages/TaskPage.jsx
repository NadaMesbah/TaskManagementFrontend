import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  const { t } = useTranslation();
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    axios.get("http://localhost:8080/tasks/all")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));

    axios.get("http://localhost:8080/users/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-gray-200 text-gray-800';
      case 'IN_PROGRESS': return 'bg-yellow-200 text-yellow-800';
      case 'COMPLETED': return 'bg-green-200 text-green-800';
      case 'CLOSED': return 'bg-purple-200 text-purple-800';
      default: return 'bg-gray-300 text-gray-900';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-blue-200 text-blue-800';
      case 'MEDIUM': return 'bg-orange-200 text-orange-800';
      case 'HIGH': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-300 text-gray-900';
    }
  };

  const getEmployeeUsername = (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp ? emp.username : t('unassigned');
  };

  // Filtrage + Pagination
  const filteredTasks = tasks
    .filter((task) => {
      const employeeName = getEmployeeUsername(task.assignedEmployeeId).toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employeeName.includes(searchTerm.toLowerCase())
      );
    })
    .filter((task) => (statusFilter ? task.status === statusFilter : true))
    .filter((task) => (priorityFilter ? task.priority === priorityFilter : true));

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1d4ed8]">{t('all_tasks')}</h1>
        {isAdmin && (
          <Link to="/tasks/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            ➕ {t('create_task')}
          </Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-5 gap-5">
        <input
          type="text"
          placeholder={t('search_by_title_or_employee')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page
          }}
          className="col-span-1 md:col-span-2 border p-2 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded-lg"
        >
          <option value="">{t('all_statuses')}</option>
          <option value="TODO">{t('todo')}</option>
          <option value="IN_PROGRESS">{t('in_progress')}</option>
          <option value="COMPLETED">{t('completed')}</option>
          <option value="CLOSED">{t('closed')}</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded-lg"
        >
          <option value="">{t('all_priorities')}</option>
          <option value="LOW">{t('low')}</option>
          <option value="MEDIUM">{t('medium')}</option>
          <option value="HIGH">{t('high')}</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('');
            setPriorityFilter('');
            setCurrentPage(1);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-2 rounded-lg"
        >
          {t('reset_filters')}
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTasks.map((task) => (
          <Link to={`/tasks/${task.taskId}`} key={task.taskId}>
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                  {t(task.priority.toLowerCase())}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                  {t(task.status.toLowerCase())}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>{t('deadline')}: {task.deadline}</p>
                <p>{t('estimated_duration')}: {task.estimatedDuration}h</p>
                <p>{t('actual_duration')}: {task.actualDuration}h</p>
                <p>{t('assigned_employee')}: {getEmployeeUsername(task.assignedEmployeeId)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {t('previous')}
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
