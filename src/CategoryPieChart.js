import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function CategoryPieChart({ expenses }) {
  // Aggregate expense amounts by category
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8BC34A',
          '#FF9800',
          '#9C27B0',
        ],
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '600px', margin: '10px 0' }}>
      <h3>Spending by Category</h3>
      <Pie data={data} />
    </div>
  );
}

export default CategoryPieChart;
