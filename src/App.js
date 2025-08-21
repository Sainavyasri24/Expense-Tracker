import React, { useState, useEffect } from 'react';
import CategoryPieChart from './CategoryPieChart';
import SpendingOverTimeChart from './SpendingOverTimeChart';
import './App.css';

const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other'];

function AddExpense({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({ amount: parseFloat(amount), category, date, note });
    setAmount(''); setCategory(''); setDate(''); setNote('');
  }

  const inputStyle = {
    fontSize: '1.5rem',
    padding: '10px',
    margin: '8px',
    borderRadius: '6px'
  };

  const buttonStyle = {
    fontSize: '1.5rem',
    padding: '10px 20px',
    margin: '8px',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  return (
    <form onSubmit={handleSubmit} className="add-expense-form" style={{ marginBottom: 20 }}>
      <label style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Amount</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required style={inputStyle} />{' '}
      
      <label style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)} required style={inputStyle}>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>{' '}
      
      <label style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />{' '}
      
      <label style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Note</label>
      <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Note" style={inputStyle} />{' '}
      
      <button type="submit" style={buttonStyle}>Add Expense</button>
    </form>
  );
}

function ExpenseList({ expenses }) {
  return (
    <table border="1" cellPadding="12" style={{ borderCollapse: 'collapse', width: '100%', fontSize: '1.5rem' }}>
      <thead>
        <tr style={{ fontSize: '2rem' }}>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td>{exp.date}</td>
            <td>{exp.category}</td>
            <td>{exp.amount}</td>
            <td>{exp.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BudgetSummary({ expenses, budget }) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyTotal = expenses.reduce((total, exp) => {
    return exp.date.slice(0, 7) === currentMonth ? total + exp.amount : total;
  }, 0);

  const percentUsed = Math.min((monthlyTotal / budget) * 100, 100);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3 style={{ fontSize: '2rem' }}>Budget Summary</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Budget: ${budget.toFixed(2)} | Spent this month: ${monthlyTotal.toFixed(2)}
      </p>
      <div style={{ backgroundColor: '#ccc', width: '100%', height: '20px', borderRadius: '10px' }}>
        <div 
          style={{ 
            width: `${percentUsed}%`, 
            height: '100%', 
            backgroundColor: percentUsed > 90 ? 'red' : 'green', 
            borderRadius: '10px',
            transition: 'width 0.5s ease'
          }}
        />
      </div>
      {percentUsed > 90 && <small style={{color:'red', fontSize: '1.1rem'}}>Warning: Approaching budget limit!</small>}
    </div>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, amount: 200, category: 'Food', date: '2025-08-19', note: 'Lunch' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [budget, setBudget] = useState(1000);
  const [page, setPage] = useState(1); // 1: Summary & Add form, 2: Filters, Charts & Table

  function handleAddExpense(expense) {
    setExpenses(prev => [
      { ...expense, id: prev.length ? prev[0].id + 1 : 1 },
      ...prev
    ]);
  }

  const filteredExpenses = expenses.filter(expense => {
    return (!filterCategory || expense.category === filterCategory) &&
           (!filterStartDate || expense.date >= filterStartDate) &&
           (!filterEndDate || expense.date <= filterEndDate);
  });

  const inputStyle = {
    fontSize: '1.5rem',
    padding: '10px',
    margin: '8px',
    borderRadius: '6px'
  };

  return (
    <div className="container">
      {page === 1 && (
        <>
          <h2 style={{ fontSize: '2.2rem' }}>Expense Tracker</h2>
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(parseFloat(e.target.value) || 0)}
            placeholder="Set monthly budget"
            style={inputStyle}
          />
          <BudgetSummary expenses={filteredExpenses} budget={budget} />
          <AddExpense onAdd={handleAddExpense} />
        </>
      )}

      {page === 2 && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={inputStyle}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <label style={{ marginLeft: '8px', fontWeight: 'bold' }}>dd-mm-yyyy</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              style={inputStyle}
            />
            <label style={{ marginLeft: '8px', fontWeight: 'bold' }}>dd-mm-yyyy</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="charts-row">
            <div className="chart-item">
              <CategoryPieChart expenses={filteredExpenses} />
            </div>
            <div className="chart-item">
              <SpendingOverTimeChart expenses={filteredExpenses} />
            </div>
          </div>
          <ExpenseList expenses={filteredExpenses} />
        </>
      )}

<div 
  style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: '20px 0', 
    gap: '10px' 
  }}
>
  <button 
    onClick={() => setPage(p => Math.max(1, p - 1))} 
    disabled={page === 1}
    style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '6px' }}
  >
    Previous
  </button>
  <button 
    onClick={() => setPage(p => Math.min(2, p + 1))} 
    disabled={page === 2}
    style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '6px' }}
  >
    Next
  </button>
</div>
    </div>
  );
}
