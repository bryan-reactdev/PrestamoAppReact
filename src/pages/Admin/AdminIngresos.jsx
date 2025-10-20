import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { abonosColumns, cuotasPagadasIngresoColumns, ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import { CreditosRechazadosCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import FormField from '../../components/Form/FormField'
import { getCurrentDate } from '../../utils/dateUtils'
import TotalCard from '../../components/Cards/TotalCard'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'

export default function AdminIngresos(){
  const {saldo, getBalance, currencyForDate, selectedDate, setSelectedDate, getCurrencyForDate, isFetchingBalance} = useCurrencyStore();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance])

  // Calculation on update
  useEffect(() => {
    getCurrencyForDate();
  }, [saldo])

  // Definición de las columnas que estarán centradas
  const centered = ['fecha', 'monto', 'credito', 'fechaCuota', 'fechaAbono', 'fechaVencimiento', 'fechaPagado', 'mora', 'abono', 'total']

  const tabs = [
    { icon: 'fas fa-building', label: 'Ingresos Capitales', iconBgColor: 'accent-light', value: currencyForDate.ingresosCapitales?.total},
    { icon: 'fas fa-coins', label: 'Ingresos Varios', data: currencyForDate.ingresosVarios?.data ?? [], iconBgColor: 'warning', value: currencyForDate.ingresosVarios?.total},
    { icon: 'fas fa-money-bill', label: 'Abonos a Cuotas', columnDefinitions: abonosColumns, data: currencyForDate.cuotasAbonos?.data ?? [], value: currencyForDate.cuotasAbonos?.total},
    { icon: 'fas fa-wallet', label: 'Cuotas Pagadas', columnDefinitions: cuotasPagadasIngresoColumns, data: currencyForDate.cuotasPagadas?.data ?? [], iconBgColor: 'success-light', value: currencyForDate.cuotasPagadas?.total},
  ];

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'caja'}/>

      <div className="content">
        <ContentTitleWithInfo title={'Ingresos'} subtitle={'Gestión de Ingresos'}>
          <TotalCard icon={'fas fa-chart-line'} color="accent" title={'Ingresos Totales'} style={{padding: 0}}>
              <i className='fas fa-dollar-sign color-accent'/>
              <h3 className='color-accent'>{currencyForDate.totalIngresos}</h3>
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
          card={CreditosRechazadosCard}
          centered={centered} 
          flexable={['motivo', 'usuario']}
          loading={isFetchingBalance}
          customHeaderHeight={50}
          tabs={tabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCardTabs={true}
        />
      </div>
      
    </div>
  )
}