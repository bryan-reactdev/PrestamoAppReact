import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import StatCard from '../../components/Content/Layout/Stats/StatCard'
import StatSummaryItem from '../../components/Content/Layout/Stats/StatSummaryItem'
import { ButtonEgreso, ButtonIngreso, ButtonPDF } from '../../components/Content/Layout/Stats/StatButtons'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { useEffect } from 'react'

export default function AdminCajaChica(){
  const { saldo, totalIngresos, totalEgresos, getBalance } = useCurrencyStore();
  
  useEffect(() => {
    if (!saldo || !totalIngresos || !totalEgresos){
      getBalance();
    }
  }, [getBalance])

  return(
    <div className="page">
      <Navbar/>

      <Sidebar activePage={'caja'}/>
      <div className="content">
        <ContentTitle title={"Caja Chica"} subtitle={"Caja Chica de Multipréstamos Atlas"} />
      
        <div className="stat-cards">
          {/* Balance de Capital */}
          <StatCard title={'Balance de Capital'} titleIcon={'fas fa-money-bill-trend-up'} value={saldo}>
            <StatSummaryItem value={totalIngresos} color={'success'}>
              <i className={'fas fa-arrow-down'}/>
              Total de Ingresos
            </StatSummaryItem>
            <StatSummaryItem value={totalEgresos} color={'danger'}>
              <i className={'fas fa-arrow-up'}/>
              Total de Egresos
            </StatSummaryItem>
          </StatCard>

          {/* Ingresos */}
          <StatCard title={'Ingresos'} titleIcon={'fas fa-arrow-down'} actions={[<ButtonPDF key={'pdf'}/>, <ButtonIngreso key={'ingreso'}/>]} value={totalIngresos} color='success'>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-building'/>
              Ingresos Capitales
            </StatSummaryItem>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-coins'/>
              Ingresos Varios
            </StatSummaryItem>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-money-bill'/>
              Abonos a Cuotas
            </StatSummaryItem>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-wallet'/>
              Pagos de Cuotas
            </StatSummaryItem>
          </StatCard>

          {/* Egresos */}
          <StatCard title={'Engresos'} titleIcon={'fas fa-arrow-up'} actions={[<ButtonPDF key={'pdf'}/>, <ButtonEgreso key={'egreso'}/>]} value={totalEgresos} color={'danger'}>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-credit-card'/>
              Créditos Desembolsados
            </StatSummaryItem>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-building'/>
              Gastos de Empresa
            </StatSummaryItem>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-coins'/>
              Egresos Varios
            </StatSummaryItem>
            <StatSummaryItem value={'100.00'}>
              <i className='fas fa-money-bill'/>
              Retiro de Cuotas
            </StatSummaryItem>
          </StatCard>
        </div>

      </div>
      
    </div>
  )
}