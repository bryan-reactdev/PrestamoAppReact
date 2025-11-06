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
import { cuotasCobrosColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import { CuotasPendientesCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import CuotaModalMarcarPagado from '../../components/Modal/Cuota/CuotaModalMarcarPagado'
import CuotaModalAbonar from '../../components/Modal/Cuota/CuotaModalAbonar'
import CuotaModalNotas from '../../components/Modal/Cuota/CuotaModalNotas'
import CuotaModalEditar from '../../components/Modal/Cuota/CuotaModalEditar'
import { formatCurrencySV } from '../../utils/currencyUtils'
import Layout from '../../Layout'

export default function AdminCobros(){
  const {usuariosConVencidas, isFetchingUsuariosConVencidas, getUsuariosConVencidas, usuariosConCuotas, isFetchingUsuariosConCuotas, getUsuariosConCuotas, descargarPDFCobros} = useUsuarioStore();
  const {cuotasForMapeo, isFetchingCuotas, getCuotas, selectedDate, setSelectedDate} = useCuotaStore();
  const {cuotasTotales, getCuotasTotales, isFetchingCuotasTotales} = useCurrencyStore();
  const [currentTab, setCurrentTab] = useState('');

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (usuariosConVencidas.length === 0) {
      getUsuariosConVencidas();
    }
    if (usuariosConCuotas.length === 0) {
      getUsuariosConCuotas();
    }
    getCuotasTotales();
    getCuotas();
  }, [getUsuariosConVencidas, getUsuariosConCuotas, getCuotasTotales, getCuotas]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['calificacion', 'estado', 'celular', 'fechaVencimiento', 'cuotaVencimiento', 'cuotaMonto', 'cuotaMora', 'cuotaAbono', 'cuotaTotal', 'monto', 'mora', 'abono', 'total', 'totalPagar', 'creditoMonto', 'cuotasPendientes', 'direccion', 'referencias', 'parentesco', 'referenciasCelular', 'accion']

  const tabs = [
    { icon: 'fas fa-users',  iconBgColor: 'warning', label: 'Mapeo de Cuotas', text: cuotasForMapeo.length ?? '0', isLoading: isFetchingCuotas, data: cuotasForMapeo, card: CuotasPendientesCard, columnDefinitions: cuotasCobrosColumns},
    { icon: 'fas fa-check', iconBgColor: 'success', label: 'Listado de Clientes Al Día', text: usuariosConCuotas.length ?? '0', isLoading: isFetchingUsuariosConCuotas, data: usuariosConCuotas, card: UsuariosCard, columnDefinitions: usuariosConVencidasColumns},
    { icon: 'fas fa-warning', iconBgColor: 'danger', label: 'Listado de Clientes Morosos', text: usuariosConVencidas.length ?? '0', isLoading: isFetchingUsuariosConVencidas, data: usuariosConVencidas, card: UsuariosCard, columnDefinitions: usuariosConVencidasColumns},
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
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='primary' title={'Total a Cobrar'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-primary'/>
              <h3 className='color-primary'>{formatCurrencySV(cuotasTotales?.totalVencidas + cuotasTotales?.totalPendientes)}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='success' title={'Pagadas Totales'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-success'/>
              <h3 className='color-success'>{formatCurrencySV(cuotasTotales?.totalPagadas)}</h3>
          </TotalCard>
        </ContentTitleWithInfo>

{/* 
        <TotalCard icon={'fas fa-chart-line'} iconBgColor='danger' title={'Vencidas Totales'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-danger'/>
              <h3 className='color-danger'>{formatCurrencySV(cuotasTotales?.totalVencidas)}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='warning' title={'Pendientes Totales'} style={{padding: 0}} isLoading={isFetchingCuotasTotales}>
              <i className='fas fa-dollar-sign color-warning'/>
              <h3 className='color-warning'>{formatCurrencySV(cuotasTotales?.totalPendientes)}</h3>
          </TotalCard> */}

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
          showTabsAtTop={true}
        >

        {currentTab === "Mapeo de Cuotas" &&
          <div className="date-controls">
            <FormField
              classNames={'simple !p-0'}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button 
              className='btn-primary' 
              onClick={() => setSelectedDate(getCurrentDate())}
            >
              <i className='fas fa-rotate'/>
              IR A HOY
            </button>

            <button 
              className='btn-secondary' 
              onClick={() => setSelectedDate(null)}
            >
              <i className='fas fa-times'/>
              LIMPIAR
            </button>
          </div>
        }
          {(currentTab === "Listado de Clientes Morosos" || currentTab === "Listado de Clientes Al Día") && (
            <button className='btn-danger' onClick={() => descargarPDFCobros()}>
              <i className='fas fa-print'/>PDF
            </button>
          )}
        </BaseTable>

      </div>
    </Layout>
  )
}