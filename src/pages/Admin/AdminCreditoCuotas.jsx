import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useCuotaStore } from '../../stores/useCuotaStore'
import { cuotasPendientesColumns, cuotasTodosColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import CuotaModalMarcarPagado from '../../components/Modal/Cuota/CuotaModalMarcarPagado'
import { CuotasPendientesCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import { useParams } from 'react-router-dom'

export default function AdminCuotas(){
  const {id} = useParams();
  const {cuotas, cuotasPendientes, cuotasPagadas, cuotasVencidas, cuotasEnRevision, isFetchingCuotas, getCuotas} = useCuotaStore();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    getCuotas(id);
  }, [getCuotas, id]);

  
  // Definición de las columnas que estarán centradas
  const centered = ['estado', 'codigo', 'fechaVencimiento', 'fechaPago', 'monto', 'mora', 'total', 'accion']

  // -- Definición de las pestañas --
  const tabs = [
    { label: 'Todos'},
    { label: 'Pendientes', columnDefinitions: cuotasPendientesColumns, data: cuotasPendientes},
    { label: 'Pagadas', data: cuotasPagadas},
    { label: 'Vencidas', data: cuotasVencidas},
    { label: 'En Revisión', data: cuotasEnRevision},
  ];

  return(
    <div className="page">
      <CuotaModalMarcarPagado/>

      <Navbar/>
      <Sidebar activePage={'creditos'}/>

      <div className="content">
        <ContentTitle title={'Cobros'} subtitle={'Gestión de Cobros'}/>

        <BaseTable 
          data={cuotas} 
          columns={cuotasTodosColumns} 
          card={CuotasPendientesCard}
          centered={centered} 
          flexable='usuario' 
          loading={isFetchingCuotas}
          tabs={tabs}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>
      
    </div>
  )
}