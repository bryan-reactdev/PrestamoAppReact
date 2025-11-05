import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosConVencidasColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import TotalCard from '../../components/Cards/TotalCard'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import UsuarioModalVerDetallesCobro from '../../components/Modal/Usuario/UsuarioModalVerDetallesCobro'
import FormField from '../../components/Form/FormField'
import { getCurrentDate } from '../../utils/dateUtils'
import { useCuotaStore } from '../../stores/useCuotaStore'
import { cuotasCobrosAcciones, cuotasCobrosColumns, cuotasPendientesColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import { CuotasPendientesCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import CuotaModalMarcarPagado from '../../components/Modal/Cuota/CuotaModalMarcarPagado'
import CuotaModalAbonar from '../../components/Modal/Cuota/CuotaModalAbonar'
import CuotaModalNotas from '../../components/Modal/Cuota/CuotaModalNotas'
import CuotaModalEditar from '../../components/Modal/Cuota/CuotaModalEditar'
import { formatCurrencySV } from '../../utils/currencyUtils'
import Layout from '../../Layout'

export default function AdminCobros(){
  const {usuariosConVencidas, isFetchingUsuariosConVencidas, getUsuariosConVencidas, descargarPDFCobros} = useUsuarioStore();
  const {cuotasPendientesForMapeo, isFetchingCuotas, getCuotas, selectedDate, setSelectedDate} = useCuotaStore();
  const {cuotasTotales, getCuotasTotales, isFetchingCuotasTotales} = useCurrencyStore();
  const [currentTab, setCurrentTab] = useState('');

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (usuariosConVencidas.length === 0) {
      getUsuariosConVencidas();
      getCuotasTotales();
    }
    getCuotas();
  }, [getUsuariosConVencidas, getCuotasTotales, getCuotas]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['calificacion', 'estado', 'celular', 'fechaVencimiento', 'cuotaVencimiento', 'cuotaMonto', 'cuotaMora', 'cuotaAbono', 'cuotaTotal', 'monto', 'mora', 'abono', 'total', 'totalPagar', 'creditoMonto', 'cuotasPendientes', 'direccion', 'referencias', 'parentesco', 'accion']

  const tabs = [
    { icon: 'fas fa-users',  iconBgColor: 'warning', label: 'Mapeo de Cuotas con Clientes', text: cuotasPendientesForMapeo.length ?? '0', isLoading: isFetchingCuotas, data: cuotasPendientesForMapeo, card: CuotasPendientesCard, columnDefinitions: cuotasCobrosColumns},
    { icon: 'fas fa-warning', iconBgColor: 'danger', label: 'Lista de Usuarios con Cuotas Vencidas', text: usuariosConVencidas.length ?? '0', isLoading: isFetchingUsuariosConVencidas},
  ];

  return(
    <Layout>
      <UsuarioModalVerDetalles/>
      <UsuarioModalVerDetallesCobro/>

      <CuotaModalMarcarPagado/>
      <CuotaModalAbonar/>
      <CuotaModalNotas/>
      <CuotaModalEditar/>

      <div className="content">
        <ContentTitleWithInfo title={''} subtitle={''}>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='danger' title={'Vencidas Totales'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-danger'/>
              <h3 className='color-danger'>{formatCurrencySV(cuotasTotales?.totalVencidas)}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='warning' title={'Pendientes Totales'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-warning'/>
              <h3 className='color-warning'>{formatCurrencySV(cuotasTotales?.totalPendientes)}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='primary' title={'Total a Cobrar'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-primary'/>
              <h3 className='color-primary'>{formatCurrencySV(cuotasTotales?.totalVencidas + cuotasTotales?.totalPendientes)}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='success' title={'Pagadas Totales'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-success'/>
              <h3 className='color-success'>{formatCurrencySV(cuotasTotales?.totalPagadas)}</h3>
          </TotalCard>
        </ContentTitleWithInfo>

        <BaseTable 
          data={usuariosConVencidas} 
          card={UsuariosCard}
          columns={usuariosConVencidasColumns} 
          centered={centered} 
          flexable={''} 
          loading={isFetchingUsuariosConVencidas}
          customHeaderHeight={50}
          tabs={tabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCardTabs={true}
          hideSearch={currentTab === "Mapeo de Cuotas con Clientes"}
        >

        {currentTab === "Mapeo de Cuotas con Clientes" &&
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
          </div>
        }
          {currentTab === "Lista de Usuarios con Cuotas Vencidas" && (
            <button className='btn-danger' onClick={() => descargarPDFCobros()}>
              <i className='fas fa-print'/>PDF
            </button>
          )}
        </BaseTable>

      </div>
    </Layout>
  )
}