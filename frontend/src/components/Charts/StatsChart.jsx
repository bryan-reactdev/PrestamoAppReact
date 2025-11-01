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
  onDateClick = null, // Callback function for date clicks
  saldo = 0
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
              // Parse date string directly without timezone conversion
              const dateStr = clickedData.date;
              if (dateStr) {
                // Parse YYYY-MM-DD format in UTC
                const [year, month, day] = dateStr.split('T')[0].split('-');
                const dateObj = new Date(Date.UTC(year, month - 1, day));
                
                // Format manually to avoid timezone conversion
                const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                
                const weekday = weekdays[dateObj.getUTCDay()];
                const monthName = months[dateObj.getUTCMonth()];
                const dayNum = dateObj.getUTCDate();
                const yearNum = dateObj.getUTCFullYear();
                
                return `${weekday}, ${dayNum} de ${monthName} de ${yearNum}`;
              }
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
            // date check logic
            let showSaldo = false;
            let balanceToShow = null;
            if (clickedData.date) {
              const todayStr = new Date().toISOString().slice(0,10);
              if (clickedData.date >= todayStr) {
                showSaldo = true;
                balanceToShow = saldo;
              } else {
                // For past dates, use historialBalance if available (not null, undefined, or 0)
                balanceToShow = (clickedData.historialBalance !== null && 
                                clickedData.historialBalance !== undefined && 
                                clickedData.historialBalance !== 0)
                  ? clickedData.historialBalance 
                  : null;
              }
            }
            
            const balanceDisplay = balanceToShow !== null ? `$${balanceToShow.toLocaleString()}` : 'N/A';
            
            if (isIngresos) {
              return [
                `  • Ingresos Capitales: $${(clickedData.ingresosCapitales || 0).toLocaleString()}`,
                `  • Ingresos Varios: $${(clickedData.ingresosVarios || 0).toLocaleString()}`,
                `  • Abonos a Cuotas: $${(clickedData.cuotasAbonos || 0).toLocaleString()}`,
                `  • Cuotas Pagadas: $${(clickedData.cuotasPagadas || 0).toLocaleString()}`,
                `  • Balance: ${balanceDisplay}`
              ];
            } else {
              return [
                `  • Gastos Empresa: $${(clickedData.gastosEmpresa || 0).toLocaleString()}`,
                `  • Egresos Varios: $${(clickedData.egresosVarios || 0).toLocaleString()}`,
                `  • Retiros Cuotas: $${(clickedData.egresosCuotasRetiros || 0).toLocaleString()}`,
                `  • Créditos Desembolsados: $${(clickedData.creditosDesembolsados || 0).toLocaleString()}`,
                `  • Balance: ${balanceDisplay}`
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
  }), [minValue, maxValue, data, onDateClick, saldo]);

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
