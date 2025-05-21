import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

import axios from 'axios';

const TaskDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [form, setForm] = useState(null);
    const [employees, setEmployees] = useState([]);
    const userRole = localStorage.getItem('role');
    const { t } = useTranslation();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/tasks/${id}`);
                setTask(response.data);
                setForm(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:8080/users/employees');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchTask();
        fetchEmployees();
    }, [id]);

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
            await axios.post(`http://localhost:8080/tasks/update/${id}`, form);
            Swal.fire({
              icon: 'success',
              title: t('taskUpdatedTitle'),
              text: t('updateSuccess'),
            }).then(() => {
              navigate('/tasks/all');
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: t('updateFailed'),
              text: t('updateError'),
            });
          }          
    };

    const handleDelete = async () => {
        Swal.fire({
            title: t('deleteConfirmTitle'),
            text: t('deleteConfirmText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('yesdelete')
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await axios.delete(`http://localhost:8080/tasks/delete/${id}`);
                Swal.fire(t('deleteConfirmed'), t('deleteSuccess'), 'success').then(() => {
                  navigate('/tasks/all');
                });
              } catch (error) {
                Swal.fire(t('failed'), t('deleteError'), 'error');
              }
            }
          });
          
    };

    if (!task || !form) return <div className="p-8">Loading...</div>;

    const isAdmin = userRole === 'ADMIN';

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">{t('task_details')}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title */}
                <div>
                    <label className="block font-medium mb-1">{t('title')}</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        readOnly={!isAdmin}
                        className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">{t('description')}</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        readOnly={!isAdmin}
                        className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        rows="4"
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label className="block font-medium mb-1">{t('deadline')}</label>
                    <input
                        type="date"
                        name="deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        readOnly={!isAdmin}
                        disabled={!isAdmin}
                        className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Estimated Duration */}
                <div>
                    <label className="block font-medium mb-1">{t('estimated_duration')}</label>
                    <input
                        type="number"
                        name="estimatedDuration"
                        value={form.estimatedDuration}
                        onChange={handleChange}
                        readOnly={!isAdmin}
                        className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                </div>

                {/* Actual Duration - to update */} 
                <div>
                    <label className="block font-medium mb-1">{t('actual_duration')}</label>
                    <input
                        type="number"
                        name="actualDuration"
                        value={form.actualDuration}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="block font-medium mb-1">{t('priority')}</label>
                    {isAdmin ? (
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value="LOW">{t('low')}</option>
                            <option value="MEDIUM">{t('medium')}</option>
                            <option value="HIGH">{t('high')}</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={form.priority}
                            readOnly
                            disabled
                            className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block font-medium mb-1">{t('status')}</label>
                    {isAdmin ? (
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value="TODO">{t('todo')}</option>
                            <option value="IN_PROGRESS">{t('in_progress')}</option>
                            <option value="COMPLETED">{t('completed')}</option>
                            <option value="CLOSED">{t('closed')}</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={form.status}
                            readOnly
                            disabled
                            className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    )}
                </div>

                {/* Assigned Employee */}
                <div>
                    <label className="block font-medium mb-1">{t('assigned_employee')}</label>
                    {isAdmin ? (
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
                    ) : (
                        <input
                            type="text"
                            value={
                                employees.find((emp) => emp.id === form.assignedEmployeeId)?.username || 'Unassigned'
                            }
                            readOnly
                            disabled
                            className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                    >
                       {t('save_changes')}
                    </button>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
                        >
                            {t('delete_task')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskDetailsPage;
