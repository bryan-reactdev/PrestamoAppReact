import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import StatCard from '../../components/Content/Layout/Stats/StatCard'
import StatSummaryItem from '../../components/Content/Layout/Stats/StatSummaryItem'
import { ButtonEgreso, ButtonIngreso, ButtonPDF } from '../../components/Content/Layout/Stats/StatButtons'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { useEffect, useState } from 'react'
import FormField from '../../components/Form/FormField'
import CurrencyModalIngreso from '../../components/Modal/Currency/CurrencyModalIngreso'
import CurrencyModalEgreso from '../../components/Modal/Currency/CurrencyModalEgreso'
import { getCurrentDate } from '../../utils/dateUtils'
import Layout from '../../Layout'

export default function AdminCajaChica(){
  const { saldo, getBalance, currencyForDate, selectedDate, setSelectedDate, getCurrencyForDate, descargarPDFDiario } = useCurrencyStore();

  useEffect(() => {
    if (!saldo){
      getBalance();
    }
  }, [getBalance])

  // Calculation on update
  useEffect(() => {
    getCurrencyForDate();
  }, [saldo])

  return(
    <Layout>
      <CurrencyModalIngreso/>
      <CurrencyModalEgreso/>

      <div className="content">
        <ContentTitle title={"Caja Chica"} subtitle={"Caja Chica de Multipréstamos Atlas"} />
      
        <div className="date-controls">
          <FormField 
            classNames={'simple'}
            label={'Fecha'} 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button 
            className='btn-primary sm' 
            onClick={() => setSelectedDate(getCurrentDate())}
          >
            <i className='fas fa-rotate'/>
            IR A HOY
          </button>
          {selectedDate && (
            <button 
              className='btn-danger sm' 
              onClick={() => descargarPDFDiario(selectedDate)}
            >
              <i className='fas fa-print'/>
              GENERAR PDF
            </button>
          )}
        </div>

        <div className="stat-cards">
          {/* Balance de Capital */}
          <StatCard title={'Balance de Capital'} titleIcon={'fas fa-money-bill-trend-up'} value={currencyForDate.balance?.saldo} to={'./balance'}>
            <StatSummaryItem value={currencyForDate.totalIngresos} color={'success'}>
              <i className={'fas fa-arrow-down'}/>
              Total de Ingresos
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.totalEgresos} color={'danger'}>
              <i className={'fas fa-arrow-up'}/>
              Total de Egresos
            </StatSummaryItem>
          </StatCard>

          {/* Ingresos */}
          <StatCard title={'Ingresos'} titleIcon={'fas fa-arrow-down'} actions={[<ButtonPDF key={'pdf'} tipo={'ingreso'}/>, <ButtonIngreso key={'ingreso'}/>]} value={currencyForDate.totalIngresos} color='success' to={'./ingresos'}>
            <StatSummaryItem value={currencyForDate.ingresosCapitales?.total}>
              <i className='fas fa-building'/>
              Ingresos Capitales
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.ingresosVarios?.total}>
              <i className='fas fa-coins'/>
              Ingresos Varios
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.cuotasAbonos?.total}>
              <i className='fas fa-money-bill'/>
              Abonos a Cuotas
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.cuotasPagadas?.total}>
              <i className='fas fa-wallet'/>
              Pagos de Cuotas
            </StatSummaryItem>
          </StatCard>

          {/* Egresos */}
          <StatCard title={'Egresos'} titleIcon={'fas fa-arrow-up'} actions={[<ButtonPDF key={'pdf'} tipo={'egreso'}/>, <ButtonEgreso key={'egreso'}/>]} value={currencyForDate.totalEgresos} color={'danger'} to={'./egresos'}>
            <StatSummaryItem value={currencyForDate.gastosEmpresa?.total}>
              <i className='fas fa-building'/>
              Gastos de Empresa
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.egresosVarios?.total}>
              <i className='fas fa-coins'/>
              Egresos Varios
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.egresosCuotasRetiros?.total}>
              <i className='fas fa-money-bill'/>
              Retiro de Cuotas
            </StatSummaryItem>
            <StatSummaryItem value={currencyForDate.creditosDesembolsados?.total}>
              <i className='fas fa-credit-card'/>
              Créditos Desembolsados
            </StatSummaryItem>
          </StatCard>
        </div>

      </div>
      
    </Layout>
  )
}