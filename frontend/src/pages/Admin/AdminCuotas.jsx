import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useCuotaStore } from '../../stores/useCuotaStore'
import { cuotasPagadasColumns, cuotasPendientesColumns, cuotasTodosColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import CuotaModalMarcarPagado from '../../components/Modal/Cuota/CuotaModalMarcarPagado'
import CuotaModalAbonar from '../../components/Modal/Cuota/CuotaModalAbonar'
import { useParams } from 'react-router-dom'
import { CuotasPendientesCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import AccionesModal from '../../components/Card/AccionesModal'
import CuotaModalNotas from '../../components/Modal/Cuota/CuotaModalNotas'
import CuotaModalEditar from '../../components/Modal/Cuota/CuotaModalEditar'

export default function AdminCuotas(){
  const {id, usuarioId} = useParams();
  const {cuotas, cuotasPendientes, cuotasPagadas, cuotasVencidas, cuotasEnRevision, isFetchingCuotas, getCuotas, getUsuarioCuotas} = useCuotaStore();
  // const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'
  const [currentTab, setCurrentTab] = useState('Pendientes'); // Default to 'Todos'

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (usuarioId){
      getUsuarioCuotas(usuarioId);
    }
    else if (id == null){
      getCuotas();
    }
    else{
      getCuotas(id);
    }
  }, [getCuotas, id]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['estado', 'codigo', 'fechaVencimiento', 'fechaPagado', 'monto', 'mora', 'total', 'accion']

  // -- Definición de las pestañas --
  const tabs = [
    // { label: 'Todos'},
    { label: 'Vencidas', data: cuotasVencidas},
    { label: 'Pendientes', columnDefinitions: cuotasPendientesColumns, data: cuotasPendientes},
    { label: 'Pagadas', columnDefinitions: cuotasPagadasColumns, data: cuotasPagadas},
    { label: 'En Revisión', data: cuotasEnRevision},
  ];

  return(
    <div className="page">
      <CuotaModalMarcarPagado/>
      <CuotaModalAbonar/>
      <CuotaModalNotas/>
      <CuotaModalEditar/>

      {/* Mobile */}
      <AccionesModal/>
      
      <Navbar/>
      <Sidebar activePage={!id ? 'cobros' : 'creditos'}/>

      <div className="content">
        <ContentTitle
          title={
            !id
              ? 'Cobros'
              : (
                  <div>
                    {'Cuotas del crédito de '}
                    {cuotas[0]?.usuario ?? 'Usuario'}
                  </div>
                )
          }
          subtitle={
            !id
              ? 'Gestión de Cobros'
              : 'Gestión de cuotas del crédito'
          }
        />

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