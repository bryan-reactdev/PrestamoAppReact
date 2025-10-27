import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import StatsChart from '../../components/Charts/StatsChart'
import ChartRangeControls from '../../components/Charts/ChartRangeControls'
import ChartSummary from '../../components/Charts/ChartSummary'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'

export default function AdminEstadisticas(){
  const {
    saldo, 
    getBalance, 
    getWeekData, 
    getMonthData,
    isFetchingBalance, 
    ingresosCapitales, 
    gastosEmpresa
  } = useCurrencyStore();
  
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('week'); // 'week' or 'month'
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(5000);

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance, saldo])

  // Helper function to calculate max value from data
  const getMaxValue = (data) => {
    if (!data || data.length === 0) return 5000;
    const maxIngresos = Math.max(...data.map(day => day.totalIngresos || 0));
    const maxEgresos = Math.max(...data.map(day => day.totalEgresos || 0));
    return Math.max(maxIngresos, maxEgresos);
  };

  // Generate data and auto-set max value when data loads
  useEffect(() => {
    if (ingresosCapitales && gastosEmpresa) {
      const weekData = getWeekData();
      const monthData = getMonthData();
      setCurrentWeekData(weekData);
      setCurrentMonthData(monthData);
      
      // Auto-set max value based on current view
      const currentData = currentView === 'week' ? weekData : monthData;
      setMaxValue(getMaxValue(currentData));
    }
  }, [ingresosCapitales, gastosEmpresa, getWeekData, getMonthData, currentView]);

  const handleMinChange = (value) => {
    setMinValue(value);
  };

  const handleMaxChange = (value) => {
    setMaxValue(value);
  };

  const handleReset = () => {
    setMinValue(0);
    const currentData = currentView === 'week' ? currentWeekData : currentMonthData;
    setMaxValue(getMaxValue(currentData));
  };

  const handleDateClick = (date, type) => {
    // Navigate to the appropriate page based on the clicked line type
    const targetPage = type === 'ingresos' ? '/admin/caja/ingresos' : '/admin/caja/egresos';
    navigate(`${targetPage}?date=${date}`);
  };

  const currentData = currentView === 'week' ? currentWeekData : currentMonthData;
  const chartTitle = currentView === 'week' ? 'Semana Actual' : 'Mes Actual';
  const pageTitle = currentView === 'week' ? 'Estadísticas Semanales' : 'Estadísticas Mensuales';
  const pageSubtitle = currentView === 'week' ? 'Ingresos y Egresos de la Semana Actual' : 'Ingresos y Egresos del Mes Actual';

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'caja'}/>

      <div className="content">
        <ContentTitle 
          title={pageTitle} 
          subtitle={pageSubtitle}
        />
        
        <div className="view-tabs">
          <button 
            className={`view-tab ${currentView === 'week' ? 'active' : ''}`}
            onClick={() => setCurrentView('week')}
          >
            <i className="fas fa-calendar-week"></i>
            Semanal
          </button>
          <button 
            className={`view-tab ${currentView === 'month' ? 'active' : ''}`}
            onClick={() => setCurrentView('month')}
          >
            <i className="fas fa-calendar-alt"></i>
            Mensual
          </button>
        </div>
        
        <ChartRangeControls
          minValue={minValue}
          maxValue={maxValue}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
          onReset={handleReset}
        />
        
        <div className="stats-chart-container">
          <div className="chart-header">
            <h3>{chartTitle}</h3>
          </div>

          <StatsChart
            data={currentData}
            minValue={minValue}
            maxValue={maxValue}
            type={currentView}
            className={currentView === 'week' ? 'weekly-stats-chart' : 'monthly-stats-chart'}
            onDateClick={handleDateClick}
          />

          <ChartSummary data={currentData} />
        </div>
      </div>
    </div>
  )
}