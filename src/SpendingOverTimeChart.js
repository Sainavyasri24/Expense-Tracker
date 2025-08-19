import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function SpendingOverTimeChart({ expenses }) {
  // Aggregate expenses by date (formatted as YYYY-MM-DD)
  const dailyTotals = expenses.reduce((totals, expense) => {
    totals[expense.date] = (totals[expense.date] || 0) + expense.amount;
    return totals;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(dailyTotals).sort();

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Daily Spending',
        data: sortedDates.map(date => dailyTotals[date]),
        fill: false,
        borderColor: 'rgb(75,192,192)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 20
          }
        }
      },
      title: {
        display: true,
        text: 'Spending Over Time',
        font: {
          size: 28
        }
      },
      tooltip: {
        bodyFont: {
          size: 18
        },
        titleFont: {
          size: 20
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 22
          }
        },
        ticks: {
          font: {
            size: 16
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
          font: {
            size: 22
          }
        },
        ticks: {
          font: {
            size: 16
          }
        },
        beginAtZero: true
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ maxWidth: '1000px', height: '600px', margin: '30px auto' }}>
      <Line options={options} data={data} width={800} height={600} />
    </div>
  );
}

export default SpendingOverTimeChart;
