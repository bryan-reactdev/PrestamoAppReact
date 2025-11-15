// frontend/src/pages/Admin/AdminEstadisticasDashboard.jsx
import Layout from '../../Layout'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, Cell, Pie, PieChart, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts"
import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { getCurrentDate, getWeekLabel, getMonthLabel, getMultiMonthLabel } from '../../utils/dateUtils'
import FormField from '../../components/Form/FormField'
import { useCreditoStore } from '../../stores/useCreditoStore'
import { useCuotaStore } from '../../stores/useCuotaStore'
import BaseTable from '../../components/Table/BaseTable'
import { formatCurrencySVWithSymbol } from '../../utils/currencyUtils'
import StatsChart from '../../components/Charts/StatsChart'
import ChartSummary from '../../components/Charts/ChartSummary'
import { getStatsColumns } from '../../components/Table/Stats/StatsTableDefinitions'
import StatsCard from '../../components/Card/Stats/StatsCard'
import { Button } from '../../components/ui/button'

export default function AdminEstadisticasDashboard() {
  const navigate = useNavigate();
  const { creditos, getCreditos, creditosForDate, setSelectedDate: setSelectedDateCredito } = useCreditoStore();
  const { 
    saldo, 
    getBalance, 
    currencyForDate, 
    currencyForRange, 
    getCurrencyForDate, 
    getCurrencyForRange, 
    selectedDate, 
    setSelectedDate,
    ingresosCapitales,
    cuotasPagadas,
    calcularTotal,
    getWeekData,
    getMonthData,
    getMultiMonthData,
    gastosEmpresa,
    cuotasTotales,
    getCuotasTotales,
    isFetchingBalance
  } = useCurrencyStore();
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
    getCuotasTotales();
  }, [getBalance, saldo, getCurrencyForDate, getCuotasTotales, selectedDate])

  useEffect(() => {
    getCuotas().then(() => {
      calcularProyeccion(selectedDate);
    });
  }, [getCuotas, calcularProyeccion, selectedDate, saldo])

  // Helper function to calculate max value from data
  const getMaxValue = (data) => {
    if (!data || data.length === 0) return 5000;
    let maxIngresosCapitales = Math.max(...data.map(day => day.totalIngresosCapitales || 0));
    let maxIngresos = Math.max(...data.map(day => day.totalIngresos || 0));
    let maxEgresos = Math.max(...data.map(day => day.totalEgresos || 0));
    maxIngresosCapitales = maxIngresosCapitales * 1.1;
    maxIngresos = maxIngresos * 1.1;
    maxEgresos = maxEgresos * 1.1;
    return Math.floor(Math.max(maxIngresosCapitales, maxIngresos, maxEgresos));
  };

  // Helper function to add IDs to data for table compatibility
  const addIdsToData = (data) => {
    return data.map((item, index) => ({
      ...item,
      id: item.id || `${item.date || index}-${index}`
    }));
  };

  // StatsChart data states
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [currentMultiMonthData, setCurrentMultiMonthData] = useState([]);
  const [statsChartView, setStatsChartView] = useState('Semanal'); // 'Semanal', 'Mensual', '3Meses', '6Meses', 'Anual'
  const [displayMode, setDisplayMode] = useState('chart'); // 'chart' or 'table'
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(5000);
  
  // Navigation state
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, etc.
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); // 0 = current month, -1 = previous month, etc.
  const [currentYearOffset, setCurrentYearOffset] = useState(0); // 0 = current year, -1 = previous year, etc.
  
  // Customization menu state
  const [isCustomizationMenuOpen, setIsCustomizationMenuOpen] = useState(false);
  const rangeMenuRef = useRef(null);

  // Generate StatsChart data
  useEffect(() => {
    if (ingresosCapitales && gastosEmpresa) {
      const weekData = getWeekData(currentWeekOffset);
      const monthData = getMonthData(currentMonthOffset);
      setCurrentWeekData(addIdsToData(weekData));
      setCurrentMonthData(addIdsToData(monthData));
      
      // Generate multi-month data based on view
      let multiMonthData = [];
      if (statsChartView === '3Meses') {
        multiMonthData = getMultiMonthData(3, currentMonthOffset, 0);
      } else if (statsChartView === '6Meses') {
        multiMonthData = getMultiMonthData(6, currentMonthOffset, 0);
      } else if (statsChartView === 'Anual') {
        // For yearly view, use year offset instead of month offset
        multiMonthData = getMultiMonthData(12, 0, currentYearOffset);
      }
      setCurrentMultiMonthData(addIdsToData(multiMonthData));
      
      // Auto-set max value based on current view
      let currentData = [];
      if (statsChartView === 'Semanal') {
        currentData = weekData;
      } else if (statsChartView === 'Mensual') {
        currentData = monthData;
      } else {
        currentData = multiMonthData;
      }
      setMaxValue(getMaxValue(currentData));
    }
  }, [ingresosCapitales, gastosEmpresa, getWeekData, getMonthData, getMultiMonthData, statsChartView, currentWeekOffset, currentMonthOffset, currentYearOffset])

  // Click outside to close customization menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rangeMenuRef.current && !rangeMenuRef.current.contains(event.target)) {
        setIsCustomizationMenuOpen(false);
      }
    };

    if (isCustomizationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomizationMenuOpen]);

  const [chartData, setChartData] = useState([
    { category: "Ingresos Capitales", value: 0 },
    { category: "Ingresos Varios", value: 0 },
    { category: "Abonos a Cuotas", value: 0 },
    { category: "Pagos de Cuotas", value: 0 },
  ])

  const [chartDataEgresos, setChartDataEgresos] = useState([
    { category: "Gastos de Empresa", value: 0 },
    { category: "Egresos Varios", value: 0 },
    { category: "Pago de Planillas", value: 0 },
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
      { category: "Pago de Planillas", value: currencyForDate?.egresosPagoPlanillas?.total || 0 },
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

  const [chartDataPieTipo, setChartDataPieTipo] = useState([
    { name: "rapi-cash", value: 0, totalMonto: 0 },
    { name: "prendario", value: 0, totalMonto: 0 },
    { name: "hipotecario", value: 0, totalMonto: 0 },
  ])

  useEffect(() => {
    const allCreditos = [
      ...(creditosForDate?.creditosAceptados || []),
      ...(creditosForDate?.creditosRechazados || [])
    ];

    const rapiCash = allCreditos.filter(c => c.tipo === 'rapi-cash');
    const rapiCashCount = rapiCash.length;
    const rapiCashTotal = rapiCash.reduce((sum, credito) => sum + (Number(credito.monto) || 0), 0);

    const prendarios = allCreditos.filter(c => c.tipo === 'prendario');
    const prendariosCount = prendarios.length;
    const prendariosTotal = prendarios.reduce((sum, credito) => sum + (Number(credito.monto) || 0), 0);

    const hipotecarios = allCreditos.filter(c => c.tipo === 'hipotecario');
    const hipotecariosCount = hipotecarios.length;
    const hipotecariosTotal = hipotecarios.reduce((sum, credito) => sum + (Number(credito.monto) || 0), 0);

    setChartDataPieTipo([
      { name: "rapi-cash", value: rapiCashCount, totalMonto: rapiCashTotal },
      { name: "prendario", value: prendariosCount, totalMonto: prendariosTotal },
      { name: "hipotecario", value: hipotecariosCount, totalMonto: hipotecariosTotal },
    ])
  }, [creditosForDate])

  // StatsChart handlers
  const handleMinChange = (value) => {
    setMinValue(value);
  };

  const handleMaxChange = (value) => {
    setMaxValue(value);
  };

  const handleReset = () => {
    setMinValue(0);
    let currentData = [];
    if (statsChartView === 'Semanal') {
      currentData = currentWeekData;
    } else if (statsChartView === 'Mensual') {
      currentData = currentMonthData;
    } else {
      currentData = currentMultiMonthData;
    }
    setMaxValue(getMaxValue(currentData));
  };

  const handleDateClick = (date, type) => {
    // Navigate to the appropriate page based on the clicked line type
    const targetPage = type === 'ingresos' ? '/admin/caja/ingresos' : '/admin/caja/egresos';
    navigate(`${targetPage}?date=${date}`);
  };

  // Check if there's data for the previous period
  const hasDataForPreviousPeriod = () => {
    if (!ingresosCapitales || !gastosEmpresa) return false;
    
    if (statsChartView === 'Semanal') {
      // Check if there's data for the previous week
      const prevWeekData = getWeekData(currentWeekOffset - 1);
      return prevWeekData && prevWeekData.length > 0 && prevWeekData.some(day => day.totalIngresosCapitales > 0 || day.totalIngresos > 0 || day.totalEgresos > 0);
    } else if (statsChartView === 'Mensual') {
      // Check if there's data for the previous month
      const prevMonthData = getMonthData(currentMonthOffset - 1);
      return prevMonthData && prevMonthData.length > 0 && prevMonthData.some(day => day.totalIngresosCapitales > 0 || day.totalIngresos > 0 || day.totalEgresos > 0);
    } else if (statsChartView === 'Anual') {
      // Check if there's data for the previous year
      const prevYearData = getMultiMonthData(12, 0, currentYearOffset - 1);
      return prevYearData && prevYearData.length > 0 && prevYearData.some(month => month.totalIngresosCapitales > 0 || month.totalIngresos > 0 || month.totalEgresos > 0);
    } else {
      // For 3 months and 6 months views, check if there's data for the previous period (3 or 6 months back)
      const numberOfMonths = statsChartView === '3Meses' ? 3 : 6;
      const prevMonthData = getMultiMonthData(numberOfMonths, currentMonthOffset - numberOfMonths, 0);
      return prevMonthData && prevMonthData.length > 0 && prevMonthData.some(month => month.totalIngresosCapitales > 0 || month.totalIngresos > 0 || month.totalEgresos > 0);
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    // Don't allow navigation if there's no data for the previous period
    if (!hasDataForPreviousPeriod()) return;
    
    if (statsChartView === 'Semanal') {
      setCurrentWeekOffset(prev => prev - 1);
    } else if (statsChartView === 'Anual') {
      setCurrentYearOffset(prev => prev - 1);
    } else if (statsChartView === '3Meses') {
      // Navigate 3 months at a time
      setCurrentMonthOffset(prev => prev - 3);
    } else if (statsChartView === '6Meses') {
      // Navigate 6 months at a time
      setCurrentMonthOffset(prev => prev - 6);
    } else {
      // Monthly view navigates 1 month at a time
      setCurrentMonthOffset(prev => prev - 1);
    }
  };

  const handleNext = () => {
    // Don't allow navigation into the future
    if (statsChartView === 'Semanal' && currentWeekOffset >= 0) return;
    if (statsChartView === 'Anual' && currentYearOffset >= 0) return;
    if ((statsChartView === 'Mensual' || statsChartView === '3Meses' || statsChartView === '6Meses') && currentMonthOffset >= 0) return;
    
    if (statsChartView === 'Semanal') {
      setCurrentWeekOffset(prev => prev + 1);
    } else if (statsChartView === 'Anual') {
      setCurrentYearOffset(prev => prev + 1);
    } else if (statsChartView === '3Meses') {
      // Navigate 3 months at a time
      setCurrentMonthOffset(prev => prev + 3);
    } else if (statsChartView === '6Meses') {
      // Navigate 6 months at a time
      setCurrentMonthOffset(prev => prev + 6);
    } else {
      // Monthly view navigates 1 month at a time
      setCurrentMonthOffset(prev => prev + 1);
    }
  };

  // Check if we can navigate to next period
  const canNavigateNext = () => {
    if (statsChartView === 'Semanal') return currentWeekOffset < 0;
    if (statsChartView === 'Anual') return currentYearOffset < 0;
    return currentMonthOffset < 0;
  };

  const handleResetNavigation = () => {
    setCurrentWeekOffset(0);
    setCurrentMonthOffset(0);
    setCurrentYearOffset(0);
  };

  // Customization menu handlers
  const handleToggleCustomizationMenu = () => {
    setIsCustomizationMenuOpen(!isCustomizationMenuOpen);
  };

  const handleCloseCustomizationMenu = () => {
    setIsCustomizationMenuOpen(false);
  };

  // Custom tab handler for view tabs
  const handleViewTabChange = (tab) => {
    setStatsChartView(tab.label);
  };

  // Tabs configuration
  const viewTabs = [
    {
      label: 'Semanal',
      icon: 'fas fa-calendar-week'
    },
    {
      label: 'Mensual',
      icon: 'fas fa-calendar-alt'
    },
    {
      label: '3Meses',
      icon: 'fas fa-calendar'
    },
    {
      label: '6Meses',
      icon: 'fas fa-calendar-days'
    },
    {
      label: 'Anual',
      icon: 'fas fa-calendar-check'
    }
  ];

  // Get current data and chart title based on view
  let currentStatsData = [];
  let chartTitle = '';
  
  if (statsChartView === 'Semanal') {
    currentStatsData = currentWeekData;
    chartTitle = getWeekLabel(currentWeekOffset);
  } else if (statsChartView === 'Mensual') {
    currentStatsData = currentMonthData;
    chartTitle = getMonthLabel(currentMonthOffset);
  } else if (statsChartView === '3Meses') {
    currentStatsData = currentMultiMonthData;
    chartTitle = getMultiMonthLabel(3, currentMonthOffset);
  } else if (statsChartView === '6Meses') {
    currentStatsData = currentMultiMonthData;
    chartTitle = getMultiMonthLabel(6, currentMonthOffset);
  } else if (statsChartView === 'Anual') {
    currentStatsData = currentMultiMonthData;
    chartTitle = getMultiMonthLabel(12, 0, currentYearOffset);
  }



  // Configuración de colores para los gráficos - TODOS EN AZUL OSCURO
  const chartConfig = useMemo(() => {
    return {
      saldo: { label: "Balance", color: "#fff" },
      value: { label: "Monto", color: "#fff" },
      valueEgresos: { label: "Monto", color: "#fff" },
      Aceptados: { label: "Aceptados", color: "#9c9e9cff" },
      Rechazados: { label: "Rechazados", color: "#132886ff" }, // red-400
      'rapi-cash': { label: "Rapi-Cash", color: "#9c9e9cff" },        // greenish (green-400)
      'prendario': { label: "Prendarios", color: "#132886ff" },       // orange (orange-400)
      'hipotecario': { label: "Hipotecarios", color: "#eef4f5ff" },   // blueish (cyan-400)
    };
  }, []);


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
        const isAceptado = estado === 'Aceptado';
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{
              backgroundColor: isAceptado ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.15)'
            }}
          >
            {estado}
          </span>
        );
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
          <span className='font-bold text-primary'>
            {formatCurrencySVWithSymbol(value)}
          </span>
        );
      }
    },
  ], []);

  // Métricas calculadas - usando valores globales en lugar de currencyForDate
  const recuperacionCalculada = useMemo(() => {
    const totalCuotasPagadas = (Array.isArray(cuotasPagadas) ? calcularTotal(cuotasPagadas) : 0) || 0;
    const totalIngresoACapital = (Array.isArray(ingresosCapitales) ? calcularTotal(ingresosCapitales) : 0) || 0;
    const capitalPendiente = totalIngresoACapital - totalCuotasPagadas;
    return Math.max(0, capitalPendiente);
  }, [cuotasPagadas, ingresosCapitales, calcularTotal]);

  const gananciaDespuesRecuperacion = useMemo(() => {
    const totalPorCobrar = (Number(cuotasTotales?.totalVencidas || 0) + Number(cuotasTotales?.totalPendientes || 0));
    const ganancia = totalPorCobrar - recuperacionCalculada;
    
    return Math.max(0, ganancia);
  }, [cuotasTotales, recuperacionCalculada]);

  const roiCalculado = useMemo(() => {
    const totalCuotasPagadas = (Array.isArray(cuotasPagadas) ? calcularTotal(cuotasPagadas) : 0) || 0;
    const totalIngresoACapital = (Array.isArray(ingresosCapitales) ? calcularTotal(ingresosCapitales) : 0) || 0;
    if (totalIngresoACapital > 0) {
      return ((totalCuotasPagadas - totalIngresoACapital) / totalIngresoACapital) * 100;
    }
    return 0;
  }, [cuotasPagadas, ingresosCapitales, calcularTotal]);

  // Componente de tarjeta métrica reutilizable
  const MetricCard = ({ title, value, subtitle, color = "blue", size = "md", children }) => {
    return (
      <div className={`border glass-card-inner p-4 h-full text-white`}>
        <h3 className="font-semibold mb-2 text-center text-sm">{title}</h3>
        {children || (
          <>
            <div className={`font-bold text-center text-white ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
              {value}
            </div>
            <div className="text-xs text-white/80 text-center mt-1">{subtitle}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="content space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center glass-card p-4 rounded-lg shadow-sm border">
          <h1 className="text-xl font-bold text-primary">Dashboard Financiero</h1>
          <div className="flex items-center gap-3">
            <FormField
              classNames={'simple'}
              label={'Fecha'}
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
            <Button className={`btn-glass`} variant="default" onClick={() => handleDateChange(getCurrentDate())}>
              <i className='fas fa-rotate' />
              HOY
            </Button>
          </div>
        </div>

        {/* ==================== SECCIÓN SUPERIOR: MÉTRICAS PRINCIPALES ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr_2fr] gap-4">

          {/* CARD 1: BALANCE CAJA CHICA */}
          <div className="glass-card p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Balance Caja Chica</h3>

            {/* Balance Principal */}
            <div className="glass-card-inner p-3 border mb-3">
              <div className="text-2xl font-bold text-white text-center">
                {currencyForDate?.balance?.saldo ? formatCurrencySVWithSymbol(currencyForDate.balance.saldo) : 'N/A'}
              </div>
              <div className="text-sm text-white/80 text-center">Saldo al {selectedDate}</div>
            </div>

            {/* Ingresos vs Egresos en grid 2x2 compacto */}
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card-inner p-2 border">
                <div className="text-xs font-semibold text-white text-center">Ingresos</div>
                <div className="text-sm font-bold text-white text-center">
                  {formatCurrencySVWithSymbol((currencyForDate?.ingresosCapitales?.total || 0) + (currencyForDate?.ingresosVarios?.total || 0))}
                </div>
              </div>
              <div className="glass-card-inner p-2 border">
                <div className="text-xs font-semibold text-white text-center">Egresos</div>
                <div className="text-sm font-bold text-white text-center">
                  {formatCurrencySVWithSymbol((currencyForDate?.gastosEmpresa?.total || 0) + (currencyForDate?.egresosVarios?.total || 0) + (currencyForDate?.egresosPagoPlanillas?.total || 0))}
                </div>
              </div>
              <div className="glass-card-inner p-2 border col-span-2">
                <div className="text-xs font-semibold text-white text-center">Indicador KPI</div>
                <div className="text-sm font-bold text-white text-center">
                  {formatCurrencySVWithSymbol(
                    ((currencyForDate?.ingresosCapitales?.total || 0) + (currencyForDate?.ingresosVarios?.total || 0)) -
                    ((currencyForDate?.gastosEmpresa?.total || 0) + (currencyForDate?.egresosVarios?.total || 0) + (currencyForDate?.egresosPagoPlanillas?.total || 0))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: INVERSIONES */}
          <div className="glass-card p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Inversión y Retornos</h3>

            {/* Grid 2x2 para métricas de inversión */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Capital Invertido"
                value={Array.isArray(ingresosCapitales) && calcularTotal(ingresosCapitales) ? formatCurrencySVWithSymbol(calcularTotal(ingresosCapitales)) : '$0.00'}
                color="blue"
                size="sm"
              />
              <MetricCard
                title="Retorno Obtenido"
                value={formatCurrencySVWithSymbol(Array.isArray(cuotasPagadas) ? calcularTotal(cuotasPagadas) : 0)}
                subtitle="Total cuotas pagadas"
                color="blue"
                size="sm"
              />
              <MetricCard
                title="Retorno Pendiente de Capital"
                value={formatCurrencySVWithSymbol(recuperacionCalculada)}
                subtitle="Capital pendiente"
                color="blue"
                size="sm"
              />
              <MetricCard
                title="Retorno Pendiente de Cuotas"
                value={formatCurrencySVWithSymbol((Number(cuotasTotales?.totalVencidas || 0) + Number(cuotasTotales?.totalPendientes || 0)))}
                subtitle="Pendientes + Vencidas"
                color="blue"
                size="sm"
              />
              <MetricCard
                title="Total de Cuotas"
                value={formatCurrencySVWithSymbol(
                  (Number(cuotasTotales?.totalVencidas || 0) + Number(cuotasTotales?.totalPendientes || 0)) + 
                  Number(cuotasTotales?.totalPagadas || 0)
                )}
                subtitle="Total a Cobrar + Pagadas"
                color="blue"
                size="sm"
              />
              <MetricCard
                title="Ganancia Proyectada de Cuotas"
                value={formatCurrencySVWithSymbol(gananciaDespuesRecuperacion)}
                subtitle="Proyectada"
                color="blue"
                size="sm"
              />
            </div>
          </div>

          {/* CARD 3: ROI */}
          <div className="glass-card p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">ROI</h3>

            {/* Grid para métricas de ROI */}
            <div className="grid grid-cols-1 gap-3">
              <MetricCard
                title="Capital Invertido"
                value={Array.isArray(ingresosCapitales) && calcularTotal(ingresosCapitales) ? formatCurrencySVWithSymbol(calcularTotal(ingresosCapitales)) : '$0.00'}
                color="blue"
                size="sm"
              />
              <MetricCard
                title="Retorno Obtenido"
                value={formatCurrencySVWithSymbol(Array.isArray(cuotasPagadas) ? calcularTotal(cuotasPagadas) : 0)}
                subtitle="Total cuotas pagadas"
                color="blue"
                size="sm"
              />
              <MetricCard
                title="ROI"
                value={`${Number(roiCalculado).toFixed(2)}%`}
                subtitle="Retorno de inversión"
                color="blue"
                size="sm"
              />
            </div>
          </div>

          {/* CARD 4: PROYECCIÓN DE CUOTAS */}
          <div className="glass-card p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Proyección de Cuotas</h3>
            {isFetchingProyeccion ? (
              <div className="text-center py-4">
                <span className="text-sm text-primary">Cargando...</span>
              </div>
            ) : proyeccionData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 glass-card-inner border">
                  <div>
                    <div className="text-sm font-semibold text-white">Cobradas</div>
                    <div className="text-xs text-white/80">{proyeccionData.cuotasCobradas?.cantidad || 0} cuotas</div>
                  </div>
                  <div className="text-white font-bold">
                    {formatCurrencySVWithSymbol(proyeccionData.cuotasCobradas?.montoTotal || 0)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 glass-card-inner border">
                  <div>
                    <div className="text-sm font-semibold text-white">Por Cobrar</div>
                    <div className="text-xs text-white/80">{proyeccionData.cuotasPorCobrar?.cantidad || 0} cuotas</div>
                  </div>
                  <div className="text-white font-bold">
                    {formatCurrencySVWithSymbol(proyeccionData.cuotasPorCobrar?.montoTotal || 0)}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 glass-card-inner border">
                  <div>
                    <div className="text-sm font-semibold text-white">Total General</div>
                    <div className="text-xs text-white/80">{proyeccionData.totalGeneral?.cantidad || 0} cuotas</div>
                  </div>
                  <div className="text-white font-bold">
                    {formatCurrencySVWithSymbol(proyeccionData.totalGeneral?.montoTotal || 0)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-sm text-primary">Sin datos disponibles</span>
              </div>
            )}
          </div>
        </div>

        {/* ==================== SECCIÓN MEDIA: GRÁFICOS PRINCIPALES (Evolución + Detalles) ==================== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Gráfico 1 de 3: Evolución del Balance */}
          <div className="glass-card p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Evolución del Balance</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full [&_.recharts-cartesian-axis-tick_text]:!fill-[rgba(255,255,255,0.85)]">
              <LineChart accessibilityLayer data={chartData2}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.15)" />
                <XAxis dataKey="fecha" tickLine={false} tickMargin={5} axisLine={true} tick={{ fill: 'rgba(255, 255, 255, 0.85)' }} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: "compact", compactDisplay: "short" })}`} tick={{ fill: 'rgba(255, 255, 255, 0.85)' }} />
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

          {/* Gráfico 2 de 3: Detalle de Ingresos */}
          <div className="glass-card p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Detalle de Ingresos</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full [&_.recharts-cartesian-axis-tick_text]:!fill-[rgba(255,255,255,0.85)]">
              <BarChart
                layout="vertical"
                accessibilityLayer
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.15)" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: "compact", compactDisplay: "short" })}`}
                  tick={{ fill: 'rgba(255, 255, 255, 0.85)' }}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={true}
                  width={100}
                  fontSize={12}
                  tick={{ fill: 'rgba(255, 255, 255, 0.85)' }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [formatCurrencySVWithSymbol(value)]}
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

          {/* Gráfico 3 de 3: Detalle de Egresos */}
          <div className="glass-card p-4 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Detalle de Egresos</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full [&_.recharts-cartesian-axis-tick_text]:!fill-[rgba(255,255,255,0.85)]">
              <BarChart
                layout="vertical"
                accessibilityLayer
                data={chartDataEgresos}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.15)" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={true}
                  tickFormatter={(value) => `$${value.toLocaleString('en-US', { notation: "compact", compactDisplay: "short" })}`}
                  tick={{ fill: 'rgba(255, 255, 255, 0.85)' }}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={true}
                  width={100}
                  fontSize={12}
                  tick={{ fill: 'rgba(255, 255, 255, 0.85)' }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [formatCurrencySVWithSymbol(value)]}
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

        {/* ==================== SECCIÓN MEDIA: GRÁFICO DE ESTADÍSTICAS ==================== */}
        <div className="glass-card p-4 rounded-lg shadow-sm border">
          <div className="stats-chart-container">
            <div className="chart-header" style={{ width: '100%' }}>
              <div className="chart-navigation" style={{ width: '100%' }}>         
                <button 
                  className="nav-button prev"
                  onClick={handlePrevious}
                  disabled={!hasDataForPreviousPeriod()}
                  title={statsChartView === 'Semanal' ? 'Semana anterior' : 'Período anterior'}
                  style={{ opacity: hasDataForPreviousPeriod() ? 1 : 0.5, cursor: hasDataForPreviousPeriod() ? 'pointer' : 'not-allowed' }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="nav-button"
                  onClick={handleResetNavigation}
                  title="Volver al período actual"
                >
                  <i className="fas fa-undo"></i>
                </button>
                <button 
                  className="nav-button next"
                  onClick={handleNext}
                  disabled={!canNavigateNext()}
                  title={statsChartView === 'Semanal' ? 'Próxima semana' : 'Próximo período'}
                  style={{ opacity: canNavigateNext() ? 1 : 0.5, cursor: canNavigateNext() ? 'pointer' : 'not-allowed' }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>

                <div className="customization-menu-container" ref={rangeMenuRef} style={{ marginLeft: 'auto' }}>
                  <button 
                    className="customization-menu-trigger"
                    onClick={handleToggleCustomizationMenu}
                    title="Personalizar vista"
                  >
                    <i className="fas fa-cog"></i>
                  </button>
                  
                  {isCustomizationMenuOpen && (
                    <div className="customization-menu">
                      <div className="customization-menu-header">
                        <h4>Personalizar Vista</h4>
                        <button 
                          className="close-menu-btn"
                          onClick={handleCloseCustomizationMenu}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      
                      {/* Display Mode Selection */}
                      <div className="customization-section">
                        <h5>Modo de Visualización</h5>
                        <div className="view-selection">
                          <button
                            className={`view-option ${displayMode === 'chart' ? 'active' : ''}`}
                            onClick={() => setDisplayMode('chart')}
                          >
                            <i className="fas fa-chart-line"></i>
                            Gráfico
                          </button>
                          <button
                            className={`view-option ${displayMode === 'table' ? 'active' : ''}`}
                            onClick={() => setDisplayMode('table')}
                          >
                            <i className="fas fa-table"></i>
                            Tabla
                          </button>
                        </div>
                      </div>
                      
                      {/* View Selection */}
                      <div className="customization-section">
                        <h5>Vista</h5>
                        <div className="view-selection">
                          {viewTabs.map((tab) => (
                            <button
                              key={tab.label}
                              className={`view-option ${statsChartView === tab.label ? 'active' : ''}`}
                              onClick={() => handleViewTabChange(tab)}
                            >
                              <i className={tab.icon}></i>
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Range Controls - Only show for chart mode */}
                      {displayMode === 'chart' && (
                        <div className="customization-section">
                          <h5>Rango de Valores</h5>
                          <div className="range-inputs">
                            <div className="range-input-group">
                              <label>Valor Mínimo</label>
                              <input
                                type="number"
                                value={minValue}
                                onChange={(e) => handleMinChange(Number(e.target.value))}
                                min="0"
                                step="100"
                              />
                            </div>
                            
                            <div className="range-input-group">
                              <label>Valor Máximo</label>
                              <input
                                type="number"
                                value={maxValue}
                                onChange={(e) => handleMaxChange(Number(e.target.value))}
                                min="1000"
                                step="100"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {displayMode === 'chart' && (
                        <div className="customization-menu-actions">
                          <button 
                            className="reset-customization-btn"
                            onClick={handleReset}
                          >
                            <i className="fas fa-undo"></i>
                            Resetear Rango
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <h3 className="text-primary">{chartTitle}</h3>

            {displayMode === 'chart' ? (
              <>
                <StatsChart
                  data={currentStatsData}
                  minValue={minValue}
                  maxValue={maxValue}
                  type={statsChartView === 'Semanal' ? 'week' : (statsChartView === 'Mensual' ? 'month' : 'multiMonth')}
                  className={statsChartView === 'Semanal' ? 'weekly-stats-chart' : (statsChartView === 'Mensual' ? 'monthly-stats-chart' : 'multimonth-stats-chart')}
                  onDateClick={handleDateClick}
                  saldo={saldo}
                />
                <ChartSummary data={currentStatsData} saldo={saldo} viewType={statsChartView} />
              </>
            ) : (
              <>
                <BaseTable
                  data={currentStatsData}
                  columns={getStatsColumns(statsChartView === 'Semanal' ? 'week' : (statsChartView === 'Mensual' ? 'month' : 'multiMonth'))}
                  card={(props) => <StatsCard {...props} viewType={statsChartView === 'Semanal' ? 'week' : (statsChartView === 'Mensual' ? 'month' : 'multiMonth')} />}
                  centered={['date', 'totalIngresosCapitales', 'totalIngresos', 'totalEgresos', 'balance', 'historialBalance']}
                  loading={isFetchingBalance}
                  hideSearch={true}
                  hidePagination={false}
                  onRowSelect={(row) => {
                    const type = row.totalEgresos > 0 ? 'egresos' : 'ingresos';
                    handleDateClick(row.date, type);
                  }}
                />
                <ChartSummary data={currentStatsData} saldo={saldo} viewType={statsChartView} />
              </>
            )}
          </div>
        </div>
        
        {/* ==================== SECCIÓN INFERIOR: DISTRIBUCIONES POR ESTADO Y TIPO ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Gráfico: Distribución por Estado */}
          <div className="glass-card p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Distribución por Estado (Aceptados/Rechazados)</h3>
            {chartDataPieEstado.every(entry => entry.value === 0) ? (
              <div className="flex items-center justify-center h-96 text-primary">
                <p className="text-lg">No hay datos de estado</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-96 w-full">
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
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value, payload }) => {
                      if (value === 0) return null;
                      
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.35;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const anchor = x > cx ? 'start' : 'end';
                      
                      const label = chartConfig[name]?.label || name;
                      const totalMonto = payload?.totalMonto || 0;
                      
                      // Calculate total for percentage
                      const total = chartDataPieEstado.reduce((sum, entry) => sum + entry.value, 0);
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                      
                      return (
                        <g>
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor={anchor}
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {label}
                          </text>
                          <text
                            x={x}
                            y={y + 14}
                            fill="#fff"
                            textAnchor={anchor}
                            dominantBaseline="central"
                            fontSize={10}
                            strokeWidth={0.5}
                          >
                            {value} crédito{value !== 1 ? 's' : ''} ({percentage}%)
                          </text>
                          <text
                            x={x}
                            y={y + 28}
                            fill="#fff"
                            textAnchor={anchor}
                            dominantBaseline="central"
                            fontSize={10}
                            strokeWidth={0.5}
                          >
                            {formatCurrencySVWithSymbol(totalMonto)}
                          </text>
                        </g>
                      );
                    }}
                    labelLine={false}
                  >
                    {chartDataPieEstado.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name]?.color || "#1e3a8a"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>

          {/* Gráfico: Distribución por Tipo */}
          <div className="glass-card p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3 text-center text-primary">Distribución por Tipo de Crédito</h3>
            {chartDataPieTipo.every(entry => entry.value === 0) ? (
              <div className="flex items-center justify-center h-96 text-primary">
                <p className="text-lg">No hay datos de tipos de crédito</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-96 w-full">
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
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value, payload }) => {
                      if (value === 0) return null;
                      
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.35;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const anchor = x > cx ? 'start' : 'end';
                      
                      const label = chartConfig[name]?.label || name;
                      const totalMonto = payload?.totalMonto || 0;
                      
                      // Calculate total for percentage
                      const total = chartDataPieTipo.reduce((sum, entry) => sum + entry.value, 0);
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                      
                      return (
                        <g>
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor={anchor}
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {label}
                          </text>
                          <text
                            x={x}
                            y={y + 14}
                            fill="#fff"
                            textAnchor={anchor}
                            dominantBaseline="central"
                            fontSize={10}
                            strokeWidth={0.5}
                          >
                            {value} crédito{value !== 1 ? 's' : ''} ({percentage}%)
                          </text>
                          <text
                            x={x}
                            y={y + 28}
                            fill="#fff"
                            textAnchor={anchor}
                            dominantBaseline="central"
                            fontSize={10}
                            strokeWidth={0.5}
                          >
                            {formatCurrencySVWithSymbol(totalMonto)}
                          </text>
                        </g>
                      );
                    }}
                    labelLine={false}
                  >
                    {chartDataPieTipo.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name]?.color || "#1e3a8a"} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>
        </div>

        {/* ==================== TABLA DE CRÉDITOS - AGRUPADA ==================== */}
        <div className="glass-card p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 text-center text-primary">Resumen de Solicitudes de Crédito por Tipo y Estado</h3>
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