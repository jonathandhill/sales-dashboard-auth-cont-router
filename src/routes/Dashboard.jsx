import { Chart } from 'react-charts';
import supabase from '../supabase-client';
import { useEffect, useState } from 'react';
import Form from '../components/Form';

function Dashboard() {
  const [metrics, setMetrics] = useState([]);

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
          // console.log(payload);
          const { new: newRecord } = payload;
          // const { name, value } = newRecord;

          fetchMetrics(); // Fetch the latest metrics after change
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
        value.sum(),
        ...user_profiles!inner(
          name
        )
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

  return (
    <div
      className="dashboard-wrapper"
      role="region"
      aria-label="Sales dashboard"
    >
      <div
        className="chart-container"
        role="region"
        aria-label="Sales chart and data"
      >
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              type: 'bar',
              defaultColors: ['#58d675'],
              tooltip: {
                show: false,
              },
            }}
          />
        </div>
      </div>
      <Form />
    </div>
  );
}

export default Dashboard;
