import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Palette de couleurs simple
const getColors = (count) => {
    const palette = [
        '#4dc9f6', '#f67019', '#f53794',
        '#537bc4', '#acc236', '#166a8f',
        '#00a950', '#58595b', '#8549ba',
    ];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

export default function StatsDashboard() {
    const { t } = useTranslation();

    // Données globales
    const [byStatus, setByStatus] = useState({});
    const [byPriority, setByPriority] = useState({});
    const [byDay, setByDay] = useState({});
    const [byWeek, setByWeek] = useState({});
    const [byMonth, setByMonth] = useState({});
    const [beforeAfter, setBeforeAfter] = useState({});

    // Choix de la période pour le graphique temps
    const [timePeriod, setTimePeriod] = useState('day'); // day | week | month

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    statusRes,
                    priorityRes,
                    dayRes,
                    weekRes,
                    monthRes,
                    beforeAfterRes,
                ] = await Promise.all([
                    axios.get('/stats/tasks-by-status'),
                    axios.get('/stats/tasks-by-priority'),
                    axios.get('/stats/tasks-by-day'),
                    axios.get('/stats/tasks-by-week'),
                    axios.get('/stats/tasks-by-month'),  // <- A ajouter côté backend si pas encore
                    axios.get('/stats/completed-before-after-deadline'),
                ]);
                setByStatus(statusRes.data);
                setByPriority(priorityRes.data);
                setByDay(dayRes.data);
                setByWeek(weekRes.data);
                setByMonth(monthRes.data);
                setBeforeAfter(beforeAfterRes.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    // Mappage des clés API -> labels traduits
    const LabelMap = {
        IN_PROGRESS: t('in_progress'),
        TODO: t('todo'),
        CLOSED: t('closed'),
        COMPLETED: t('completed'),
        HIGH: t('high'),
        MEDIUM: t('medium'),
        LOW: t('low'),
        BeforeDeadline: t('before'),
        AfterDeadline: t('after'),
    };

    // Helper: transformer un objet { clé: valeur } en données chart.js
    const toChartData = (dataObj, label = '') => {
        const labels = Object.keys(dataObj).map(k => LabelMap[k] || k);
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
                    barThickness: 20,
                    categoryPercentage: 0.6,
                    barPercentage: 0.9,
                },
            ],
        };
    };

    // Pour les stats par temps, on doit convertir les clefs (ex: dates) en labels lisibles
    const toTimeChartData = (dataObj, label = '') => {
        // dataObj peut avoir des clefs comme "2023-05-20" (jour), ou "20" (semaine), ou "2023-05" (mois)
        // On trie par clé pour avoir une timeline ordonnée
        const sortedKeys = Object.keys(dataObj).sort();

        return {
            labels: sortedKeys,
            datasets: [
                {
                    label,
                    data: sortedKeys.map(k => dataObj[k]),
                    backgroundColor: '#537bc4',
                    borderColor: '#537bc4',
                    borderWidth: 1,
                    borderRadius: 4,
                    barThickness: 20,
                },
            ],
        };
    };

    // Options communes pour le bar chart
    const barOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 },
                grid: { drawBorder: false },
            },
            x: {
                grid: { display: false },
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    // Sélectionne les bonnes données temporelles selon la période choisie
    const getTimeData = () => {
        if (timePeriod === 'day') return toTimeChartData(byDay, t('tasks'));
        if (timePeriod === 'week') return toTimeChartData(byWeek, t('tasks'));
        if (timePeriod === 'month') return toTimeChartData(byMonth, t('tasks'));
        return { labels: [], datasets: [] };
    };

    // Vérifie si data vide
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{t('task_stats')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Statut des tâches */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('task_status')}</h2>
                    {isEmpty(byStatus) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Bar data={toChartData(byStatus, t('tasks'))} options={barOptions} />
                    )}
                </div>

                {/* Priorité */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('task_priority')}</h2>
                    {isEmpty(byPriority) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Bar data={toChartData(byPriority, t('tasks'))} options={barOptions} />
                    )}
                </div>

                {/* Avant / Après deadline */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">{t('beforeAfter')}</h2>
                    {isEmpty(beforeAfter) ? (
                        <p>{t('noData')}</p>
                    ) : (
                        <Bar data={toChartData(beforeAfter, t('tasks'))} options={barOptions} />
                    )}
                </div>
            </div>

            {/* Section temporelle avec dropdown pour changer la période */}
            <div className="bg-white shadow rounded-lg p-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">{t('task_stats_over_time')}</h2>

                <div className="mb-4">
                    <label htmlFor="timePeriod" className="mr-4 font-medium">{t('select_period')}:</label>
                    <select
                        id="timePeriod"
                        value={timePeriod}
                        onChange={e => setTimePeriod(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="day">{t('day')}</option>
                        <option value="week">{t('week')}</option>
                        <option value="month">{t('month')}</option>
                    </select>
                </div>

                {isEmpty(byDay) && isEmpty(byWeek) && isEmpty(byMonth) ? (
                    <p>{t('noData')}</p>
                ) : (
                    <Bar data={getTimeData()} options={barOptions} />
                )}
            </div>
        </div>
    );
}
