import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import StatsChart from '../../components/Charts/StatsChart'
import ChartSummary from '../../components/Charts/ChartSummary'

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { getWeekLabel, getMonthLabel } from '../../utils/dateUtils'

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
  const [currentView, setCurrentView] = useState('Semanal'); // 'Semanal' or 'Mensual'
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(5000);
  
  // Navigation state
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, etc.
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); // 0 = current month, -1 = previous month, etc.
  
  // Range controls state
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);
  const rangeMenuRef = useRef(null);

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


  // Generate data and auto-set max value when data loads or navigation changes
  useEffect(() => {
    if (ingresosCapitales && gastosEmpresa) {
      const weekData = getWeekData(currentWeekOffset);
      const monthData = getMonthData(currentMonthOffset);
      setCurrentWeekData(weekData);
      setCurrentMonthData(monthData);
      
      // Auto-set max value based on current view
      const currentData = currentView === 'Semanal' ? weekData : monthData;
      setMaxValue(getMaxValue(currentData));
    }
  }, [ingresosCapitales, gastosEmpresa, getWeekData, getMonthData, currentView, currentWeekOffset, currentMonthOffset]);

  // Click outside to close range menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rangeMenuRef.current && !rangeMenuRef.current.contains(event.target)) {
        setIsRangeMenuOpen(false);
      }
    };

    if (isRangeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRangeMenuOpen]);

  const handleMinChange = (value) => {
    setMinValue(value);
  };

  const handleMaxChange = (value) => {
    setMaxValue(value);
  };

  const handleReset = () => {
    setMinValue(0);
    const currentData = currentView === 'Semanal' ? currentWeekData : currentMonthData;
    setMaxValue(getMaxValue(currentData));
  };

  const handleDateClick = (date, type) => {
    // Navigate to the appropriate page based on the clicked line type
    const targetPage = type === 'ingresos' ? '/admin/caja/ingresos' : '/admin/caja/egresos';
    navigate(`${targetPage}?date=${date}`);
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentView === 'Semanal') {
      setCurrentWeekOffset(prev => prev - 1);
    } else {
      setCurrentMonthOffset(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentView === 'Semanal') {
      setCurrentWeekOffset(prev => prev + 1);
    } else {
      setCurrentMonthOffset(prev => prev + 1);
    }
  };

  const handleResetNavigation = () => {
    setCurrentWeekOffset(0);
    setCurrentMonthOffset(0);
  };

  // Range menu handlers
  const handleToggleRangeMenu = () => {
    setIsRangeMenuOpen(!isRangeMenuOpen);
  };

  const handleCloseRangeMenu = () => {
    setIsRangeMenuOpen(false);
  };


  const currentData = currentView === 'Semanal' ? currentWeekData : currentMonthData;
  const chartTitle = currentView === 'Semanal' ? getWeekLabel(currentWeekOffset) : getMonthLabel(currentMonthOffset);
  const pageTitle = currentView === 'Semanal' ? 'Estadísticas Semanales' : 'Estadísticas Mensuales';
  const pageSubtitle = currentView === 'Semanal' ? 'Ingresos y Egresos por Semana' : 'Ingresos y Egresos por Mes';

  // Custom tab handler for view tabs
  const handleViewTabChange = (tab) => {
    setCurrentView(tab.label);
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
    }
  ];

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'caja'}/>

      <div className="content">
        <ContentTitle 
          title={pageTitle} 
          subtitle={pageSubtitle}
        />
        
        <div className="tabs-container" style={{ marginBottom: 'var(--space-sm)' }}>
          {viewTabs.map((tab) => (
            <button
              key={tab.label}
              className={currentView === tab.label ? 'active-tab' : 'inactive-tab'}
              onClick={() => handleViewTabChange(tab)}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="stats-chart-container">
          <div className="chart-header">
            <div className="chart-navigation">
              <button 
                className="nav-button prev"
                onClick={handlePrevious}
                title={currentView === 'Semanal' ? 'Semana anterior' : 'Mes anterior'}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <h3>{chartTitle}</h3>
              
              <button 
                className="nav-button next"
                onClick={handleNext}
                title={currentView === 'Semanal' ? 'Próxima semana' : 'Próximo mes'}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="chart-actions">
              <button 
                className="reset-nav-button"
                onClick={handleResetNavigation}
                title="Volver a la semana/mes actual"
              >
                <i className="fas fa-undo"></i>
                <span>Actual</span>
              </button>
              
              <div className="range-menu-container" ref={rangeMenuRef}>
                <button 
                  className="range-menu-trigger"
                  onClick={handleToggleRangeMenu}
                  title="Configurar rango de valores"
                >
                  <i className="fas fa-filter"></i>
                </button>
                
                {isRangeMenuOpen && (
                  <div className="range-menu">
                    <div className="range-menu-header">
                      <h4>Configurar Rango</h4>
                      <button 
                        className="close-menu-btn"
                        onClick={handleCloseRangeMenu}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    
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
                    
                    <div className="range-menu-actions">
                      <button 
                        className="reset-range-btn"
                        onClick={handleReset}
                      >
                        <i className="fas fa-undo"></i>
                        Resetear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <StatsChart
            data={currentData}
            minValue={minValue}
            maxValue={maxValue}
            type={currentView === 'Semanal' ? 'week' : 'month'}
            className={currentView === 'Semanal' ? 'weekly-stats-chart' : 'monthly-stats-chart'}
            onDateClick={handleDateClick}
          />

          <ChartSummary data={currentData} />
        </div>
      </div>
    </div>
  )
}