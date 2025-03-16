import { Chart } from 'react-charts';
import supabase from './supabase-client';
import { useEffect, useState } from 'react';


function Dashboard() {
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    fetchMetrics()
  }, []);

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
      console.log(data);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
    
  }




  // const chartData = [
  //   {
  //     data: [],
  //   },
  // ];

 
  // const primaryAxis = { 
  //   getValue: (d) => d.primary, 
  //   scaleType: 'band',
  //   padding: 0.2,
  //   position: 'bottom'
  // };

  // function y_max() {
  //   if (metrics.length > 0) {
  //     const maxSum = Math.max(...metrics.map(m => m.sum));
  //     return maxSum + 2000;
  //   }
  //   return 5000; // Default value if metrics is empty
  // }
  
  // const secondaryAxes = [
  //   {
  //     getValue: (d) => d.secondary,
  //     scaleType: 'linear',
  //     min: 0,
  //     max: y_max(),
  //     padding: {
  //       top: 20,
  //       bottom: 40
  //     }
  //   },
  // ];



  return (
    <div className="dashboard-wrapper">
      <div className="chart-container">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          {/* <Chart
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
          /> */}
        </div>
      </div>
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