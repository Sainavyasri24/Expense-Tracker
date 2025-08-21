import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

function MonthlyTotalsBarChart({ monthlyTotals }) {
  const months = Object.keys(monthlyTotals).sort();
  const totals = months.map(m => monthlyTotals[m]);

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Total ($)',
        data: totals,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Spending Totals'
      }
    },
    scales: {
      x: {
        ticks: { font: { size: 14 } }
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 14 } },
        title: { display: true, text: 'Amount ($)' }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: '100%', height: '400px', marginTop: '16px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default MonthlyTotalsBarChart;


