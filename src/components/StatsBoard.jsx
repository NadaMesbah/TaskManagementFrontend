import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function StatsDashboard() {
    const [byStatus, setByStatus] = useState({});
    const [byPriority, setByPriority] = useState({});
    const [byDay, setByDay] = useState({});
    const [byWeek, setByWeek] = useState({});
    const [beforeAfter, setBeforeAfter] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statusRes, priorityRes, dayRes, weekRes, beforeAfterRes] = await Promise.all([
                    axios.get('/stats/tasks-by-status'),
                    axios.get('/stats/tasks-by-priority'),
                    axios.get('/stats/tasks-by-day'),
                    axios.get('/stats/tasks-by-week'),
                    axios.get('/stats/completed-before-after-deadline'),
                ]);

                setByStatus(statusRes.data);
                setByPriority(priorityRes.data);
                setByDay(dayRes.data);
                setByWeek(weekRes.data);
                setBeforeAfter(beforeAfterRes.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        fetchStats();
    }, []);

    // Helper to transform a map-like object into chart data
    const toChartData = (dataObj, label = '') => {
        const labels = Object.keys(dataObj);
        const values = Object.values(dataObj);

        // Special case for Before vs After Deadline
        if (labels.length === 2 && labels.includes('BeforeDeadline') && labels.includes('AfterDeadline')) {
            return {
                labels,
                datasets: [
                    {
                        label,
                        data: values,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
        }

        return {
            labels,
            datasets: [
                {
                    label,
                    data: values,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(205, 98, 181, 0.5)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(91, 28, 78, 0.5)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const isEmptyData = (dataObj) =>
        !dataObj || Object.keys(dataObj).length === 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Task Statistics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tasks by Status */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Tasks by Status</h2>
                    {isEmptyData(byStatus) ? (
                        <p>No data available</p>
                    ) : (
                        <Pie data={toChartData(byStatus, 'Tasks')} />
                    )}
                </div>

                {/* Tasks by Priority */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Tasks by Priority</h2>
                    {isEmptyData(byPriority) ? (
                        <p>No data available</p>
                    ) : (
                        <Bar
                            data={toChartData(byPriority, 'Tasks')}
                            options={{ responsive: true }}
                        />
                    )}
                </div>

                {/* Tasks by Day */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Tasks Created per Day</h2>
                    {isEmptyData(byDay) ? (
                        <p>No data available</p>
                    ) : (
                        <Line
                            data={toChartData(byDay, 'Count', 'date')}
                            options={{ responsive: true }}
                        />
                    )}
                </div>

                {/* Tasks by Week */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Tasks Created per Week</h2>
                    {isEmptyData(byWeek) ? (
                        <p>No data available</p>
                    ) : (
                        <Line
                            data={toChartData(byWeek, 'Count', 'number')}
                            options={{ responsive: true }}
                        />
                    )}
                </div>
                {/* Completed Before vs After Deadline */}
                <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">Completed Before vs After Deadline</h2>
                    {isEmptyData(beforeAfter) ? (
                        <p>No data available</p>
                    ) : (
                        <div style={{ height: '500px' }}>
                            <Bar data={toChartData(beforeAfter, 'Tasks')} options={{ responsive: true }} />
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}
