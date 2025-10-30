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
    let maxIngresos = Math.max(...data.map(day => day.totalIngresos || 0));
    let maxEgresos = Math.max(...data.map(day => day.totalEgresos || 0));
    maxIngresos = maxIngresos * 1.1;
    maxEgresos = maxEgresos * 1.1;
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

  // Customization menu handlers
  const handleToggleCustomizationMenu = () => {
    setIsCustomizationMenuOpen(!isCustomizationMenuOpen);
  };

  const handleCloseCustomizationMenu = () => {
    setIsCustomizationMenuOpen(false);
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
        
        <div className="stats-chart-container">
          <div className="chart-header" style={{ width: '100%' }}>
            <div className="chart-navigation" style={{ width: '100%' }}>         
              <button 
                className="nav-button prev"
                onClick={handlePrevious}
                title={currentView === 'Semanal' ? 'Semana anterior' : 'Mes anterior'}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="nav-button"
                onClick={handleResetNavigation}
                title="Volver a la semana/mes actual"
              >
                <i className="fas fa-undo"></i>
              </button>
              <button 
                className="nav-button next"
                onClick={handleNext}
                title={currentView === 'Semanal' ? 'Próxima semana' : 'Próximo mes'}
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
            type={currentView === 'Semanal' ? 'week' : 'month'}
            className={currentView === 'Semanal' ? 'weekly-stats-chart' : 'monthly-stats-chart'}
            onDateClick={handleDateClick}
            saldo={saldo}
          />

          <ChartSummary data={currentData} saldo={saldo} />
        </div>
      </div>
    </div>
  )
}