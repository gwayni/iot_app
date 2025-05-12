import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Chart from 'chart.js/auto';
import axios from 'axios';
import '../App.css';

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { logout, user } = useAuth();
  const [data, setData] = useState(null);

  // Fetch the latest electricity data
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/data');  // Adjust your API URL
      setData(response.data[0]);  // Assuming we get the latest record
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data) return;
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM'], // Example x-axis labels
        datasets: [{
          label: 'Electricity Usage (kW)',
          data: [data.power, data.power + 0.2, data.power + 0.4, data.power + 0.6, data.power + 0.8], // Example dynamic data
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
      chartInstanceRef.current?.destroy();
    };
  }, [data]);

  return (
    <div className="dashboard">
      <header>
        <h1>USTP Electricity Dashboard</h1>
        <p>Welcome, {user.username}</p>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="cards">
        <div className="card"><h2>Voltage</h2><p>{data?.voltage} V</p></div>
        <div className="card"><h2>Current</h2><p>{data?.current} A</p></div>
        <div className="card"><h2>Power</h2><p>{data?.power} kW</p></div>
        <div className="card"><h2>Energy</h2><p>{data?.energy} kWh</p></div>
      </section>

      <section className="chart-section">
        <canvas ref={chartRef} width="800" height="400"></canvas>
      </section>
    </div>
  );
};

export default Dashboard;