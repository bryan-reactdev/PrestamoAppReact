import React from 'react';
import { formatCurrencySV } from '../../utils/currencyUtils';

export default function ChartSummary({ data, saldo, viewType = 'Semanal' }) {
  // Calculate detailed breakdowns
  const ingresosCapitales = data.reduce((sum, day) => sum + (day.totalIngresosCapitales || 0), 0);
  const totalIngresosSinCapitales = data.reduce((sum, day) => sum + (day.totalIngresos || 0), 0);
  const totalIngresos = ingresosCapitales + totalIngresosSinCapitales;
  const totalEgresos = data.reduce((sum, day) => sum + day.totalEgresos, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  // Calculate detailed breakdowns for tooltips
  const ingresosVarios = data.reduce((sum, day) => sum + (day.ingresosVarios || 0), 0);
  const cuotasAbonos = data.reduce((sum, day) => sum + (day.cuotasAbonos || 0), 0);
  const cuotasPagadas = data.reduce((sum, day) => sum + (day.cuotasPagadas || 0), 0);

  const gastosEmpresa = data.reduce((sum, day) => sum + (day.gastosEmpresa || 0), 0);
  const egresosVarios = data.reduce((sum, day) => sum + (day.egresosVarios || 0), 0);
  const egresosPagoPlanillas = data.reduce((sum, day) => sum + (day.egresosPagoPlanillas || 0), 0);
  const egresosCuotasRetiros = data.reduce((sum, day) => sum + (day.egresosCuotasRetiros || 0), 0);
  const creditosDesembolsados = data.reduce((sum, day) => sum + (day.creditosDesembolsados || 0), 0);

  // Balances
  const firstData = data?.length > 0 ? data[0] : null;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  // Initial balance
  let cajaChicaInicial = null;
  if (firstData) {
    const firstDateStr = firstData.date?.split('T')[0];
    if (firstDateStr >= todayStr) {
      cajaChicaInicial = saldo;
    } else {
      cajaChicaInicial = (firstData.historialBalance !== null && firstData.historialBalance !== undefined && firstData.historialBalance !== 0)
        ? firstData.historialBalance 
        : null;
    }
  }
  
  // Final balance
  const lastData = data?.length > 0 ? data[data.length-1] : null;
  let cajaChicaFinal = null;
  if (lastData && lastData.date) {
    const lastDateStr = lastData.date.split('T')[0];
    // If last date is today or in the future, use current saldo (most accurate)
    if (lastDateStr >= todayStr) {
      cajaChicaFinal = saldo;
    } else {
      // For past dates, use historialBalance if available (not null, undefined, or 0)
      cajaChicaFinal = (lastData.historialBalance !== null && lastData.historialBalance !== undefined && lastData.historialBalance !== 0)
        ? lastData.historialBalance 
        : null;
    }
  }

  return (
    <div className="chart-summary">
      <div className="summary-item" title={`Caja chica al inicio del rango\nFecha inicial: ${data?.[0]?.date || 'N/A'}\nSaldo: ${cajaChicaInicial !== null ? `$${cajaChicaInicial.toLocaleString()}` : 'N/A'}`}>
        <h4>Caja Chica Inicial</h4>
        <span>
          {cajaChicaInicial !== null ? `$${formatCurrencySV(cajaChicaInicial)}` : 'N/A'}
        </span>
      </div>
      <div className="summary-item" title={`💰 Ingresos Capitales: $${ingresosCapitales.toLocaleString()}\n💰 Ingresos Varios: $${ingresosVarios.toLocaleString()}\n💰 Abonos a Cuotas: $${cuotasAbonos.toLocaleString()}\n💰 Cuotas Pagadas: $${cuotasPagadas.toLocaleString()}\n\nTotal: $${totalIngresos.toLocaleString()}`}>
        <h4>Total Ingresos {viewType}</h4>
        <span className="color-success">
          ${formatCurrencySV(totalIngresos)}
        </span>
      </div>
      <div className="summary-item" title={`💸 Gastos Empresa: $${gastosEmpresa.toLocaleString()}\n💸 Egresos Varios: $${egresosVarios.toLocaleString()}\n💸 Pago de Planillas: $${egresosPagoPlanillas.toLocaleString()}\n💸 Retiros Cuotas: $${egresosCuotasRetiros.toLocaleString()}\n💸 Créditos Desembolsados: $${creditosDesembolsados.toLocaleString()}`}>
        <h4>Total Egresos {viewType}</h4>
        <span className="color-danger">
          ${formatCurrencySV(totalEgresos)}
        </span>
      </div>
      <div className="summary-item" title={`Balance Neto = Ingresos - Egresos\n💰 Ingresos: $${totalIngresos.toLocaleString()}\n💸 Egresos: $${totalEgresos.toLocaleString()}\n📊 Resultado: $${balanceNeto.toLocaleString()}`}>
        <h4>Balance Neto {viewType}</h4>
        <span className={`color-${balanceNeto >= 0 ? 'success' : 'danger'}`}>
          ${formatCurrencySV(balanceNeto)}
        </span>
      </div>
      <div className="summary-item" title={`Caja chica al final del rango\nFecha final: ${data?.[data.length-1]?.date || 'N/A'}\nSaldo: ${cajaChicaFinal !== null ? `$${cajaChicaFinal.toLocaleString()}` : 'N/A'}`}>
        <h4>Caja Chica Final</h4>
        <span>
          {cajaChicaFinal !== null ? `$${formatCurrencySV(cajaChicaFinal)}` : 'N/A'}
        </span>
      </div>
    </div>
  );
}
