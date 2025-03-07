import { Chart } from 'react-charts';
import supabase from './supabase-client';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    fetchMetrics()
  }, []);
  

  async function fetchMetrics() {
    const { data, error } = await supabase
      .from('ProjectMetrics')
      .select(
        `
        name,
        value.sum()
        `,
      )
    setMetrics(data);
  }

 



  const chartData = [
    {
      data: metrics.map((m) => ({
        primary: m.name,
        secondary: m.sum,
      })),
    },
  ];

 
  const primaryAxis = { getValue: (d) => d.primary, scaleType: 'band' };
  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: 'linear',
      min: 0,
      max: 10000,
    },
  ];

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
              defaultColors: ['#36A2EB'],
            }}
          />
        </div>
      </div>
      <div className="form-container">
          <form>
            <label>Add deal:
              <select>
                <option value="Jim">Jim</option>
                <option value="Andy">Andy</option>
                <option value="Dwight">Dwight</option>
              </select>
            </label>
            <label>Amount: $
              <input 
                type="text" 
                name="username"
                className="amount-input" 
              />
            </label>
            <input type="submit"/>
          </form>
        </div>
    </div>
  );
}

export default Dashboard;
