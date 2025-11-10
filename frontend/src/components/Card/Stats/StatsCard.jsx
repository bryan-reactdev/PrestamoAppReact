import React from 'react';
import { formatCurrencySV } from '../../../utils/currencyUtils';

export default function StatsCard({ row, viewType = 'week' }) {
  const data = row.original;
  
  // Format period label based on view type
  const getPeriodLabel = () => {
    if (viewType === 'week') {
      return data.dayName || data.date?.split('T')[0];
    } else if (viewType === 'month') {
      return `Día ${data.dayNumber || data.date?.split('T')[0]}`;
    } else {
      if (data.monthName) {
        return data.monthName.charAt(0).toUpperCase() + data.monthName.slice(1);
      }
      return `${data.monthNumber || ''}/${data.year || ''}`;
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const [y, m, d] = date.split('T')[0].split('-');
    return `${d}/${m}/${y.slice(-2)}`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{getPeriodLabel()}</h3>
        <p className="text-muted">{formatDate(data.date)}</p>
      </div>
      
      <div className="card-body">
        <div className="stat-row">
          <span className="stat-label">Ingresos Capitales:</span>
          <span className="color-success">
            ${formatCurrencySV(data.totalIngresosCapitales || 0)}
          </span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Ingresos:</span>
          <span className="color-success">
            ${formatCurrencySV(data.totalIngresos || 0)}
          </span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Egresos:</span>
          <span className="color-danger">
            ${formatCurrencySV(data.totalEgresos || 0)}
          </span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Balance Neto:</span>
          <span className={`color-${(data.balance || 0) >= 0 ? 'success' : 'danger'}`}>
            ${formatCurrencySV(data.balance || 0)}
          </span>
        </div>
        
        {data.historialBalance !== null && data.historialBalance !== undefined && data.historialBalance !== 0 && (
          <div className="stat-row">
            <span className="stat-label">Balance Final:</span>
            <span>${formatCurrencySV(data.historialBalance)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

