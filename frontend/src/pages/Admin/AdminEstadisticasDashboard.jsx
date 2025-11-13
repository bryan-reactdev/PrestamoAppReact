// frontend/src/pages/Admin/AdminEstadisticasDashboard.jsx
import Layout from '../../Layout'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Cell, Pie, PieChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useEffect, useState, useMemo } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { getCurrentDate } from '../../utils/dateUtils'
import FormField from '../../components/Form/FormField'
import { useCreditoStore } from '../../stores/useCreditoStore'
import { useCuotaStore } from '../../stores/useCuotaStore'
import BaseTable from '../../components/Table/BaseTable'
import { formatCurrencySVWithSymbol } from '../../utils/currencyUtils'

export default function AdminEstadisticasDashboard() {
  const { creditos, getCreditos, creditosForDate, setSelectedDate: setSelectedDateCredito } = useCreditoStore();
  const { saldo, getBalance, currencyForDate, currencyForRange, getCurrencyForDate, getCurrencyForRange, selectedDate, setSelectedDate } = useCurrencyStore();
  const { proyeccionData, getCuotas, calcularProyeccion, isFetchingProyeccion, setSelectedDate: setSelectedDateCuota } = useCuotaStore();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateCredito(date);
    setSelectedDateCuota(date);
  };

  useEffect(() => {
    if (creditos.length === 0) {
      getCreditos();
    }
  }, [getCreditos])

  useEffect(() => {
    if (!saldo) {
      getBalance();
    }
    getCurrencyForDate();
  }, [getBalance, saldo, getCurrencyForDate, selectedDate])

  useEffect(() => {
    getCuotas().then(() => {
      calcularProyeccion(selectedDate);
    });
  }, [getCuotas, calcularProyeccion, selectedDate, saldo])

  const [chartData, setChartData] = useState([
    { category: "Ingresos Capitales", value: 0 },
    { category: "Ingresos Varios", value: 0 },
    { category: "Abonos a Cuotas", value: 0 },
    { category: "Pagos de Cuotas", value: 0 },
  ])

  const [chartDataEgresos, setChartDataEgresos] = useState([
    { category: "Gastos de Empresa", value: 0 },
    { category: "Egresos Varios", value: 0 },
    { category: "Retiro de Cuotas", value: 0 },
    { category: "Créditos Desembolsados", value: 0 },
  ])

  const [chartData2, setChartData2] = useState([])

  const [chartDataPieEstado, setChartDataPieEstado] = useState([ // Renombrado a 'Estado'
    { name: "Aceptados", value: 0, totalMonto: 0 },
    { name: "Rechazados", value: 0, totalMonto: 0 },
  ])

  useEffect(() => {
    setChartData([
      { category: "Ingresos Capitales", value: currencyForDate?.ingresosCapitales?.total || 0 },
      { category: "Ingresos Varios", value: currencyForDate?.ingresosVarios?.total || 0 },
      { category: "Abonos a Cuotas", value: currencyForDate?.cuotasAbonos?.total || 0 },
      { category: "Pagos de Cuotas", value: currencyForDate?.cuotasPagadas?.total || 0 },
    ])
  }, [currencyForDate])

  useEffect(() => {
    setChartDataEgresos([
      { category: "Gastos de Empresa", value: currencyForDate?.gastosEmpresa?.total || 0 },
      { category: "Egresos Varios", value: currencyForDate?.egresosVarios?.total || 0 },
      { category: "Retiro de Cuotas", value: currencyForDate?.egresosCuotasRetiros?.total || 0 },
      { category: "Créditos Desembolsados", value: currencyForDate?.creditosDesembolsados?.total || 0 },
    ])
  }, [currencyForDate])

  useEffect(() => {
    if (currencyForRange?.balance && Array.isArray(currencyForRange.balance)) {
      const formattedData = currencyForRange.balance
        .map(item => ({
          fecha: item.fecha ? item.fecha.split('T')[0] : '',
          saldo: item.monto || 0
        }))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setChartData2(formattedData);
    } else {
      setChartData2([]);
    }
  }, [currencyForRange])

  useEffect(() => {
    const aceptados = creditosForDate?.creditosAceptados || [];
    const aceptadosCount = aceptados.length;
    const aceptadosTotal = aceptados.reduce((sum, credito) => sum + (Number(credito.monto) || 0), 0);

    const rechazados = creditosForDate?.creditosRechazados || [];
    const rechazadosCount = rechazados.length;
    const rechazadosTotal = rechazados.reduce((sum, credito) => sum + (Number(credito.monto) || 0), 0);

    setChartDataPieEstado([
      { name: "Aceptados", value: aceptadosCount, totalMonto: aceptadosTotal },
      { name: "Rechazados", value: rechazadosCount, totalMonto: rechazadosTotal },
    ])
  }, [creditosForDate])

  // NUEVO: Cálculo de datos para la gráfica de pastel por TIPO
  const chartDataPieTipo = useMemo(() => {
    const allCreditos = [
      ...(creditosForDate?.creditosAceptados || []),
      ...(creditosForDate?.creditosRechazados || [])
    ];

    const groupedByType = allCreditos.reduce((acc, credito) => {
      const tipo = credito.tipo || 'Desconocido';

      if (!acc[tipo]) {
        acc[tipo] = {
          name: tipo,
          value: 0,
          totalMonto: 0,
        };
      }

      acc[tipo].value += 1;
      acc[tipo].totalMonto += (Number(credito.monto) || 0);

      return acc;
    }, {});

    return Object.values(groupedByType);
  }, [creditosForDate]);


  const RADIAN = Math.PI / 180;

  // Función de renderizado de etiquetas para las gráficas de pastel
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
      return null;
    }
    const radius = outerRadius + 5;
    const ncx = Number(cx);
    const ncy = Number(cy);
    const angle = (midAngle ?? 0) * RADIAN;
    const x = ncx + radius * Math.cos(angle);
    const y = ncy + radius * Math.sin(angle);
    const anchor = x > ncx ? 'start' : 'end';

    if (percent * 100 < 5 && payload.value === 0) return null; // Ocultar etiquetas muy pequeñas o vacías

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="#000"
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
        >
          {`${payload.value} crédito${payload.value !== 1 ? 's' : ''}`}
        </text>
        <text
          x={x}
          y={y + 14}
          fill="#666"
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize={10}
        >
          {`(${Number(percent * 100).toFixed(1)}%) ${formatCurrencySVWithSymbol(payload.totalMonto)}`}
        </text>
      </g>
    );
  };

  // Generador de colores para los tipos de crédito (para la nueva gráfica)
  const getColorForType = (type) => {
    switch (type) {
      case 'Hipotecario':
        return "#4c78a8";
      case 'PrestamodeConsumo': // Asumiendo este es un tipo de la DB
        return "#f58518";
      case 'Automotriz':
        return "#e45756";
      case 'Personal':
        return "#72b7b2";
      case 'Consumo':
        return "#54a24b";
      case 'Comercial':
        return "#eeca3b";
      case 'Educativo':
        return "#b279a2";
      case 'Agropecuario':
        return "#ff9da6";
      case 'Microcrédito':
        return "#9d755d";
      case 'Desconocido':
        return "#bab0ac";
      default:
        return "#bab0ac"; // Color gris por defecto
    }
  };

  // Configuración de colores extendida para los dos gráficos
  const chartConfig = useMemo(() => {
    const typeColors = chartDataPieTipo.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: getColorForType(item.name) };
      return acc;
    }, {});

    return {
      saldo: { label: "Balance", color: "#2563eb" },
      value: { label: "Monto", color: "#22c55e" },
      valueEgresos: { label: "Monto", color: "#ef4444" },
      Aceptados: { label: "Aceptados", color: "#22c55e" },
      Rechazados: { label: "Rechazados", color: "#ef4444" },
      ...typeColors,
    };
  }, [chartDataPieTipo]);


  // Procesar datos de créditos para la tabla AGRUPÁNDOLOS por tipo y estado.
  const creditosTableData = useMemo(() => {
    const allCreditos = [
      ...(creditosForDate?.creditosAceptados || []),
      ...(creditosForDate?.creditosRechazados || [])
    ];

    // 1. Agrupar por tipo y estado
    const grouped = allCreditos.reduce((acc, credito) => {
      const key = `${credito.tipo || 'N/A'}-${credito.estado || 'N/A'}`;

      if (!acc[key]) {
        acc[key] = {
          tipo: credito.tipo || 'N/A',
          estado: credito.estado || 'N/A',
          cantidad: 0,
          montoTotal: 0,
        };
      }

      acc[key].cantidad += 1;
      acc[key].montoTotal += (Number(credito.monto) || 0);

      return acc;
    }, {});

    // 2. Convertir el objeto agrupado a un array para la tabla
    return Object.values(grouped);
  }, [creditosForDate]);

  // Columnas de la tabla para mostrar los datos agrupados
  const creditosTableColumns = useMemo(() => [
    {
      accessorKey: 'tipo',
      header: "Tipo de Crédito",
      size: 150,
      cell: (props) => <p className='font-semibold'>{props.getValue()}</p>
    },
    {
      accessorKey: 'estado',
      header: "Estado",
      size: 100,
      cell: (props) => {
        const estado = props.getValue();
        const colorClass = estado === 'Aceptado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{estado}</span>;
      }
    },
    {
      accessorKey: 'cantidad',
      header: "Cantidad de Créditos",
      size: 120,
      cell: (props) => <p className='text-center'>{props.getValue()}</p>
    },
    {
      accessorKey: 'montoTotal',
      header: "Monto Total (por tipo/estado)",
      size: 180,
      cell: (props) => {
        const value = props.getValue();
        return (
          <span className='font-bold text-blue-700'>
            {formatCurrencySVWithSymbol(value)}
          </span>
        );
      }
    },
  ], []);

  // Métricas calculadas
  const recuperacionCalculada = useMemo(() => {
    const totalCuotasPagadas = Number(currencyForDate?.cuotasPagadas?.total || 0);
    const totalIngresoACapital = Number(currencyForDate?.ingresosCapitales?.total || 0);
    const capitalPendiente = totalIngresoACapital - totalCuotasPagadas;
    return Math.max(0, capitalPendiente);
  }, [currencyForDate]);

  const gananciaDespuesRecuperacion = useMemo(() => {
    const totalCuotasPagadas = Number(currencyForDate?.cuotasPagadas?.total || 0);
    const totalIngresoACapital = Number(currencyForDate?.ingresosCapitales?.total || 0);
    const totalPorCobrar = Number(proyeccionData?.cuotasPorCobrar?.montoTotal || 0);
    const totalFlujoEsperado = totalCuotasPagadas + totalPorCobrar;
    const ganancia = totalFlujoEsperado - totalIngresoACapital;
    return Math.max(0, ganancia);
  }, [currencyForDate, proyeccionData]);

  const roiCalculado = useMemo(() => {
    const totalCuotasPagadas = Number(currencyForDate?.cuotasPagadas?.total || 0);
    const totalIngresoACapital = Number(currencyForDate?.ingresosCapitales?.total || 0);
    if (totalIngresoACapital > 0) {
      return ((totalCuotasPagadas - totalIngresoACapital) / totalIngresoACapital) * 100;
    }
    return 0;
  }, [currencyForDate]);

  // Componente de tarjeta métrica reutilizable
  const MetricCard = ({ title, value, subtitle, color = "blue", size = "md", children }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      red: "bg-red-50 border-red-200 text-red-700",
      amber: "bg-amber-50 border-amber-200 text-amber-700",
      emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    };

    return (
      <div className={`rounded-lg border ${colorClasses[color]} p-4 h-full`}>
        <h3 className="font-semibold mb-2 text-center text-sm">{title}</h3>
        {children || (
          <>
            <div className={`font-bold text-center ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
              {value}
            </div>
            <div className="text-xs text-gray-600 text-center mt-1">{subtitle}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="content space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
          <h1 className="text-xl font-bold text-gray-800">Dashboard Financiero</h1>
          <div className="flex items-center gap-3">
            <FormField
              classNames={'simple'}
              label={'Fecha'}
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
            <button
              className='btn-primary sm'
              onClick={() => handleDateChange(getCurrentDate())}
            >
              <i className='fas fa-rotate' />
              HOY
            </button>
          </div>
        </div>

        {/* ==================== SECCIÓN SUPERIOR: MÉTRICAS PRINCIPALES ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* CARD 1: BALANCE CAJA CHICA */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-blue-700">Balance Caja Chica</h3>

            {/* Balance Principal */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
              <div className="text-2xl font-bold text-blue-600 text-center">
                {currencyForDate?.balance?.saldo ? formatCurrencySVWithSymbol(currencyForDate.balance.saldo) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 text-center">Saldo al {selectedDate}</div>
            </div>

            {/* Ingresos vs Egresos en grid 2x2 compacto */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 p-2 rounded border border-green-200">
                <div className="text-xs font-semibold text-green-600 text-center">Ingresos</div>
                <div className="text-sm font-bold text-green-600 text-center">
                  {formatCurrencySVWithSymbol((currencyForDate?.ingresosCapitales?.total || 0) + (currencyForDate?.ingresosVarios?.total || 0))}
                </div>
              </div>
              <div className="bg-red-50 p-2 rounded border border-red-200">
                <div className="text-xs font-semibold text-red-600 text-center">Egresos</div>
                <div className="text-sm font-bold text-red-600 text-center">
                  {formatCurrencySVWithSymbol((currencyForDate?.gastosEmpresa?.total || 0) + (currencyForDate?.egresosVarios?.total || 0))}
                </div>
              </div>
              <div className="bg-purple-50 p-2 rounded border border-purple-200 col-span-2">
                <div className="text-xs font-semibold text-purple-600 text-center">Neto del Día</div>
                <div className="text-sm font-bold text-purple-600 text-center">
                  {formatCurrencySVWithSymbol(
                    ((currencyForDate?.ingresosCapitales?.total || 0) + (currencyForDate?.ingresosVarios?.total || 0)) -
                    ((currencyForDate?.gastosEmpresa?.total || 0) + (currencyForDate?.egresosVarios?.total || 0))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: INVERSIONES & ROI */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-amber-700">Inversiones & ROI</h3>

            {/* Grid 2x2 para métricas de inversión */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Capital Invertido"
                value={currencyForDate?.ingresosCapitales?.total ? formatCurrencySVWithSymbol(currencyForDate.ingresosCapitales.total) : '$0.00'}
                color="amber"
                size="sm"
              />
              <MetricCard
                title="ROI"
                value={`${Number(roiCalculado).toFixed(2)}%`}
                subtitle="Retorno de inversión"
                color="purple"
                size="sm"
              />
              <MetricCard
                title="Por Recuperar"
                value={formatCurrencySVWithSymbol(recuperacionCalculada)}
                subtitle="Capital pendiente"
                color="red"
                size="sm"
              />
              <MetricCard
                title="Ganancia Neta"
                value={formatCurrencySVWithSymbol(gananciaDespuesRecuperacion)}
                subtitle="Proyectada"
                color="emerald"
                size="sm"
              />
            </div>
          </div>

          {/* CARD 3: PROYECCIÓN DE CUOTAS */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-indigo-700">Proyección de Cuotas</h3>
            {isFetchingProyeccion ? (
              <div className="text-center py-4">
                <span className="text-sm text-gray-600">Cargando...</span>
              </div>
            ) : proyeccionData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                  <div>
                    <div className="text-sm font-semibold text-green-700">Cobradas</div>
                    <div className="text-xs text-gray-600">{proyeccionData.cuotasCobradas?.cantidad || 0} cuotas</div>
                  </div>
                  <div className="text-green-700 font-bold">
                    {formatCurrencySVWithSymbol(proyeccionData.cuotasCobradas?.montoTotal || 0)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-amber-50 rounded border border-amber-200">
                  <div>
                    <div className="text-sm font-semibold text-amber-700">Por Cobrar</div>
                    <div className="text-xs text-gray-600">{proyeccionData.cuotasPorCobrar?.cantidad || 0} cuotas</div>
                  </div>
                  <div className="text-amber-700 font-bold">
                    {formatCurrencySVWithSymbol(proyeccionData.cuotasPorCobrar?.montoTotal || 0)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                  <div>
                    <div className="text-sm font-semibold text-blue-700">Total General</div>
                    <div className="text-xs text-gray-600">{proyeccionData.totalGeneral?.cantidad || 0} cuotas</div>
                  </div>
                  <div className="text-blue-700 font-bold">
                    {formatCurrencySVWithSymbol(proyeccionData.totalGeneral?.montoTotal || 0)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-sm text-gray-600">Sin datos disponibles</span>
              </div>
            )}
          </div>
        </div>

        {/* ==================== SECCIÓN MEDIA: GRÁFICOS PRINCIPALES (2 Gráficas de Pastel) ==================== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Gráfico 1 de 3: Evolución del Balance */}
          <div className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-3 text-center">Evolución del Balance</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart accessibilityLayer data={chartData2}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="fecha" tickLine={false} tickMargin={5} axisLine={true} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: "compact", compactDisplay: "short" })}`} />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [formatCurrencySVWithSymbol(value),]}
                  />}
                />
                <Line
                  dataKey="saldo"
                  stroke="var(--color-saldo)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-saldo)", r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Gráfico 2 de 3: Distribución por Estado (Existente) */}
          <div className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-3 text-center">Distribución por Estado (Aceptados/Rechazados)</h3>
            {chartDataPieEstado.every(entry => entry.value === 0) ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p className="text-lg">No hay datos de estado</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="name"
                        formatter={(value, name, item) => {
                          const totalMonto = item.payload?.totalMonto || 0;
                          return [
                            <div key="tooltip" className="w-full flex flex-col gap-1">
                              <div className='w-full flex justify-between'>
                                <span className="text-muted-foreground">Cantidad</span>
                                <span className="font-medium">{value}</span>
                              </div>
                              <div className='w-full flex justify-between'>
                                <span className="text-muted-foreground">Total</span>
                                <span className="font-medium">{formatCurrencySVWithSymbol(totalMonto)}</span>
                              </div>
                            </div>,
                          ];
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} layout="horizontal" align="center" verticalAlign="bottom" />
                  <Pie
                    data={chartDataPieEstado}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={100}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {chartDataPieEstado.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name]?.color || "#8884d8"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>

          {/* Gráfico 3 de 3: Distribución por Tipo (NUEVO) */}
          <div className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-3 text-center">Distribución por Tipo de Crédito</h3>
            {chartDataPieTipo.every(entry => entry.value === 0) ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p className="text-lg">No hay datos de tipos de crédito</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="name"
                        formatter={(value, name, item) => {
                          const totalMonto = item.payload?.totalMonto || 0;
                          return [
                            <div key="tooltip" className="w-full flex flex-col gap-1">
                              <div className='w-full flex justify-between'>
                                <span className="text-muted-foreground">Cantidad</span>
                                <span className="font-medium">{value}</span>
                              </div>
                              <div className='w-full flex justify-between'>
                                <span className="text-muted-foreground">Total</span>
                                <span className="font-medium">{formatCurrencySVWithSymbol(totalMonto)}</span>
                              </div>
                            </div>,
                          ];
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} layout="horizontal" align="center" verticalAlign="bottom" />
                  <Pie
                    data={chartDataPieTipo}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={100}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {chartDataPieTipo.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name]?.color || "#bab0ac"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>
        </div>

        {/* ==================== SECCIÓN INFERIOR: DETALLES DE FLUJO HORIZONTAL ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Gráfico de Ingresos Detallados - HORIZONTAL CON BARRAS DELGADAS */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-green-700">Detalle de Ingresos</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                layout="vertical"
                accessibilityLayer
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: "compact", compactDisplay: "short" })}`}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={true}
                  width={100}
                  fontSize={12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [formatCurrencySVWithSymbol(value), 'Monto']}
                  />}
                />
                <Bar
                  dataKey="value"
                  radius={2}
                  fill="var(--color-value)"
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Gráfico de Egresos Detallados - HORIZONTAL CON BARRAS DELGADAS */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-red-700">Detalle de Egresos</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                layout="vertical"
                accessibilityLayer
                data={chartDataEgresos}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: "compact", compactDisplay: "short" })}`}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={true}
                  width={100}
                  fontSize={12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [formatCurrencySVWithSymbol(value), 'Monto']}
                  />}
                />
                <Bar
                  dataKey="value"
                  radius={2}
                  fill="var(--color-valueEgresos)"
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* ==================== TABLA DE CRÉDITOS - AGRUPADA ==================== */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 text-center">Resumen de Solicitudes de Crédito por Tipo y Estado</h3>
          <BaseTable
            data={creditosTableData}
            columns={creditosTableColumns}
            customHeaderHeight={50}
            hideSearchbar={true}
            centered={['tipo', 'estado', 'cantidad', 'montoTotal']}
            flexable={['montoTotal']}
            pageSize={8}
          />
        </div>

      </div>
    </Layout>
  )
}