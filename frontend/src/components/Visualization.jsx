import React from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Visualization = ({ data, type }) => {
    if (!data || Object.keys(data).length === 0) {
        return <div>No data available for visualization</div>;
    }

    const chartData = {
        labels: Object.keys(data).slice(0, 15), // Show top 15
        datasets: [
            {
                label: type === 'frequency' ? 'K-mer Frequency' : 'Count',
                data: Object.values(data).slice(0, 15),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: type === 'frequency' ? 'Top K-mer Frequencies' : 'Data Distribution',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequency'
                }
            },
            x: {
                title: {
                    display: true,
                    text: type === 'frequency' ? 'K-mers' : 'Categories'
                }
            }
        },
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <Bar data={chartData} options={options} />
            {Object.keys(data).length > 15 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem' }}>
                    Showing top 15 items out of {Object.keys(data).length} total
                </p>
            )}
        </div>
    );
};

export default Visualization;