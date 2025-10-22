import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import { CuotasPendientesCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import FormField from '../../components/Form/FormField'
import { getCurrentDate } from '../../utils/dateUtils'
import TotalCard from '../../components/Cards/TotalCard'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { creditosAceptadosColumns } from '../../components/Table/Credito/CreditoTableDefinitions'
import { CreditosAceptadosCard } from '../../components/Card/Credito/CreditoCardDefinitions'
import { IngresoEgresoCard } from '../../components/Card/Currency/CurrencyCardDefinitions'
export default function AdminEgresos() {
  const { saldo, getBalance, currencyForDate, selectedDate, setSelectedDate, getCurrencyForDate, isFetchingBalance } = useCurrencyStore();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  useEffect(() => {
    if (!saldo) {
      getBalance();
    }
  }, [getBalance])

  // Calculation on update
  useEffect(() => {
    getCurrencyForDate();
  }, [saldo])

  // Definición de las columnas que estarán centradas
  const centered = ['fecha', 'monto', 'calificacion', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'desembolsado', 'accion']

  console.log(currencyForDate.creditosDesembolsados?.data)

  const tabs = [
    { icon: 'fas fa-building', label: 'Gastos Empresa', iconBgColor: 'accent-light', value: currencyForDate.gastosEmpresa?.total },
    { icon: 'fas fa-coins', label: 'Egresos Varios', data: currencyForDate.egresosVarios?.data ?? [], iconBgColor: 'warning', value: currencyForDate.egresosVarios?.total },
    { icon: 'fas fa-money-bill', label: 'Retiro Cuotas', data: currencyForDate.egresosCuotasRetiros?.data ?? [], value: currencyForDate.egresosCuotasRetiros?.total },
    { icon: 'fas fa-credit-card', label: 'Créditos Desembolsados', columnDefinitions: creditosAceptadosColumns, card: CreditosAceptadosCard, data: currencyForDate.creditosDesembolsados?.data ?? [], iconBgColor: 'danger', value: currencyForDate.creditosDesembolsados?.total },
  ];

  return (
    <div className="page">
      <Navbar />
      <Sidebar activePage={'caja'} />

      <div className="content">
        <ContentTitleWithInfo title={'Ingresos'} subtitle={'Gestión de Ingresos'}>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='danger' color="accent" title={'Ingresos Totales'} style={{ padding: 0 }}>
            <i className='fas fa-dollar-sign color-danger' />
            <h3 className='color-danger'>{currencyForDate.totalEgresos}</h3>
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
            <i className='fas fa-rotate' />
            IR A HOY
          </button>
        </div>

        <BaseTable
          data={currencyForDate.gastosEmpresa?.data ?? []}
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
        />
      </div>

    </div>
  )
}