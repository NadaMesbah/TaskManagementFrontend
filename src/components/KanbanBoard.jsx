import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid'; // Heroicons for icons

const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

const priorityColors = {
  High: 'bg-red-200 text-red-800',
  Medium: 'bg-yellow-200 text-yellow-800',
  Low: 'bg-green-200 text-green-800',
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'TODO',
    assignedEmployeeId: ''
  });

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

  const getEmployeeUsername = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.username : 'Unassigned';
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedEmployeeId: task.assignedEmployeeId
    });
    setEditingTaskId(task.taskId);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">Kanban Board</h1>

      {/* Task Cards */}
      <div className="flex space-x-8">
        {statuses.map((status) => (
          <div key={status} className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">{status}</h2>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status === status)
                .map((task) => (
                  <div
                    key={task.taskId}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {/* Priority Badge */}
                      <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[task.status]}`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1 mt-4">
                      <p className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        {getEmployeeUsername(task.assignedEmployeeId)}
                      </p>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                      <PencilSquareIcon
                        className="h-6 w-6 text-yellow-500 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleEdit(task)}
                      />
                      <TrashIcon
                        className="h-6 w-6 text-red-500 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => handleDelete(task.taskId)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
