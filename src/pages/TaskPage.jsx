import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'; // Heroicons for icons

const initialFormState = {
  title: '',
  description: '',
  priority: 'LOW',
  status: 'TODO',
  deadline: '',
  estimatedDuration: '',
  actualDuration: '',
  assignedEmployeeId: ''
};

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]); // 👈 added
  const [form, setForm] = useState(initialFormState);
  const [editingTaskId, setEditingTaskId] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.post(`http://localhost:8080/tasks/update/${editingTaskId}`, form);
        setEditingTaskId(null);
      } else {
        await axios.post('http://localhost:8080/tasks/add', form);
      }
      setForm(initialFormState);
      fetchTasks();
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline,
      estimatedDuration: task.estimatedDuration,
      actualDuration: task.actualDuration,
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-200 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-200 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-300 text-gray-900';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-blue-200 text-blue-800';
      case 'MEDIUM':
        return 'bg-orange-200 text-orange-800';
      case 'HIGH':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-300 text-gray-900';
    }
  };

  // 👇 helper to find employee username
  const getEmployeeUsername = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.username : 'Unassigned';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">Task Manager</h1>

      {/* Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">{editingTaskId ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form fields */}
          {Object.keys(initialFormState).map((key) => (
            (key !== 'priority' && key !== 'status' && key !== 'assignedEmployeeId') ? (
              <input
                key={key}
                type={key === 'deadline' ? 'date' : 'text'}
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                required={key !== 'actualDuration'}
                className="border rounded-lg p-3 w-full"
              />
            ) : null
          ))}
          
          {/* Priority */}
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          {/* Assigned Employee */}
          <select
            name="assignedEmployeeId"
            value={form.assignedEmployeeId}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.username}
              </option>
            ))}
          </select>

          {/* Submit button */}
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
          >
            {editingTaskId ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>

      {/* Tasks */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.taskId}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                <p>Deadline: {task.deadline}</p>
                <p>Estimated: {task.estimatedDuration}h</p>
                <p>Actual: {task.actualDuration}h</p>
                <p>Employee: {getEmployeeUsername(task.assignedEmployeeId)}</p> {/* 👈 username shown here */}
              </div>
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
  );
};

export default TaskPage;
