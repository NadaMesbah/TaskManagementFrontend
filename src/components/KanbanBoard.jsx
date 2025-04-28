import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/solid'; // Heroicons for icons

const statuses = ["TODO", "IN_PROGRESS", "COMPLETED", "CLOSED"];

const priorityColors = {
  HIGH: 'bg-red-200 text-red-800',
  MEDIUM: 'bg-yellow-200 text-yellow-800',
  LOW: 'bg-green-200 text-green-800',
};

const statusColors = {
  TODO: 'bg-gray-300 text-gray-800',
  IN_PROGRESS: 'bg-yellow-300 text-yellow-800',
  COMPLETED: 'bg-green-300 text-green-800',
  CLOSED: 'bg-red-300 text-red-800',
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tasks/all');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const shortenDescription = (description, wordLimit = 10) => {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const getEmployeeUsername = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.username : 'Unassigned';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">Task Board</h1>

      {/* Task Columns */}
      <div className="flex space-x-6">
        {statuses.map((status) => (
          <div key={status} className="w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">{status.replace('_', ' ')}</h2>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status === status)
                .map((task) => (
                  <Link to={`/tasks/${task.taskId}`} key={task.taskId}>
                    <div
                      className="bg-white m-3 p-4 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold">{task.title}</h3>

                      <p>
                        {shortenDescription(task.description, 10)}
                        <button
                          style={{
                            color: 'blue',
                            border: 'none',
                            background: 'none',
                            marginLeft: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          See more
                        </button>
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {/* Priority Badge */}
                        <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1 mt-4">
                        <p className="flex items-center gap-2">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                          {getEmployeeUsername(task.assignedEmployeeId)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
