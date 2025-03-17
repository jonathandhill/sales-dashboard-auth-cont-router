import { Chart } from 'react-charts';
import supabase from './supabase-client';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [newDeal, setNewDeal] = useState({ name: 'Jim' });

  useEffect(() => {
    fetchMetrics();

    const channel = supabase
      .channel('deal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_deals',
        },
        (payload) => {
          console.log(payload);
          const { new: newRecord } = payload;
          const { name, value } = newRecord;

          fetchMetrics(); // Fetch the latest metrics after an insert event
        }
      )
      .subscribe();

    // This returned function is the "cleanup" function
    return () => {
      // Cleanup code runs when the component unmounts
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMetrics() {
    try {
      const { data, error } = await supabase.from('sales_deals').select(
        `
          name,
          value.sum()
          `
      );
      if (error) {
        throw error;
      }
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }

  async function addDeal() {
    try {
      const { error } = await supabase.from('sales_deals').insert(newDeal);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding deal: ', error);
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewDeal((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newDeal);
    addDeal();
    setNewDeal({ name: 'Jim', value: '' });
  };

  const chartData = [
    {
      data: metrics.map((m) => ({
        primary: m.name,
        secondary: m.sum,
      })),
    },
  ];

  const primaryAxis = {
    getValue: (d) => d.primary,
    scaleType: 'band',
    padding: 0.2,
    position: 'bottom',
  };

  function y_max() {
    if (metrics.length > 0) {
      const maxSum = Math.max(...metrics.map((m) => m.sum));
      return maxSum + 2000;
    }
    return 5000; // Default value if metrics is empty
  }

  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: 'linear',
      min: 0,
      max: y_max(),
      padding: {
        top: 20,
        bottom: 40,
      },
    },
  ];

  const generateOptions = () => {
    return metrics.map((metric) => (
      <option key={metric.name} value={metric.name}>
        {metric.name}
      </option>
    ));
  };

  return (
    <div>
      <h1>Sales Team Dashboard</h1>
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              type: 'bar',
              defaultColors: ['#75d0c3'],
              tooltip: {
                show: false,
              },
            }}
          />
        </div>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <select value={newDeal.name} onChange={handleChange} name="name">
              {generateOptions()}
            </select>
          </label>
          <label>
            Amount: $
            <input
              type="text"
              name="value"
              value={newDeal.value || ''}
              onChange={handleChange}
              className="amount-input"
            />
          </label>
          <button>Add Deal</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
