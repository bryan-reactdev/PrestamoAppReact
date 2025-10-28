import React from 'react';

export default function ChartSummary({ data }) {
  // Calculate totals
  const totalIngresos = data.reduce((sum, day) => sum + day.totalIngresos, 0);
  const totalEgresos = data.reduce((sum, day) => sum + day.totalEgresos, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  // Calculate detailed breakdowns
  const ingresosCapitales = data.reduce((sum, day) => sum + (day.ingresosCapitales || 0), 0);
  const ingresosVarios = data.reduce((sum, day) => sum + (day.ingresosVarios || 0), 0);
  const cuotasAbonos = data.reduce((sum, day) => sum + (day.cuotasAbonos || 0), 0);
  const cuotasPagadas = data.reduce((sum, day) => sum + (day.cuotasPagadas || 0), 0);

  const gastosEmpresa = data.reduce((sum, day) => sum + (day.gastosEmpresa || 0), 0);
  const egresosVarios = data.reduce((sum, day) => sum + (day.egresosVarios || 0), 0);
  const egresosCuotasRetiros = data.reduce((sum, day) => sum + (day.egresosCuotasRetiros || 0), 0);
  const creditosDesembolsados = data.reduce((sum, day) => sum + (day.creditosDesembolsados || 0), 0);

  return (
    <div className="chart-summary">
      <div className="summary-item" title={`💰 Ingresos Capitales: $${ingresosCapitales.toLocaleString()}\n💰 Ingresos Varios: $${ingresosVarios.toLocaleString()}\n💰 Abonos a Cuotas: $${cuotasAbonos.toLocaleString()}\n💰 Cuotas Pagadas: $${cuotasPagadas.toLocaleString()}`}>
        <h4>Total Ingresos</h4>
        <span className="color-success">
          ${totalIngresos.toLocaleString()}
        </span>
      </div>
      <div className="summary-item" title={`💸 Gastos Empresa: $${gastosEmpresa.toLocaleString()}\n💸 Egresos Varios: $${egresosVarios.toLocaleString()}\n💸 Retiros Cuotas: $${egresosCuotasRetiros.toLocaleString()}\n💸 Créditos Desembolsados: $${creditosDesembolsados.toLocaleString()}`}>
        <h4>Total Egresos</h4>
        <span className="color-danger">
          ${totalEgresos.toLocaleString()}
        </span>
      </div>
      <div className="summary-item" title={`Balance Neto = Ingresos - Egresos\n💰 Ingresos: $${totalIngresos.toLocaleString()}\n💸 Egresos: $${totalEgresos.toLocaleString()}\n📊 Resultado: $${balanceNeto.toLocaleString()}`}>
        <h4>Balance Neto</h4>
        <span className={`color-${balanceNeto >= 0 ? 'success' : 'danger'}`}>
          ${balanceNeto.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
