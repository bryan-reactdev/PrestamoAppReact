import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosConVencidasColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import AccionesModal from '../../components/Card/AccionesModal'
import TotalCard from '../../components/Cards/TotalCard'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { useCurrencyStore } from '../../stores/useCurrencyStore'

export default function AdminCobros(){
  const {usuariosConVencidas, usuariosConCuotas, isFetchingUsuariosConVencidas, getUsuariosConVencidas, getUsuariosConCuotas} = useUsuarioStore();
  const {cuotasTotales, getCuotasTotales} = useCurrencyStore();
  const [currentTab, setCurrentTab] = useState('');

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (usuariosConVencidas.length === 0) {
      getUsuariosConVencidas();
      getUsuariosConCuotas();
      getCuotasTotales();
    }
  }, [getUsuariosConVencidas, getUsuariosConCuotas, getCuotasTotales]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['calificacion', 'celular', 'cuotaVencimiento', 'cuotaMonto', 'cuotaMora', 'cuotaAbono', 'cuotaTotal', 'accion']

  const tabs = [
    { icon: 'fas fa-warning', iconBgColor: 'danger', label: 'Lista de Usuarios con Cuotas Vencidos', text: usuariosConVencidas.length ?? '0'},
    { icon: 'fas fa-users',  iconBgColor: 'warning', label: 'Mapeo de Clientes con Cuotas', text: usuariosConCuotas.length ?? '0', data: usuariosConCuotas},
  ];

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'cobros'}/>

      <AccionesModal/>

      <div className="content">
        <ContentTitleWithInfo title={''} subtitle={''}>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='danger' title={'Vencidas Totales'} style={{padding: 0}}>
              <i className='fas fa-dollar-sign color-danger'/>
              <h3 className='color-danger'>{cuotasTotales?.totalVencidas}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='warning' title={'Pendientes Totales'} style={{padding: 0}}>
              <i className='fas fa-dollar-sign color-warning'/>
              <h3 className='color-warning'>{cuotasTotales?.totalPendientes}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='primary' title={'Total a Cobrar'} style={{padding: 0}}>
              <i className='fas fa-dollar-sign color-primary'/>
              <h3 className='color-primary'>{cuotasTotales?.totalVencidas + cuotasTotales.totalPendientes}</h3>
          </TotalCard>
          <TotalCard icon={'fas fa-chart-line'} iconBgColor='success' title={'Pagadas Totales'} style={{padding: 0}}>
              <i className='fas fa-dollar-sign color-success'/>
              <h3 className='color-success'>{cuotasTotales?.totalPagadas}</h3>
          </TotalCard>
        </ContentTitleWithInfo>

        <BaseTable 
          data={usuariosConVencidas} 
          columns={usuariosConVencidasColumns} 
          card={UsuariosCard}
          centered={centered} 
          flexable='usuario' 
          loading={isFetchingUsuariosConVencidas}
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