import { Chart } from 'react-charts';
import supabase from './supabase-client';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [newDeal, setNewDeal] = useState({name: 'Sandra'});

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
            
            const existingMetric = currentMetrics.find(metric => metric.name === name);

            if (existingMetric) {
              return currentMetrics.map(metric => 
                metric.name === name 
                  ? { ...metric, sum: metric.sum + value }
                  : metric
              );
            } else {
              return [...currentMetrics, { 
                name: name, 
                sum: value 
              }];
            }
          });
        })
      .subscribe();

     // This returned function is the "cleanup" function
     return () => {
      // Cleanup code runs when the component unmounts
      supabase.removeChannel(channel);
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

  async function addDeal() {
    const { error } = await supabase
      .from('ProjectMetrics')
      .insert(newDeal);
    if (error) {
      console.log("Error adding deal: ", error);
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewDeal(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(newDeal);
    addDeal();
    // setNewDeal({name: 'Sandra'});
  }



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
          <form onSubmit={handleSubmit}>
            <label>Name:
              <select value={newDeal.name} onChange={handleChange} name="name">
                <option value="Sandra">Sandra</option>
                <option value="Mark">Mark</option>
                <option value="Gary">Gary</option>
              </select>
            </label>
            <label>Amount: $
              <input 
                type="text" 
                name="value"
                value={newDeal.value || ""}
                onChange={handleChange}
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
