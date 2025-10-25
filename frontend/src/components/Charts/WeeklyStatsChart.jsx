import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function WeeklyStatsChart({ 
  data, 
  minValue = 0, 
  maxValue = 10000,
  onRangeChange 
}) {
  // Transform data for Chart.js
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    
    return {
      labels: data.map(day => day.dayName),
      datasets: [
        {
          label: 'Ingresos',
          data: data.map(day => day.totalIngresos || 0),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1
        },
        {
          label: 'Egresos',
          data: data.map(day => day.totalEgresos || 0),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1
        }
      ]
    };
  }, [data]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: minValue,
        max: maxValue
      }
    }
  }), [minValue, maxValue]);

  // Don't render chart if no data
  if (!data || data.length === 0 || !chartData) {
    return (
      <div className="weekly-stats-chart">
        <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty">
            <h3>No hay datos disponibles</h3>
            <p>Cargando datos de la semana...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-stats-chart">
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}