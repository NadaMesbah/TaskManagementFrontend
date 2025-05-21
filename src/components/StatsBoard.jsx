import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

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

const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        if (chart.config.type !== 'doughnut') return;

        const { ctx } = chart;
        const data = chart.data.datasets[0].data;
        const labels = chart.data.labels;

        if (!data.length) return;

        const entries = labels.map((label, i) => ({
            label,
            value: data[i],
        }));

        const centerX = chart.getDatasetMeta(0).data[0].x;
        const centerY = chart.getDatasetMeta(0).data[0].y;

        ctx.save();
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';

        const lineHeight = 18;
        const totalHeight = entries.length * lineHeight;
        const startY = centerY - totalHeight / 2 + lineHeight / 2;

        entries.forEach((entry, index) => {
            const text = `${entry.label}: ${entry.value}`;
            ctx.fillText(text, centerX, startY + index * lineHeight);
        });

        ctx.restore();
    },
};


ChartJS.register(centerTextPlugin);

// Helper: color palette
const getColors = (count) => {
    const palette = [
        '#4dc9f6', '#f67019', '#f53794',
        '#537bc4', '#acc236', '#166a8f',
        '#00a950', '#58595b', '#8549ba',
        '#e6e600', '#33cccc', '#ff6699'
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(palette[i % palette.length]);
    }
    return colors;
};

export default function StatsDashboard() {
    const { t } = useTranslation();

    const [byStatus, setByStatus] = useState({});
    const [byPriority, setByPriority] = useState({});
    const [byDay, setByDay] = useState({});
    const [byWeek, setByWeek] = useState({});
    const [beforeAfter, setBeforeAfter] = useState({});

    useEffect(() => {

        const expectedStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];
        
        const fillMissingStatuses = (dataObj) => {
            const filled = {};
            expectedStatuses.forEach(status => {
                filled[status] = dataObj[status] || 0;
            });
            return filled;
        };
        const fetchStats = async () => {
            try {
                const [statusRes, priorityRes, dayRes, weekRes, beforeAfterRes] = await Promise.all([
                    axios.get('/stats/tasks-by-status'),
                    axios.get('/stats/tasks-by-priority'),
                    axios.get('/stats/tasks-by-day'),
                    axios.get('/stats/tasks-by-week'),
                    axios.get('/stats/completed-before-after-deadline'),
                ]);
                setByStatus(fillMissingStatuses(statusRes.data));
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

    const LabelMap = {
        IN_PROGRESS: t('in_progress'),
        TODO: t('todo'),
        CLOSED: t('closed'),
        COMPLETED: t('completed'),
        HIGH: t('high'),
        MEDIUM: t('medium'),
        LOW: t('low'),
        BeforeDeadline: t('before'),
        AfterDeadline: t('after')
    };

    const isEmptyData = (dataObj) => !dataObj || Object.keys(dataObj).length === 0;

    const toChartData = (dataObj, label = '') => {
        const labels = Object.keys(dataObj).map(key => LabelMap[key] || key);
        const values = Object.values(dataObj);
        const colors = getColors(labels.length);

        return {
            labels,
            datasets: [
                {
                    label,
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                    borderRadius: 4,
                    barThickness: 12,
                    categoryPercentage: 0.6,
                    barPercentage: 0.9,
                    pointBackgroundColor: colors,
                    tension: 0.4,
                    fill: false,
                },
            ],
        };
    };

    const doughnutOptions = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { position: 'bottom' },
        },
    };

    const barOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                grid: {
                    drawBorder: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    // const lineOptions = {
    //     responsive: true,
    //     plugins: {
    //         legend: { display: false },
    //     },
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //             grid: {
    //                 drawBorder: false,
    //             },
    //         },
    //         x: {
    //             grid: {
    //                 display: false,
    //             },
    //         },
    //     },
    // };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{t('task_stats')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Tasks by Status - Doughnut */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('task_status')}</h2>
                    {isEmptyData(byStatus) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Doughnut
                            data={toChartData(byStatus, 'Tasks')}
                            options={doughnutOptions}
                            plugins={[centerTextPlugin]}
                        />
                    )}
                </div>

                {/* Tasks by Priority - Bar */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('task_priority')}</h2>
                    {isEmptyData(byPriority) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Bar data={toChartData(byPriority, 'Tasks')} options={barOptions} />
                    )}
                </div>

                {/* Tasks by Day - Line */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('day')}</h2>
                    {isEmptyData(byDay) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Bar data={toChartData(byDay, 'Tasks')} options={barOptions} />
                    )}
                </div>

                {/* Tasks by Week - Line */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('week')}</h2>
                    {isEmptyData(byWeek) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Bar data={toChartData(byWeek, 'Tasks')} options={barOptions} />)}
                </div>

                {/* Completed Before vs After Deadline - Doughnut */}
                <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">{t('beforeAfter')}</h2>
                    {isEmptyData(beforeAfter) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="w-1/2 h-96">
                                <Doughnut
                                    data={toChartData(beforeAfter, 'Tasks')}
                                    options={doughnutOptions}
                                    plugins={[centerTextPlugin]}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
