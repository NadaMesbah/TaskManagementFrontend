import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  
      const maxIndex = data.indexOf(Math.max(...data));
      const label = labels[maxIndex];
      const value = data[maxIndex];
  
      const text = `${label}: ${value}`;
      
      ctx.save();
      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    },
  };
  

ChartJS.register(centerTextPlugin);

export default function StatsDashboard() {
    const { t } = useTranslation();

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

    const toChartData = (dataObj, label = '') => {
        const labels = Object.keys(dataObj).map(key => LabelMap[key] || key);
        const values = Object.values(dataObj);
        const colors = [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(205, 98, 181, 0.5)',
            'rgba(255, 206, 86, 0.5)',
        ];
        const borderColors = colors.map(c => c.replace('0.5', '1'));

        return {
            labels,
            datasets: [
                {
                    label,
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: borderColors.slice(0, labels.length),
                    borderWidth: 1,
                },
            ],
        };
    };

    const isEmptyData = (dataObj) => !dataObj || Object.keys(dataObj).length === 0;

    const doughnutOptions = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { position: 'bottom' },
        },
    };
    const LabelMap = {
        IN_PROGRESS: t('in_progress'),
        TODO: t('todo'),
        CLOSED: t('closed'),
        COMPLETED: t('completed'),
        HIGH: t('high'),
        MEDIUM: t('medium'),
        LOW: t('low')
    };
      
    const barOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
        plugins: {
            legend: { position: 'top' },
        },
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

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
                        <Doughnut data={toChartData(byStatus, 'Tasks')} 
                        options={{ plugins: { legend: { position: 'bottom' } } }}
                        plugins={[centerTextPlugin]} />
                        
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
                        <Line data={toChartData(byDay, 'Count')} options={lineOptions} />
                    )}
                </div>

                {/* Tasks by Week - Line */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('week')}</h2>
                    {isEmptyData(byWeek) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Line data={toChartData(byWeek, 'Count')} options={lineOptions} />
                    )}
                </div>

                {/* Completed Before vs After Deadline - Doughnut */}
                <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-2">{t('beforeAfter')}</h2>
                    {isEmptyData(beforeAfter) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="w-1/2">
                                <Doughnut data={toChartData(beforeAfter, 'Tasks')} options={doughnutOptions} />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
