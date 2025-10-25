import React from 'react';

export default function ChartSummary({ data }) {
  const totalIngresos = data.reduce((sum, day) => sum + day.totalIngresos, 0);
  const totalEgresos = data.reduce((sum, day) => sum + day.totalEgresos, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  return (
    <div className="chart-summary">
      <div className="summary-item">
        <h4>Total Ingresos</h4>
        <span className="color-success">
          ${totalIngresos.toLocaleString()}
        </span>
      </div>
      <div className="summary-item">
        <h4>Total Egresos</h4>
        <span className="color-danger">
          ${totalEgresos.toLocaleString()}
        </span>
      </div>
      <div className="summary-item">
        <h4>Balance Neto</h4>
        <span className={`color-${balanceNeto >= 0 ? 'success' : 'danger'}`}>
          ${balanceNeto.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
