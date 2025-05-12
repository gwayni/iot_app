import React, { useEffect, useRef } from 'react';
import './App.css';
import Chart from 'chart.js/auto';

function App() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // track the chart instance

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart and store reference
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM'],
        datasets: [{
          label: 'Electricity Usage (kW)',
          data: [1.2, 1.5, 1.7, 2.0, 2.5],
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          borderColor: '#ffd700',
          borderWidth: 2,
          pointBackgroundColor: '#1e3a8a',
          pointBorderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'white' } }
        },
        scales: {
          x: { ticks: { color: 'white' } },
          y: { ticks: { color: 'white' } }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="dashboard">
      <header>
        <h1>USTP Electricity Dashboard</h1>
      </header>

      <section className="cards">
        <div className="card"><h2>Voltage</h2><p>230 V</p></div>
        <div className="card"><h2>Current</h2><p>12 A</p></div>
        <div className="card"><h2>Power</h2><p>2.76 kW</p></div>
        <div className="card"><h2>Energy</h2><p>100.5 kWh</p></div>
      </section>

      <section className="chart-section">
        <canvas ref={chartRef} width="800" height="400"></canvas>
      </section>
    </div>
  );
}

export default App;
