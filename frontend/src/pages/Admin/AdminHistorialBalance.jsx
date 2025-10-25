import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import BaseTable from '../../components/Table/BaseTable'
import ContentTitle from '../../components/Content/ContentTitle'

import { useEffect, useState } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { historialBalanceColumns, ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import FormField from '../../components/Form/FormField'
import { getCurrentDate } from '../../utils/dateUtils'
import { IngresoEgresoCard } from '../../components/Card/Currency/CurrencyCardDefinitions'

export default function AdminHistorialBalance(){
  const {saldo, getBalance, historialBalance, currencyForDate, selectedDate, setSelectedDate, getCurrencyForDate, isFetchingBalance} = useCurrencyStore();
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
  const centered = ['fecha', 'monto', 'totalIngresos', 'totalEgresos', 'tipo']

  // Custom column definitions for the combined view with tipo column
  const combinedColumns = [
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      size: 100,
      cell: ({ getValue }) => {
        const tipo = getValue();
        return (
          <span className={`badge ${tipo === 'Ingreso' ? 'badge success' : 'badge danger'}`}>
            {tipo}
          </span>
        );
      }
    },
    ...ingresoEgresoColumns
  ];

  // Combine all ingresos and egresos data for the selected date
  const combinedIngresosEgresos = [
    ...(currencyForDate.ingresosCapitales?.data ?? []).map(item => ({ ...item, tipo: 'Ingreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.ingresosVarios?.data ?? []).map(item => ({ ...item, tipo: 'Ingreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.cuotasAbonos?.data ?? []).map(item => ({ ...item, tipo: 'Ingreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.cuotasPagadas?.data ?? []).map(item => ({ ...item, tipo: 'Ingreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.gastosEmpresa?.data ?? []).map(item => ({ ...item, tipo: 'Egreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.egresosVarios?.data ?? []).map(item => ({ ...item, tipo: 'Egreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.egresosCuotasRetiros?.data ?? []).map(item => ({ ...item, tipo: 'Egreso', fecha: item.fecha || selectedDate })),
    ...(currencyForDate.creditosDesembolsados?.data ?? []).map(item => ({ ...item, tipo: 'Egreso', fecha: item.fecha || selectedDate }))
  ];

  const tabs = [
    { icon: 'fas fa-history', label: 'Historial Balance', data: historialBalance ?? [], value: historialBalance?.length ?? 0},
    { 
      icon: 'fas fa-list', 
      label: 'Historial General', 
      data: combinedIngresosEgresos, 
      columnDefinitions: combinedColumns,
      card: IngresoEgresoCard,
      value: combinedIngresosEgresos.length,
      iconBgColor: 'accent-light'
    },
  ];

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'caja'}/>

      <div className="content">
        <ContentTitle title={'Historial de Balance'} subtitle={'Historial de Balances por Fecha'}/>
        
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
          data={historialBalance ?? []} 
          columns={historialBalanceColumns} 
          centered={centered} 
          flexable={['monto', 'motivo']}
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
