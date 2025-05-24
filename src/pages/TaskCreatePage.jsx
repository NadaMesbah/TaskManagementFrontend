import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

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

const CreateTaskPage = () => {
  const [form, setForm] = useState(initialFormState);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

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
      await axios.post('http://localhost:8080/tasks/add', form);
      Swal.fire({
        icon: 'success',
        title: t('taskCreatedTitle'),
        text: t('taskCreatedText'),
      });
      setForm(initialFormState);
      navigate('/tasks/all');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('failed'),
        text: t('createError'),
      });
    }    
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#1d4ed8]">{t('create_task')}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block font-medium mb-1">{t('title')}</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">{t('description')}</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">{t('deadline')}</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">{t('estimated_duration')}</label>
            <input
              type="number"
              name="estimatedDuration"
              value={form.estimatedDuration}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">{t('actual_duration')}</label>
            <input
              type="number"
              name="actualDuration"
              value={form.actualDuration}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">{t('priority')}</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value="LOW">{t('low')}</option>
              <option value="MEDIUM">{t('medium')}</option>
              <option value="HIGH">{t('high')}</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">{t('status')}</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value="TODO">{t('todo')}</option>
              <option value="IN_PROGRESS">{t('in_progress')}</option>
              <option value="COMPLETED">{t('completed')}</option>
              <option value="CLOSED">{t('closed')}</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1">{t('assigned_employee')}</label>
            <select
              name="assignedEmployeeId"
              value={form.assignedEmployeeId}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            >
              <option value="">{t('select_employee')}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.username}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full"
            >
             {t('create_task')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
