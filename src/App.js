import React, { useState, useEffect } from 'react';
import CategoryPieChart from './CategoryPieChart';
import SpendingOverTimeChart from './SpendingOverTimeChart';

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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <label style={{ fontSize: '1.2rem', marginRight: 8 }}>Amount</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />{' '}
      <label style={{ fontSize: '1.2rem', marginRight: 8 }}>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>{' '}
      <label style={{ fontSize: '1.2rem', marginRight: 8 }}>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />{' '}
      <label style={{ fontSize: '1.2rem', marginRight: 8 }}>Note</label>
      <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Note" />{' '}
      <button type="submit" style={{ fontSize: '1.2rem' }}>Add Expense</button>
    </form>
  );
}

function ExpenseList({ expenses }) {
  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', fontSize: '1.2rem' }}>
      <thead>
        <tr style={{ fontSize: '1.3rem' }}><th>Date</th><th>Category</th><th>Amount</th><th>Note</th></tr>
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
  // Calculate total spent this month
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyTotal = expenses.reduce((total, exp) => {
    return exp.date.slice(0, 7) === currentMonth ? total + exp.amount : total;
  }, 0);

  const percentUsed = Math.min((monthlyTotal / budget) * 100, 100);

  return (
    <div style={{ margin: '20px 0' }}>
      <h3 style={{ fontSize: '2rem' }}>Budget Summary</h3>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Budget: ${budget.toFixed(2)} | Spent this month: ${monthlyTotal.toFixed(2)}</p>
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

  return (
    <div className="container">
      <h2>Expense Tracker</h2>
      <input
        type="number"
        value={budget}
        onChange={e => setBudget(parseFloat(e.target.value) || 0)}
        placeholder="Set monthly budget"
        style={{ marginBottom: '20px' }}
      />
      <BudgetSummary expenses={filteredExpenses} budget={budget} />
      <AddExpense onAdd={handleAddExpense} />
      <div style={{ marginBottom: '20px' }}>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterStartDate}
          onChange={e => setFilterStartDate(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={e => setFilterEndDate(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <CategoryPieChart expenses={filteredExpenses} />
      <SpendingOverTimeChart expenses={filteredExpenses} />
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
}
