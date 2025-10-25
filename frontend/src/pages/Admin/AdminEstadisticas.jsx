import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import WeeklyStatsChart from '../../components/Charts/WeeklyStatsChart'
import ChartRangeControls from '../../components/Charts/ChartRangeControls'
import ChartSummary from '../../components/Charts/ChartSummary'

import { useEffect, useState } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'

export default function AdminEstadisticas(){
  const {
    saldo, 
    getBalance, 
    getWeekData, 
    isFetchingBalance, 
    ingresosCapitales, 
    gastosEmpresa
  } = useCurrencyStore();
  
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(10000);

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance, saldo])

  // Generate current week data when all data is loaded
  useEffect(() => {
    if (ingresosCapitales && gastosEmpresa) {
      const weekData = getWeekData();
      setCurrentWeekData(weekData);
    }
  }, [ingresosCapitales, gastosEmpresa, getWeekData]);

  const handleMinChange = (value) => {
    setMinValue(value);
  };

  const handleMaxChange = (value) => {
    setMaxValue(value);
  };

  const handleReset = () => {
    setMinValue(0);
    setMaxValue(10000);
  };

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'caja'}/>

      <div className="content">
        <ContentTitle 
          title={'Estadísticas Semanales'} 
          subtitle={'Ingresos y Egresos de la Semana Actual'}
        />
        
        <ChartRangeControls
          minValue={minValue}
          maxValue={maxValue}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
          onReset={handleReset}
        />
        
        <div className="stats-chart-container">
          <div className="chart-header">
            <h3>Semana Actual</h3>
          </div>

          <WeeklyStatsChart
            data={currentWeekData}
            minValue={minValue}
            maxValue={maxValue}
          />

          <ChartSummary data={currentWeekData} />
        </div>
      </div>
    </div>
  )
}