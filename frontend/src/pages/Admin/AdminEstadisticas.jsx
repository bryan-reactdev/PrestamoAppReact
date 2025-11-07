import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import StatsChart from '../../components/Charts/StatsChart'
import ChartSummary from '../../components/Charts/ChartSummary'

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { getWeekLabel, getMonthLabel, getMultiMonthLabel } from '../../utils/dateUtils'
import Layout from '../../Layout'

export default function AdminEstadisticas(){
  const {
    saldo, 
    getBalance, 
    getWeekData, 
    getMonthData,
    getMultiMonthData,
    isFetchingBalance, 
    ingresosCapitales, 
    gastosEmpresa
  } = useCurrencyStore();
  
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('Semanal'); // 'Semanal', 'Mensual', '3Meses', '6Meses', 'Anual'
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [currentMultiMonthData, setCurrentMultiMonthData] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(5000);
  
  // Navigation state
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, etc.
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); // 0 = current month, -1 = previous month, etc.
  const [currentYearOffset, setCurrentYearOffset] = useState(0); // 0 = current year, -1 = previous year, etc.
  
  // Customization menu state
  const [isCustomizationMenuOpen, setIsCustomizationMenuOpen] = useState(false);
  const rangeMenuRef = useRef(null);

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance, saldo])

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


  // Generate data and auto-set max value when data loads or navigation changes
  useEffect(() => {
    if (ingresosCapitales && gastosEmpresa) {
      const weekData = getWeekData(currentWeekOffset);
      const monthData = getMonthData(currentMonthOffset);
      setCurrentWeekData(weekData);
      setCurrentMonthData(monthData);
      
      // Generate multi-month data based on view
      let multiMonthData = [];
      if (currentView === '3Meses') {
        multiMonthData = getMultiMonthData(3, currentMonthOffset, 0);
      } else if (currentView === '6Meses') {
        multiMonthData = getMultiMonthData(6, currentMonthOffset, 0);
      } else if (currentView === 'Anual') {
        // For yearly view, use year offset instead of month offset
        multiMonthData = getMultiMonthData(12, 0, currentYearOffset);
      }
      setCurrentMultiMonthData(multiMonthData);
      
      // Auto-set max value based on current view
      let currentData = [];
      if (currentView === 'Semanal') {
        currentData = weekData;
      } else if (currentView === 'Mensual') {
        currentData = monthData;
      } else {
        currentData = multiMonthData;
      }
      setMaxValue(getMaxValue(currentData));
    }
  }, [ingresosCapitales, gastosEmpresa, getWeekData, getMonthData, getMultiMonthData, currentView, currentWeekOffset, currentMonthOffset, currentYearOffset]);

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

  const handleMinChange = (value) => {
    setMinValue(value);
  };

  const handleMaxChange = (value) => {
    setMaxValue(value);
  };

  const handleReset = () => {
    setMinValue(0);
    let currentData = [];
    if (currentView === 'Semanal') {
      currentData = currentWeekData;
    } else if (currentView === 'Mensual') {
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
    
      if (currentView === 'Semanal') {
      // Check if there's data for the previous week
      const prevWeekData = getWeekData(currentWeekOffset - 1);
      return prevWeekData && prevWeekData.length > 0 && prevWeekData.some(day => day.totalIngresosCapitales > 0 || day.totalIngresos > 0 || day.totalEgresos > 0);
    } else if (currentView === 'Mensual') {
      // Check if there's data for the previous month
      const prevMonthData = getMonthData(currentMonthOffset - 1);
      return prevMonthData && prevMonthData.length > 0 && prevMonthData.some(day => day.totalIngresosCapitales > 0 || day.totalIngresos > 0 || day.totalEgresos > 0);
    } else if (currentView === 'Anual') {
      // Check if there's data for the previous year
      const prevYearData = getMultiMonthData(12, 0, currentYearOffset - 1);
      return prevYearData && prevYearData.length > 0 && prevYearData.some(month => month.totalIngresosCapitales > 0 || month.totalIngresos > 0 || month.totalEgresos > 0);
    } else {
      // For 3 months and 6 months views, check if there's data for the previous period (3 or 6 months back)
      const numberOfMonths = currentView === '3Meses' ? 3 : 6;
      const prevMonthData = getMultiMonthData(numberOfMonths, currentMonthOffset - numberOfMonths, 0);
      return prevMonthData && prevMonthData.length > 0 && prevMonthData.some(month => month.totalIngresosCapitales > 0 || month.totalIngresos > 0 || month.totalEgresos > 0);
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    // Don't allow navigation if there's no data for the previous period
    if (!hasDataForPreviousPeriod()) return;
    
    if (currentView === 'Semanal') {
      setCurrentWeekOffset(prev => prev - 1);
    } else if (currentView === 'Anual') {
      setCurrentYearOffset(prev => prev - 1);
    } else if (currentView === '3Meses') {
      // Navigate 3 months at a time
      setCurrentMonthOffset(prev => prev - 3);
    } else if (currentView === '6Meses') {
      // Navigate 6 months at a time
      setCurrentMonthOffset(prev => prev - 6);
    } else {
      // Monthly view navigates 1 month at a time
      setCurrentMonthOffset(prev => prev - 1);
    }
  };

  const handleNext = () => {
    // Don't allow navigation into the future
    if (currentView === 'Semanal' && currentWeekOffset >= 0) return;
    if (currentView === 'Anual' && currentYearOffset >= 0) return;
    if ((currentView === 'Mensual' || currentView === '3Meses' || currentView === '6Meses') && currentMonthOffset >= 0) return;
    
    if (currentView === 'Semanal') {
      setCurrentWeekOffset(prev => prev + 1);
    } else if (currentView === 'Anual') {
      setCurrentYearOffset(prev => prev + 1);
    } else if (currentView === '3Meses') {
      // Navigate 3 months at a time
      setCurrentMonthOffset(prev => prev + 3);
    } else if (currentView === '6Meses') {
      // Navigate 6 months at a time
      setCurrentMonthOffset(prev => prev + 6);
    } else {
      // Monthly view navigates 1 month at a time
      setCurrentMonthOffset(prev => prev + 1);
    }
  };

  // Check if we can navigate to next period
  const canNavigateNext = () => {
    if (currentView === 'Semanal') return currentWeekOffset < 0;
    if (currentView === 'Anual') return currentYearOffset < 0;
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

  // Get current data based on view
  let currentData = [];
  let chartTitle = '';
  let pageTitle = '';
  let pageSubtitle = '';
  
  if (currentView === 'Semanal') {
    currentData = currentWeekData;
    chartTitle = getWeekLabel(currentWeekOffset);
    pageTitle = 'Estadísticas Semanales';
    pageSubtitle = 'Ingresos y Egresos por Semana';
  } else if (currentView === 'Mensual') {
    currentData = currentMonthData;
    chartTitle = getMonthLabel(currentMonthOffset);
    pageTitle = 'Estadísticas Mensuales';
    pageSubtitle = 'Ingresos y Egresos por Mes';
  } else if (currentView === '3Meses') {
    currentData = currentMultiMonthData;
    chartTitle = getMultiMonthLabel(3, currentMonthOffset);
    pageTitle = 'Estadísticas - 3 Meses';
    pageSubtitle = 'Ingresos y Egresos por Mes (3 meses)';
  } else if (currentView === '6Meses') {
    currentData = currentMultiMonthData;
    chartTitle = getMultiMonthLabel(6, currentMonthOffset);
    pageTitle = 'Estadísticas - 6 Meses';
    pageSubtitle = 'Ingresos y Egresos por Mes (6 meses)';
  } else if (currentView === 'Anual') {
    currentData = currentMultiMonthData;
    chartTitle = getMultiMonthLabel(12, 0, currentYearOffset);
    pageTitle = 'Estadísticas Anuales';
    pageSubtitle = 'Ingresos y Egresos por Mes (12 meses)';
  }

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

  return(
    <Layout>
      <div className="content">
        <ContentTitle 
          title={pageTitle} 
          subtitle={pageSubtitle}
        />
        
        <div className="stats-chart-container">
          <div className="chart-header" style={{ width: '100%' }}>
            <div className="chart-navigation" style={{ width: '100%' }}>         
              <button 
                className="nav-button prev"
                onClick={handlePrevious}
                disabled={!hasDataForPreviousPeriod()}
                title={currentView === 'Semanal' ? 'Semana anterior' : 'Período anterior'}
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
                title={currentView === 'Semanal' ? 'Próxima semana' : 'Próximo período'}
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
                    
                    {/* View Selection */}
                    <div className="customization-section">
                      <h5>Vista</h5>
                      <div className="view-selection">
                        {viewTabs.map((tab) => (
                          <button
                            key={tab.label}
                            className={`view-option ${currentView === tab.label ? 'active' : ''}`}
                            onClick={() => handleViewTabChange(tab)}
                          >
                            <i className={tab.icon}></i>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Range Controls */}
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
                    
                    <div className="customization-menu-actions">
                      <button 
                        className="reset-customization-btn"
                        onClick={handleReset}
                      >
                        <i className="fas fa-undo"></i>
                        Resetear Rango
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
                          
          </div>
          
          <h3>{chartTitle}</h3>

          <StatsChart
            data={currentData}
            minValue={minValue}
            maxValue={maxValue}
            type={currentView === 'Semanal' ? 'week' : (currentView === 'Mensual' ? 'month' : 'multiMonth')}
            className={currentView === 'Semanal' ? 'weekly-stats-chart' : (currentView === 'Mensual' ? 'monthly-stats-chart' : 'multimonth-stats-chart')}
            onDateClick={handleDateClick}
            saldo={saldo}
          />

          <ChartSummary data={currentData} saldo={saldo} viewType={currentView} />
        </div>
      </div>
    </Layout>
  )
}