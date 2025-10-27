import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { abonosColumns, ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import FormField from '../../components/Form/FormField'
import { getCurrentDate } from '../../utils/dateUtils'
import TotalCard from '../../components/Cards/TotalCard'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { cuotasPagadasColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import { IngresoEgresoCard } from '../../components/Card/Currency/CurrencyCardDefinitions'
import { ButtonPDF } from '../../components/Content/Layout/Stats/StatButtons'
import { CuotasPagadasCard } from '../../components/Card/Cuota/CuotaCardDefinitions'

export default function AdminIngresos(){
  const {saldo, getBalance, currencyForDate, selectedDate, setSelectedDate, getCurrencyForDate, isFetchingBalance} = useCurrencyStore();
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance])

  // Handle date query parameter
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
    }
  }, [searchParams, setSelectedDate]);

  // Calculation on update
  useEffect(() => {
    getCurrencyForDate();
  }, [saldo, selectedDate])

  // Definición de las columnas que estarán centradas
  const centered = ['fecha', 'monto', 'credito', 'fechaCuota', 'fechaAbono', 'fechaVencimiento', 'fechaPagado', 'mora', 'abono', 'total', 'accion']

  const tabs = [
    { icon: 'fas fa-building', label: 'Ingresos Capitales', iconBgColor: 'accent-light', value: currencyForDate.ingresosCapitales?.total},
    { icon: 'fas fa-coins', label: 'Ingresos Varios', data: currencyForDate.ingresosVarios?.data ?? [], iconBgColor: 'warning', value: currencyForDate.ingresosVarios?.total},
    { icon: 'fas fa-money-bill', label: 'Abonos a Cuotas', columnDefinitions: abonosColumns, data: currencyForDate.cuotasAbonos?.data ?? [], value: currencyForDate.cuotasAbonos?.total},
    { icon: 'fas fa-wallet', label: 'Cuotas Pagadas', columnDefinitions: cuotasPagadasColumns, card: CuotasPagadasCard, data: currencyForDate.cuotasPagadas?.data ?? [], iconBgColor: 'success-light', value: currencyForDate.cuotasPagadas?.total},
  ];

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'caja'}/>

      <div className="content">
        <ContentTitleWithInfo>
          <TotalCard icon={'fas fa-chart-line'} color="accent" title={'Ingresos Totales'} style={{padding: 0}}>
              <i className='fas fa-dollar-sign color-success'/>
              <h3 className='color-success'>{currencyForDate.totalIngresos}</h3>
          </TotalCard>
        </ContentTitleWithInfo>
        
        <div className="date-controls">
          <FormField
            classNames={'simple'}
            label={'Fecha'} 
            type="date"
            value={selectedDate.split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          
          <button 
            className='btn-primary sm' 
            onClick={() => setSelectedDate(getCurrentDate())}
          >
            <i className='fas fa-rotate'/>
            IR A HOY
          </button>
        </div>

        <BaseTable 
          data={currencyForDate.ingresosCapitales?.data ?? []} 
          columns={ingresoEgresoColumns} 
          card={IngresoEgresoCard}
          centered={centered} 
          flexable={['motivo', 'usuario']}
          loading={isFetchingBalance}
          customHeaderHeight={50}
          tabs={tabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCardTabs={true}
        >
          <ButtonPDF tipo={'ingreso'}/>
        </BaseTable>
      </div>
      
    </div>
  )
}