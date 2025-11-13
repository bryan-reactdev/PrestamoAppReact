// frontend/src/pages/Admin/AdminEstadisticasDashboard.jsx

import ContentTitle from '../../components/Content/ContentTitle'
import Layout from '../../Layout'

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { useEffect, useState, useMemo } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { getCurrentDate } from '../../utils/dateUtils'
import FormField from '../../components/Form/FormField'
import { useCreditoStore } from '../../stores/useCreditoStore'
import { useCuotaStore } from '../../stores/useCuotaStore'
import BaseTable from '../../components/Table/BaseTable'
import { formatCurrencySVWithSymbol } from '../../utils/currencyUtils'

export default function AdminEstadisticasDashboard(){
  const {creditos, getCreditos, creditosForDate, setSelectedDate: setSelectedDateCredito} = useCreditoStore();
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
    if (!saldo){
      getBalance();
    }
  }, [getBalance, saldo])

  // Obtener cuotas y calcular proyección inicial
  useEffect(() => {
    getCuotas().then(() => {
      calcularProyeccion(selectedDate);
    });
  }, [getCuotas, calcularProyeccion, selectedDate])
  
  const [chartData, setChartData] = useState([
    { 
      category: "Ingresos Capitales", 
      value: 0 
    },
    { 
      category: "Ingresos Varios", 
      value: 0 
    },
    { 
      category: "Abonos a Cuotas", 
      value: 0 
    },
    { 
      category: "Pagos de Cuotas", 
      value: 0 
    },
  ])

  useEffect(() => {
    setChartData([
      { 
        category: "Ingresos Capitales", 
        value: currencyForDate?.ingresosCapitales?.total || 0 
      },
      { 
        category: "Ingresos Varios", 
        value: currencyForDate?.ingresosVarios?.total || 0 
      },
      { 
        category: "Abonos a Cuotas", 
        value: currencyForDate?.cuotasAbonos?.total || 0 
      },
      { 
        category: "Pagos de Cuotas", 
        value: currencyForDate?.cuotasPagadas?.total || 0 
      },
    ])
  }, [currencyForDate, currencyForRange])

  const [chartDataEgresos, setChartDataEgresos] = useState([
    { 
      category: "Gastos de Empresa", 
      value: 0 
    },
    { 
      category: "Egresos Varios", 
      value: 0 
    },
    { 
      category: "Retiro de Cuotas", 
      value: 0 
    },
    { 
      category: "Créditos Desembolsados", 
      value: 0 
    },
  ])

  useEffect(() => {
    setChartDataEgresos([
      { 
        category: "Gastos de Empresa", 
        value: currencyForDate?.gastosEmpresa?.total || 0 
      },
      { 
        category: "Egresos Varios", 
        value: currencyForDate?.egresosVarios?.total || 0 
      },
      { 
        category: "Retiro de Cuotas", 
        value: currencyForDate?.egresosCuotasRetiros?.total || 0 
      },
      { 
        category: "Créditos Desembolsados", 
        value: currencyForDate?.creditosDesembolsados?.total || 0 
      },
    ])
  }, [currencyForDate])

  const [chartData2, setChartData2] = useState([])

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

  const [chartDataPie, setChartDataPie] = useState([
    { name: "Aceptados", value: 0, totalMonto: 0 },
    { name: "Rechazados", value: 0, totalMonto: 0 },
  ])

  useEffect(() => {
    const aceptados = creditosForDate?.creditosAceptados || [];
    const aceptadosCount = aceptados.length;
    const aceptadosTotal = aceptados.reduce((sum, credito) => {
      return sum + (Number(credito.monto) || 0);
    }, 0);

    const rechazados = creditosForDate?.creditosRechazados || [];
    const rechazadosCount = rechazados.length;
    const rechazadosTotal = rechazados.reduce((sum, credito) => {
      return sum + (Number(credito.monto) || 0);
    }, 0);

    setChartDataPie([
      { name: "Aceptados", value: aceptadosCount, totalMonto: aceptadosTotal },
      { name: "Rechazados", value: rechazadosCount, totalMonto: rechazadosTotal },
    ])
  }, [creditosForDate])

  const RADIAN = Math.PI / 180;

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
      return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <g>
        <text 
          x={x} 
          y={y - 8} 
          fill="white" 
          textAnchor={x > ncx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize={13}
          fontWeight="bold"
        >
          {`${payload.value} crédito${payload.value !== 1 ? 's' : ''}`}
        </text>
        <text 
          x={x} 
          y={y + 8} 
          fill="white" 
          textAnchor={x > ncx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize={11}
        >
          {`$${Number(payload.totalMonto).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </text>
      </g>
    );
  };

  const chartConfig = {
    saldo: {
      label: "Balance",
      color: "#2563eb",
    },
    value: {
      label: "Monto",
      color: "#22c55e",
    },
    valueEgresos: {
      label: "Monto",
      color: "#ef4444",
    },
    Aceptados: {
      label: "Aceptados",
      color: "#22c55e",
    },
    Rechazados: {
      label: "Rechazados",
      color: "#ef4444",
    },
  }

  // Process creditos data for table
  const creditosTableData = useMemo(() => {
    const allCreditos = [
      ...(creditosForDate?.creditosAceptados || []),
      ...(creditosForDate?.creditosRechazados || [])
    ];

    return allCreditos.map((credito, index) => ({
      id: credito.id || `credito-${index}`,
      tipo: credito.tipo || 'N/A',
      estado: credito.estado || 'N/A',
      monto: credito.monto || 0,
      motivo: credito.motivo || 'N/A',
      documento: credito.usuarioSolicitud?.dui || credito.dui || 'N/A'
    }));
  }, [creditosForDate]);

  // Column definitions
  const creditosTableColumns = useMemo(() => [
    {
      accessorKey: 'tipo',
      header: "Tipo",
      size: 125,
      cell: (props) => <p>{props.getValue()}</p>
    },
    {
      accessorKey: 'estado',
      header: "Estado",
      size: 125,
      cell: (props) => <p className={`badge ${props.getValue()}`}>{props.getValue()}</p>
    },
    {
      accessorKey: 'monto',
      header: "Monto",
      size: 125,
      cell: (props) => {
        const value = props.getValue();
        return (
          <span>
            <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      accessorKey: 'motivo',
      header: "Motivo",
      size: 150,
      cell: (props) => <p>{props.getValue()}</p>
    },
    {
      accessorKey: 'documento',
      header: "Documento",
      size: 150,
      cell: (props) => <p>{props.getValue()}</p>
    },
  ], []);

  // Métricas fijas para futuras implementaciones
  const metricasFijas = {
    roi: 15.8, // Porcentaje fijo
    recuperacion: 87.3, // Porcentaje fijo
    ganancias: 12500.00 // Monto fijo
  };

  return(
    <Layout>
      <div className="content">
        <ContentTitle title="Dashboard de Estadísticas" />
        
        <div className="date-controls mb-4">
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
            <i className='fas fa-rotate'/>
            IR A HOY
          </button>
        </div>

        {/* Sección superior: Balance y Métricas */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {/* Balance de Caja Chica */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Balance Caja Chica</h3>
            <div className="text-2xl font-bold text-blue-600">
              {currencyForDate?.balance?.saldo ? formatCurrencySVWithSymbol(currencyForDate?.balance?.saldo) : 'N/A'}
            </div>
          </div>

          {/* Proyección de Cuotas - Contenedor pequeño */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Proyección de Cuotas</h3>
            {isFetchingProyeccion ? (
              <div className="text-center py-2">
                <span className="text-sm text-gray-600">Cargando...</span>
              </div>
            ) : proyeccionData ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-green-600 font-bold text-lg">{proyeccionData.cuotasCobradas?.cantidad || 0}</div>
                  <div className="text-xs text-gray-600">Cobradas</div>
                  <div className="text-xs font-medium">
                    {formatCurrencySVWithSymbol(proyeccionData.cuotasCobradas?.montoTotal || 0)}
                  </div>
                </div>
                <div className="p-2 bg-amber-50 rounded">
                  <div className="text-amber-600 font-bold text-lg">{proyeccionData.cuotasPorCobrar?.cantidad || 0}</div>
                  <div className="text-xs text-gray-600">Por Cobrar</div>
                  <div className="text-xs font-medium">
                    {formatCurrencySVWithSymbol(proyeccionData.cuotasPorCobrar?.montoTotal || 0)}
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-blue-600 font-bold text-lg">{proyeccionData.totalGeneral?.cantidad || 0}</div>
                  <div className="text-xs text-gray-600">Total</div>
                  <div className="text-xs font-medium">
                    {formatCurrencySVWithSymbol(proyeccionData.totalGeneral?.montoTotal || 0)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <span className="text-sm text-gray-600">Sin datos disponibles</span>
              </div>
            )}
          </div>

          {/* ROI (Return on Investment) */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">ROI</h3>
            <div className="text-2xl font-bold text-purple-600">
              {metricasFijas.roi}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Return on Investment</div>
          </div>

          {/* Tasa de Recuperación */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Recuperación</h3>
            <div className="text-2xl font-bold text-green-600">
              {metricasFijas.recuperacion}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Tasa de Recuperación</div>
          </div>

          {/* Ganancias */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Ganancias</h3>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrencySVWithSymbol(metricasFijas.ganancias)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Ganancias Netas</div>
          </div>
          
        </div>

        {/* Sección de gráficos principales */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Gráfico de Ingresos */}
          <div className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Ingresos</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart 
                layout="vertical"
                accessibilityLayer 
                data={chartData}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} tickMargin={10} axisLine={true} />
                <YAxis dataKey={"category"} type="category" tickLine={false} tickMargin={10} axisLine={true} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={"value"} radius={4} fill="var(--color-value)" />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Gráfico de Egresos */}
          <div className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Egresos</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart 
                layout="vertical"
                accessibilityLayer 
                data={chartDataEgresos}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} tickMargin={10} axisLine={true} />
                <YAxis dataKey={"category"} type="category" tickLine={false} tickMargin={10} axisLine={true} width={80} />
                <ChartTooltip content={<ChartTooltipContent nameKey="valueEgresos" />} />
                <Bar dataKey={"value"} radius={4} fill="var(--color-valueEgresos)" />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Gráfico de Balance */}
          <div className="bg-white p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-center">Evolución del Balance</h3>
            <ChartContainer config={chartConfig} className="h-64">
              <LineChart accessibilityLayer data={chartData2}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={"fecha"} tickLine={false} tickMargin={10} axisLine={true} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  dataKey={"saldo"} 
                  stroke="var(--color-saldo)" 
                  strokeWidth={2} 
                  dot={{ fill: "var(--color-saldo)", r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        {/* Sección inferior: Créditos y Tabla */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Créditos Aceptados vs Rechazados</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Gráfico de Pie */}
            <div className="flex items-center justify-center">
              {chartDataPie.every(entry => entry.value === 0) ? (
                <div className="flex items-center justify-center h-64 w-full text-muted-foreground">
                  <p className="text-lg">No hay datos disponibles</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <PieChart>
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          nameKey="name" 
                          labelKey="name"
                          formatter={(value, name, item, labelFormatter, payload) => {
                            const totalMonto = item.payload?.totalMonto || 0;
                            return [
                              <div key="tooltip" className="w-full flex flex-col gap-1">
                                <div className='w-full flex justify-between'>
                                  <span className="text-muted-foreground">Cantidad</span>
                                  <span className="font-medium">{value}</span>
                                </div>
                                <div className='w-full flex justify-between'>
                                  <span className="text-muted-foreground">Total</span>
                                  <span className="font-medium">${Number(totalMonto).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              </div>,
                            ];
                          }}
                        />
                      } 
                    />
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    <Pie
                      data={chartDataPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={renderCustomLabel}
                      labelLine={false}
                    >
                      {chartDataPie.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name]?.color || "#8884d8"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              )}
            </div>

            {/* Tabla de Créditos */}
            <div className="overflow-auto">
              <BaseTable
                data={creditosTableData}
                columns={creditosTableColumns}
                customHeaderHeight={50}
                hideSearchbar={true}
                centered={['tipo', 'estado', 'monto', 'motivo', 'documento']}
                flexable={['monto']}
                pageSize={5}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}