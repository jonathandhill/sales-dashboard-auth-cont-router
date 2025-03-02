import { Chart } from 'react-charts';
import supabase from './supabase-client';

function Dashboard() {
    
  async function fetchMetrics() {
    const { data } = await supabase
      .from('ProjectMetrics')
      .select(
        `
        name, 
        value.sum()
        `,
      )
  };
//CHALLENGE
// 1. Write fetchMetrics function and destructure response from Supabase query
// 2. Add useEffect hook with empty dependency array to tell React to run this on initial render
// 3. Add state to hold the data and pass Supabase data to setter function to finish fetchMetrics
// 4. Map around state variable & set values of data key of the object in the chartData array
// Tip: console.log the data to help decide primary/secondary values

    // Map Supabase data to chart format (assumes each record has created_at and value)
  const chartData = [
    {
      data: /* add state variable */.map((m) => ({
        primary: /* add main x-axis value */,
        secondary: /* add y-axis value */,
      })),
    },
  ];

  // The axes configuration is required by react-charts
  const primaryAxis = { getValue: (d) => d.primary, scaleType: 'band' };
  const secondaryAxes = [{ 
    getValue: (d) => d.secondary, 
    scaleType: 'linear', 
    min: 0, 
    max: 10000
   }];


  return (
    <div>
      <h1>Sales Team Dashboard</h1>
      <div className="chart-container">
        <h2>Total Sales This Quarter</h2>
        <Chart options={{ data: chartData, primaryAxis, secondaryAxes, type: 'bar',
          defaultColors: ['#36A2EB']
         }} />
      </div>
    </div>
  );
}

export default Dashboard;
