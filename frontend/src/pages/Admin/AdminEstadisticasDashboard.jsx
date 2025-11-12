import ContentTitle from '../../components/Content/ContentTitle'
import Layout from '../../Layout'

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { useEffect, useState, useMemo } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { getCurrentDate } from '../../utils/dateUtils'
import FormField from '../../components/Form/FormField'
import { useCreditoStore } from '../../stores/useCreditoStore'
import BaseTable from '../../components/Table/BaseTable'
import { formatCurrencySVWithSymbol } from '../../utils/currencyUtils'

export default function AdminEstadisticasDashboard(){
  const {creditos, getCreditos, creditosForDate, setSelectedDate: setSelectedDateCredito} = useCreditoStore();
  const { saldo, getBalance, currencyForDate, currencyForRange, getCurrencyForDate, getCurrencyForRange, selectedDate, setSelectedDate } = useCurrencyStore();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateCredito(date);
  };

  useEffect(() => {
    if (creditos.length === 0) {
      getCreditos();
    }
  }, [getCreditos])

  console.log(creditosForDate.creditosAceptados.length);
  console.log(creditosForDate.creditosRechazados.length);

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance, saldo])
  
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

  return(
    <Layout>
      <div className="content">
        <div className="date-controls">
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

        <div className='grid grid-cols-10 grid-rows-4 gap-4 max-h-[calc(100vh-250px)] w-full overflow-hidden'>
          <div className='flex flex-col gap-2 col-span-10 row-span-2'>
            <h1 className='text-2xl font-bold'>Caja Chica: {currencyForDate?.balance?.saldo ? formatCurrencySVWithSymbol(currencyForDate?.balance?.saldo) : 'N/A'}</h1>

            <div className='grid grid-cols-10 gap-4 h-full w-full'>
              <div className='flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-lg text-2xl overflow-hidden col-span-3'>
                <h3 className='text-xl'>Ingresos</h3>
                
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart 
                    layout="vertical"
                    accessibilityLayer 
                    data={chartData}
                    onClick={(data, index, e) => {
                      console.log("Clicked data:", data);
                      console.log("Data index:", index);
                    }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tickLine={false} tickMargin={10} axisLine={true} />
                    <YAxis dataKey={"category"} type="category" tickLine={false} tickMargin={10} axisLine={true} width={80} />

                    <ChartTooltip content={<ChartTooltipContent />} />

                    <Bar dataKey={"value"} radius={1} fill="var(--color-value)" barSize={200} />
                  </BarChart>
                </ChartContainer>
              </div>

              <div className='flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-lg text-2xl overflow-hidden col-span-3'>
                <h3 className='text-xl'>Egresos</h3>
                
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart 
                    layout="vertical"
                    accessibilityLayer 
                    data={chartDataEgresos}
                    onClick={(data, index, e) => {
                      console.log("Clicked data:", data);
                      console.log("Data index:", index);
                    }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tickLine={false} tickMargin={10} axisLine={true} />
                    <YAxis dataKey={"category"} type="category" tickLine={false} tickMargin={10} axisLine={true} width={80} />

                    <ChartTooltip content={<ChartTooltipContent nameKey="valueEgresos" />} />

                    <Bar dataKey={"value"} radius={1} fill="var(--color-valueEgresos)" barSize={200} />
                  </BarChart>
                </ChartContainer>
              </div>

              <div className='flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-lg text-2xl overflow-hidden col-span-4'>
                <h3 className='text-xl'>Caja Chica Balance</h3>
                
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart 
                    accessibilityLayer 
                    data={chartData2}
                    onClick={(data, index, e) => {
                      console.log("Clicked data:", data);
                      console.log("Data index:", index);
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={"fecha"} tickLine={false} tickMargin={10} axisLine={true} />

                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />

                    <Line dataKey={"saldo"} radius={1} stroke="var(--color-saldo)" strokeWidth={4} fill="var(--color-saldo)" barSize={200} />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 bg-white p-4 rounded-lg text-2xl overflow-hidden col-span-10 row-span-2'>
            <h3 className='text-xl'>Créditos Aceptados vs Rechazados</h3>
            
            <div className='flex gap-4 h-full w-full'>
              <div className='flex-1 flex items-center justify-center'>
                {chartDataPie.every(entry => entry.value === 0) ? (
                  <div className='flex items-center justify-center h-full w-full text-muted-foreground'>
                    <p className='text-lg'>No hay datos disponibles</p>
                  </div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-full w-full">
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
                        outerRadius={140}
                        label={renderCustomLabel}
                        labelLine={false}
                        fill="#8884d8"
                      >
                        {chartDataPie.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name]?.color || "#8884d8"} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </div>

              <div className='flex-1 overflow-auto'>
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
      </div>
    </Layout>
  )
}