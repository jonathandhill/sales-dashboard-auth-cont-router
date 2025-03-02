import { useEffect, useState } from 'react';
import { Chart } from 'react-charts';
import supabase from './supabase-client';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  // const fetchMetrics = async () => {
  //   const { data, error } = await supabase.from('ProjectMetrics').select('*');
  //   if (error) console.error('Error fetching metrics:', error);
  //   else setMetrics(data);
  // };

  async function fetchMetrics() {
    const { data, error } = await supabase
      .from('ProjectMetrics')
      .select('name, value.sum()');
    if (error) {
      console.error('Error fetching metrics:', error);
    } else {
      console.log(data);
      setMetrics(data);
    }
  }

  // Map Supabase data to chart format (assumes each record has name and sum)
  const chartData = [
    {
      data: metrics.map((m) => ({
        primary: m.name,
        secondary: m.sum,
        // primary: new Date(m.created_at),
        // secondary: m.value,
      })),
    },
  ];

  // The axes configuration is required by react-charts
  // primary:  an object because there is only one primary axis in a chart. It defines the main axis (usually the x-axis in a bar chart)
  // secondary: This is an array because a chart can have multiple secondary axes (usually the y-axes). Each object in the array represents a secondary axis

  // const primaryAxis = { getValue: (d) => d.primary, scaleType: 'time' };
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
        <h2>Total Sales This Quarter</h2>
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
  );
}

export default Dashboard;
