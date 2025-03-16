import { Chart } from 'react-charts';
import supabase from './supabase-client';
import { useEffect, useState } from 'react';
import Form from './Form';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  // const [newDeal, setNewDeal] = useState({name: 'Sandra'});

  useEffect(() => {
    fetchMetrics()

    const channel = supabase
      .channel('metric-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'ProjectMetrics' 
        },
        payload => {
          console.log(payload);

          // To use new/old record from payload
          // const { new: newRecord } = payload;
          // const { name, value } = newRecord;

          fetchMetrics(); // Fetch the latest metrics after an insert event

        })
      .subscribe();

     // This returned function is the "cleanup" function
     return () => {
      // Cleanup code runs when the component unmounts
      supabase.removeChannel(channel);
    };
  }, []);

  // const notifyDeal = (name, value) => toast(`${name} has added a new $${value} deal`);
  

  async function fetchMetrics() {
    try {
      const { data, error } = await supabase.from('ProjectMetrics').select(
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

  // async function addDeal() {
  //   const { error } = await supabase
  //     .from('ProjectMetrics')
  //     .insert(newDeal);
  //   if (error) {
  //     console.log("Error adding deal: ", error);
  //   }
  // }

  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setNewDeal(values => ({...values, [name]: value}))
  // }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(newDeal);
  //   addDeal();
  //   setNewDeal({ name: 'Sandra', value: '' });
  // }



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

  function y_max() {
    if (metrics.length > 0) {
      const maxSum = Math.max(...metrics.map(m => m.sum));
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
        bottom: 40
      }
    },
  ];

  // const generateOptions = () => {
  //   return metrics.map((metric) => (
  //     <option key={metric.name} value={metric.name}>
  //       {metric.name}
  //     </option>
  //   ));
  // };

  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              type: 'bar',
              defaultColors: ['#ADDF33'],
              tooltip: {
                show: false,
              }
            }}
          />
        </div>
      </div>
      <Form metrics={metrics} />
      {/* <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Name:
              <select value={newDeal.name} onChange={handleChange} name="name">
                {generateOptions()}
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
      </div>*/}
    </div> 
  );
}

export default Dashboard;


 // setMetrics(currentMetrics => {
            
          //   const existingMetric = currentMetrics.find(metric => metric.name === name);

          //   if (existingMetric) {
          //     return currentMetrics.map(metric => 
          //       metric.name === name 
          //         ? { ...metric, sum: metric.sum + value }
          //         : metric
          //     );
          //   } else {
          //     return [...currentMetrics, { 
          //       name: name, 
          //       sum: value 
          //     }];
          //   }
          // });

          // const notifyDeal = (name, value) => toast(`${name} has added a new $${value} deal`);

          // <option value="Jim">Jim</option>
          //       <option value="Andy">Andy</option>
          //       <option value="Dwight">Dwight</option>