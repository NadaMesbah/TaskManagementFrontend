import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import axios from 'axios';

const TaskDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [form, setForm] = useState(null);
    const [employees, setEmployees] = useState([]);
    const userRole = localStorage.getItem('role');

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
    const handleGoBack = () => {
        if (userRole === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/employee');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/tasks/update/${id}`, form);
            alert('Task updated successfully');
            navigate('/tasks'); // Redirect back to tasks board
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/tasks/delete/${id}`);
            alert('Task deleted successfully');
            navigate('/tasks');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    if (!task || !form) return <div className="p-8">Loading...</div>;

    const isAdmin = userRole === 'ADMIN';

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md mt-10">
            <button
                type="button"
                onClick={handleGoBack}
                className="w-30 bg-gray-300 text-black font-bold py-2 px-6 m-3 rounded-lg mt-4"
            >
                <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Task Details</h1>


            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />

                {/* Description */}
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    rows="4"
                />

                {/* Deadline */}
                {isAdmin ? (
                    <input
                        type="date"
                        name="deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                    />
                ) : (
                    <input
                        type="date"
                        name="deadline"
                        value={form.deadline}
                        readOnly
                        disabled
                        className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                )}

                {/* Estimated Duration */}
                <input
                    type="number"
                    name="estimatedDuration"
                    value={form.estimatedDuration}
                    onChange={handleChange}
                    readOnly={!isAdmin}
                    placeholder="Estimated Duration (hours)"
                    className={`w-full border p-2 rounded-lg ${!isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />

                {/* Actual Duration (Always editable for Employee and Admin) */}
                <input
                    type="number"
                    name="actualDuration"
                    value={form.actualDuration}
                    onChange={handleChange}
                    placeholder="Actual Duration (hours)"
                    className="w-full border p-2 rounded-lg"
                />

                {/* Priority */}
                {isAdmin ? (
                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
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

                {/* Status */}
                {isAdmin ? (
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded-lg"
                    >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CLOSED">CLOSED</option>
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
                {/* Assigned Employee */}
                {isAdmin ? (
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
                ) : (
                    <input
                        type="text"
                        value={form.assignedEmployeeId}
                        readOnly
                        disabled
                        className="w-full border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                )}


                {/* Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Save Changes
                    </button>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
                        >
                            Delete Task
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskDetailsPage;
