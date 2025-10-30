import React from 'react';

export default function ChartSummary({ data, saldo }) {
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

  // Balances
  const cajaChicaInicial = data?.length > 0 ? (data[0]?.historialBalance || 0) : 0;
  const lastData = data?.length > 0 ? data[data.length-1] : null;
  let cajaChicaFinal = lastData ? (lastData.historialBalance || 0) : 0;
  if (lastData && cajaChicaFinal === 0 && lastData.date) {
    const lastDate = new Date(lastData.date);
    const today = new Date();
    // Set both to midnight
    lastDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    if (lastDate > today) {
      cajaChicaFinal = saldo || 0;
    }
  }

  return (
    <div className="chart-summary">
      <div className="summary-item" title={`Caja chica al inicio del rango\nFecha inicial: ${data?.[0]?.date || 'N/A'}\nSaldo: $${cajaChicaInicial.toLocaleString()}`}>
        <h4>Caja Chica Inicial</h4>
        <span>
          ${cajaChicaInicial.toLocaleString()}
        </span>
      </div>
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
        <h4>{balanceNeto >= 0 ? 'Superávit' : 'Déficit'}</h4>
        <span className={`color-${balanceNeto >= 0 ? 'success' : 'danger'}`}>
          ${balanceNeto.toLocaleString()}
        </span>
      </div>
      <div className="summary-item" title={`Caja chica al final del rango\nFecha final: ${data?.[data.length-1]?.date || 'N/A'}\nSaldo: $${cajaChicaFinal.toLocaleString()}`}>
        <h4>Caja Chica Final</h4>
        <span>
          ${cajaChicaFinal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
