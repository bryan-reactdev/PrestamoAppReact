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

export default function StatsChart({ 
  data, 
  minValue = 0, 
  maxValue = 10000,
  type = 'week', // 'week' or 'month'
  className = 'stats-chart',
  onDateClick = null // Callback function for date clicks
}) {
  // Transform data for Chart.js
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    
    return {
      labels: data.map(day => type === 'week' ? day.dayName : day.dayNumber),
      datasets: [
        {
          label: 'Ingresos',
          data: data.map(day => day.totalIngresos || 0),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#16a34a',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3
        },
        {
          label: 'Egresos',
          data: data.map(day => day.totalEgresos || 0),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#dc2626',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3
        }
      ]
    };
  }, [data, type]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0 && onDateClick) {
        const element = elements[0];
        const dataIndex = element.index;
        const clickedData = data[dataIndex];
        if (clickedData) {
          onDateClick(clickedData.date, element.datasetIndex === 0 ? 'ingresos' : 'egresos');
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14,
            weight: '500'
          }
        },
        onClick: function(e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          
          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
          } else {
            ci.show(index);
            legendItem.hidden = false;
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12,
          weight: 'normal'
        },
        labelFont: {
          size: 12,
          weight: 'bold'
        },
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const clickedData = data[dataIndex];
            if (clickedData) {
              const date = new Date(clickedData.date);
              return date.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
            }
            return context[0].label;
          },
          label: function(context) {
            const dataIndex = context.dataIndex;
            const clickedData = data[dataIndex];
            
            if (!clickedData) return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            
            // Return just the main total line
            return `${context.dataset.label} Totales: $${context.parsed.y.toLocaleString()}`;
          },
          afterLabel: function(context) {
            const dataIndex = context.dataIndex;
            const clickedData = data[dataIndex];
            const isIngresos = context.dataset.label === 'Ingresos';
            
            if (!clickedData) return '';
            
            // Return the breakdown details
            if (isIngresos) {
              return [
                `  • Ingresos Capitales: $${(clickedData.ingresosCapitales || 0).toLocaleString()}`,
                `  • Ingresos Varios: $${(clickedData.ingresosVarios || 0).toLocaleString()}`,
                `  • Abonos a Cuotas: $${(clickedData.cuotasAbonos || 0).toLocaleString()}`,
                `  • Cuotas Pagadas: $${(clickedData.cuotasPagadas || 0).toLocaleString()}`
              ];
            } else {
              return [
                `  • Gastos Empresa: $${(clickedData.gastosEmpresa || 0).toLocaleString()}`,
                `  • Egresos Varios: $${(clickedData.egresosVarios || 0).toLocaleString()}`,
                `  • Retiros Cuotas: $${(clickedData.egresosCuotasRetiros || 0).toLocaleString()}`,
                `  • Créditos Desembolsados: $${(clickedData.creditosDesembolsados || 0).toLocaleString()}`
              ];
            }
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
  }), [minValue, maxValue, data, onDateClick]);

  // Don't render chart if no data
  if (!data || data.length === 0 || !chartData) {
    return (
      <div className={className}>
        <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty">
            <h3>No hay datos disponibles</h3>
            <p>Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
