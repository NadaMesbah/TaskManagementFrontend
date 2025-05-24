import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const { t } = useTranslation();
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskRes = await axios.get("http://localhost:8080/tasks/all");
                const myTasks = taskRes.data.filter(
                    (task) => task.assignedEmployeeId === user.userId
                );
                setTasks(myTasks);

                const empRes = await axios.get("http://localhost:8080/users/employees");
                setEmployees(empRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (user?.userId) {
            fetchData();
        }
    }, [user?.userId]);

    const getStatusColor = (status) => {
        switch (status) {
            case "TODO":
                return "bg-gray-200 text-gray-800";
            case "IN_PROGRESS":
                return "bg-yellow-200 text-yellow-800";
            case "COMPLETED":
                return "bg-green-200 text-green-800";
            case "CLOSED":
                return "bg-purple-200 text-purple-800";
            default:
                return "bg-gray-300 text-gray-900";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "LOW":
                return "bg-blue-200 text-blue-800";
            case "MEDIUM":
                return "bg-orange-200 text-orange-800";
            case "HIGH":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-300 text-gray-900";
        }
    };

    const getEmployeeUsername = (employeeId) => {
        const emp = employees.find((e) => e.id === employeeId);
        return emp ? emp.username : t("unassigned");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-blue-700 mb-8">{t("my_tasks")}</h1>

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <img
                        src="/no-tasks-found.png" alt="No tasks"
                        className="w-64 h-auto mb-6"
                    />
                    <p className="text-2xl text-gray-600 font-bold">
                        {t("no_tasks_message") || "You don't have any tasks yet."}
                    </p>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <Link to={`/tasks/${task.taskId}`} key={task.taskId}>
                            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                                <h3 className="text-xl font-bold mb-2 text-gray-800">{task.title}</h3>
                                <p className="text-gray-600 mb-4">{task.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                                            task.priority
                                        )}`}
                                    >
                                        {t(task.priority.toLowerCase())}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                            task.status
                                        )}`}
                                    >
                                        {t(task.status.toLowerCase())}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>
                                        {t("deadline")}: {task.deadline}
                                    </p>
                                    <p>
                                        {t("estimated_duration")}: {task.estimatedDuration}h
                                    </p>
                                    <p>
                                        {t("actual_duration")}: {task.actualDuration}h
                                    </p>
                                    <p>
                                        {t("assigned_employee")}: {getEmployeeUsername(task.assignedEmployeeId)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTasks;
