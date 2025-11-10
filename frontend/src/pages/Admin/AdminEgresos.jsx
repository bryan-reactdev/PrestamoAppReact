import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import FormField from '../../components/Form/FormField'
import CurrencyModalVerImagenes from '../../components/Modal/Currency/CurrencyModalVerImagenes'
import CurrencyModalEditar from '../../components/Modal/Currency/CurrencyModalEditar'
import { getCurrentDate } from '../../utils/dateUtils'
import TotalCard from '../../components/Cards/TotalCard'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { creditosAceptadosColumns } from '../../components/Table/Credito/CreditoTableDefinitions'
import { CreditosAceptadosCard } from '../../components/Card/Credito/CreditoCardDefinitions'
import { IngresoEgresoCard } from '../../components/Card/Currency/CurrencyCardDefinitions'
import { ButtonPDF } from '../../components/Content/Layout/Stats/StatButtons'
import Layout from '../../Layout'
import { formatCurrencySV } from '../../utils/currencyUtils'
export default function AdminEgresos() {
  const { saldo, getBalance, currencyForDate, selectedDate, setSelectedDate, getCurrencyForDate, isFetchingBalance } = useCurrencyStore();
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  useEffect(() => {
    if (!saldo) {
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
  const centered = ['fecha', 'monto', 'accion', 'calificacion', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'desembolsado']

  const tabs = [
    { icon: 'fas fa-building', label: 'Gastos Empresa', iconBgColor: 'accent-light', value: currencyForDate.gastosEmpresa?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-coins', label: 'Egresos Varios', data: currencyForDate.egresosVarios?.data ?? [], iconBgColor: 'warning', value: currencyForDate.egresosVarios?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-money-bill', label: 'Retiro Cuotas', data: currencyForDate.egresosCuotasRetiros?.data ?? [], value: currencyForDate.egresosCuotasRetiros?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-credit-card', label: 'Créditos Desembolsados', columnDefinitions: creditosAceptadosColumns, card: CreditosAceptadosCard, data: currencyForDate.creditosDesembolsados?.data ?? [], iconBgColor: 'danger', value: currencyForDate.creditosDesembolsados?.total, isLoading: isFetchingBalance },
  ];

  return (
    <Layout>
      <div className="content">
        <ContentTitleWithInfo>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <TotalCard icon={'fas fa-chart-line'} iconBgColor='primary' title={'Balance de Capital'} style={{ padding: 0 }}>
              <i className='fas fa-dollar-sign'/>
              <h3>{currencyForDate.balance?.saldo !== null && currencyForDate.balance?.saldo !== undefined ? formatCurrencySV(currencyForDate.balance.saldo) : 'N/A'}</h3>
            </TotalCard>
            <TotalCard icon={'fas fa-chart-line'} iconBgColor='danger' color="accent" title={'Egresos Totales'} style={{ padding: 0 }}>
              <i className='fas fa-dollar-sign color-danger' />
              <h3 className='color-danger'>{currencyForDate.totalEgresos}</h3>
            </TotalCard>
          </div>
        </ContentTitleWithInfo>

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
          showTabsAtTop={true}
        >
          <div className="date-controls">
            <FormField
              classNames={'simple !p-0'}
              label={'Fecha'}
              type="date"
              value={selectedDate.split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button
              className='btn-primary'
              onClick={() => setSelectedDate(getCurrentDate())}
            >
              <i className='fas fa-rotate' />
              IR A HOY
            </button>
          </div>

          <ButtonPDF tipo={'egreso'}/>
        </BaseTable>
      </div>

      <CurrencyModalVerImagenes />
      <CurrencyModalEditar />
    </Layout>
  )
}