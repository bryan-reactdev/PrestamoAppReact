import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { abonosColumns, ingresoEgresoColumns } from '../../components/Table/Currency/CurrencyTableDefinitions'
import FormField from '../../components/Form/FormField'
import CurrencyModalVerImagenes from '../../components/Modal/Currency/CurrencyModalVerImagenes'
import CurrencyModalEditar from '../../components/Modal/Currency/CurrencyModalEditar'
import { getCurrentDate } from '../../utils/dateUtils'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { cuotasPagadasColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import { IngresoEgresoCard } from '../../components/Card/Currency/CurrencyCardDefinitions'
import { ButtonPDF } from '../../components/Content/Layout/Stats/StatButtons'
import { CuotasPagadasCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import Layout from '../../Layout'
import { formatCurrencySV } from '../../utils/currencyUtils'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'

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
  const centered = ['fecha', 'monto', 'accion', 'credito', 'fechaCuota', 'fechaAbono', 'fechaVencimiento', 'fechaPagado', 'mora', 'abono', 'total']

  const summaryCards = [
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'accent-light',
      label: 'Balance de Capital',
      value: currencyForDate.balance?.saldo,
      isLoading: isFetchingBalance
    },
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'accent-light',
      label: 'Ingresos Totales',
      value: currencyForDate.totalIngresos,
      isLoading: isFetchingBalance
    },
  ];

  const tabs = [
    { icon: 'fas fa-building', label: 'Ingresos Capitales', iconBgColor: 'accent-light', value: currencyForDate.ingresosCapitales?.total, isLoading: isFetchingBalance},
    { icon: 'fas fa-coins', label: 'Ingresos Varios', data: currencyForDate.ingresosVarios?.data ?? [], iconBgColor: 'accent-light', value: currencyForDate.ingresosVarios?.total, isLoading: isFetchingBalance},
    { icon: 'fas fa-money-bill', label: 'Abonos a Cuotas', columnDefinitions: abonosColumns, data: currencyForDate.cuotasAbonos?.data ?? [], iconBgColor: 'accent-light', value: currencyForDate.cuotasAbonos?.total, isLoading: isFetchingBalance},
    { icon: 'fas fa-wallet', label: 'Cuotas Pagadas', columnDefinitions: cuotasPagadasColumns, card: CuotasPagadasCard, data: currencyForDate.cuotasPagadas?.data ?? [], iconBgColor: 'accent-light', value: currencyForDate.cuotasPagadas?.total, isLoading: isFetchingBalance},
  ];

  return(
    <Layout>

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
              <i className='fas fa-rotate'/>
              IR A HOY
            </button>

            <ButtonPDF tipo={'ingreso'}/>
          </div>
        </BaseTable>
      </div>

      <CurrencyModalVerImagenes />
      <CurrencyModalEditar />
    </Layout>
  )
}