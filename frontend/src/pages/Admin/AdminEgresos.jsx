import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import FormField from '../../components/Form/FormField'
import CurrencyModalVerImagenes from '../../components/Modal/Currency/CurrencyModalVerImagenes'
import CurrencyModalEditar from '../../components/Modal/Currency/CurrencyModalEditar'
import { getCurrentDate } from '../../utils/dateUtils'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { creditosAceptadosColumns } from '../../components/Table/Credito/CreditoTableDefinitions'
import { CreditosAceptadosCard } from '../../components/Card/Credito/CreditoCardDefinitions'
import { IngresoEgresoCard } from '../../components/Card/Currency/CurrencyCardDefinitions'
import { ButtonPDF } from '../../components/Content/Layout/Stats/StatButtons'
import Layout from '../../Layout'
import { formatCurrencySV } from '../../utils/currencyUtils'
import CreditoModalGenerarDocumentos from '../../components/Modal/Credito/CreditoModalGenerarDocumentos'
import CreditoModalDesembolsar from '../../components/Modal/Credito/CreditoModalDesembolsar'
import CreditoModalAceptar from '../../components/Modal/Credito/CreditoModalAceptar'
import CreditoModalRechazar from '../../components/Modal/Credito/CreditoModalRechazar'
import CreditoModalNotas from '../../components/Modal/Credito/CreditoModalNotas'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
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

  const summaryCards = [
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'primary',
      label: 'Balance de Capital',
      value: currencyForDate.balance?.saldo,
      isLoading: isFetchingBalance
    },
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'danger',
      label: 'Egresos Totales',
      value: currencyForDate.totalEgresos,
      isLoading: isFetchingBalance
    },
  ];

  const tabs = [
    { icon: 'fas fa-building', label: 'Gastos Empresa', iconBgColor: 'accent-light', value: currencyForDate.gastosEmpresa?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-coins', label: 'Egresos Varios', data: currencyForDate.egresosVarios?.data ?? [], iconBgColor: 'warning', value: currencyForDate.egresosVarios?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-file-invoice-dollar', label: 'Pago de Planillas', data: currencyForDate.egresosPagoPlanillas?.data ?? [], iconBgColor: 'warning', value: currencyForDate.egresosPagoPlanillas?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-money-bill', label: 'Retiro Cuotas', data: currencyForDate.egresosCuotasRetiros?.data ?? [], value: currencyForDate.egresosCuotasRetiros?.total, isLoading: isFetchingBalance },
    { icon: 'fas fa-credit-card', label: 'Créditos Desembolsados', columnDefinitions: creditosAceptadosColumns, card: CreditosAceptadosCard, data: currencyForDate.creditosDesembolsados?.data ?? [], iconBgColor: 'danger', value: currencyForDate.creditosDesembolsados?.total, isLoading: isFetchingBalance },
  ];

  return (
    <Layout>
      <CreditoModalGenerarDocumentos/>      
      <CreditoModalDesembolsar/>
      <CreditoModalAceptar/>      
      <CreditoModalRechazar/>
      <CreditoModalNotas/>      

      <div className="content">
        <ContentTitleWithInfo title={''} subtitle={''}>
          <div className="w-full flex flex-row gap-2">
            {summaryCards.map((card) => {
              const hasValue = card.value !== null && card.value !== undefined;
              const mainText = hasValue ? formatCurrencySV(card.value) : null;

              return (
                <Card
                  key={card.label}
                  className="@container/card min-w-[150px] max-w-full flex-1 p-3 relative bg-transparent border-none"
                >
                  <CardHeader className="flex flex-row p-0">
                    <div className="flex items-center gap-2 w-full">
                      <div 
                        className='flex items-center justify-center p-3 px-4 rounded-md shrink-0 accent-light '
                      >
                        <i className={`${card.icon} text-primary !text-lg`} />
                      </div>

                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <CardDescription className="whitespace-nowrap truncate text-primary">{card.label}</CardDescription>
                        {card.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="spinner w-3 h-3"></div>
                          </div>
                        ) : mainText ? (
                          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-xl m-0 p-0 whitespace-nowrap truncate text-primary`}>
                            ${mainText}
                          </CardTitle>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
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