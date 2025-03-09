import { Chart } from 'react-charts';
import supabase from './supabase-client';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    fetchMetrics()

    const channel = supabase
      .channel('metric-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ProjectMetrics' 
        },
        payload => {
          console.log(payload);
          const { new: newRecord } = payload;

          setMetrics(currentMetrics => {
            const { name, value } = newRecord;
            
            const existingMetric = currentMetrics.find(m => m.name === name);

            if (existingMetric) {
              return currentMetrics.map(m => 
                m.name === name 
                  ? { ...m, sum: m.sum + value }
                  : m
              );
            } else {
              return [...currentMetrics, { 
                name: name, 
                sum: value 
              }];
            }


            // const existingName = currentMetrics.find(item => item.name === newRecord.name);
            // const { name, value } = newRecord;

            // if (existingName) {
            //   return currentMetrics.map(item =>
            //     item.name === name ? { ...item, value: item.value + value } : item
            //   );
            // } else {
            //   return [...currentMetrics, { name, value }];
            // }
          });
        })
      .subscribe();

    // Clean up subscription
    return () => {
      channel.unsubscribe();
    };
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
      if (error) {
        console.error('Error fetching metrics:', error);
      } else {
        setMetrics(data);
      }
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
    position: 'bottom'
  };
  
  const secondaryAxes = [
    {
      getValue: (d) => d.secondary,
      scaleType: 'linear',
      min: 0,
      max: 10000,
      padding: {
        top: 20,
        bottom: 40
      }
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
              defaultColors: ['#75d0c3'],
            }}
          />
        </div>
      </div>
      <div className="form-container">
          <form>
            <label>Name:
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
            <button type="submit">Add Deal</button>
          </form>
        </div>
    </div>
  );
}

export default Dashboard;
