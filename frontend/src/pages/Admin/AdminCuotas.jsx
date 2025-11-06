
import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useCuotaStore } from '../../stores/useCuotaStore'
import { cuotasPagadasColumns, cuotasPendientesColumns, cuotasTodosColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import CuotaModalMarcarPagado from '../../components/Modal/Cuota/CuotaModalMarcarPagado'
import CuotaModalAbonar from '../../components/Modal/Cuota/CuotaModalAbonar'
import { useParams } from 'react-router-dom'
import { CuotasPendientesCard, CuotasPagadasCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import CuotaModalNotas from '../../components/Modal/Cuota/CuotaModalNotas'
import CuotaModalEditar from '../../components/Modal/Cuota/CuotaModalEditar'
import Layout from '../../Layout'

export default function AdminCuotas(){
  const {id} = useParams();
  const {cuotas, cuotasPendientes, cuotasPagadas, cuotasVencidas, cuotasEnRevision, isFetchingCuotas, getCuotas, getUsuarioCuotas, descargarPDFCuotas} = useCuotaStore();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (id == null){
      getCuotas();
    }
    else{
      getCuotas(id);
    }
  }, [getCuotas, id]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['estado', 'celular', 'codigo', 'fechaVencimiento', 'fechaPagado', 'monto', 'mora', 'total', 'accion']

  // -- Definición de las pestañas --
  const tabs = [
    { label: 'Todos'},
    { label: 'Vencidas', columnDefinitions: cuotasPendientesColumns,data: cuotasVencidas, card: CuotasPendientesCard},
    { label: 'Pendientes', columnDefinitions: cuotasPendientesColumns, data: cuotasPendientes, card: CuotasPendientesCard},
    { label: 'Pagadas', columnDefinitions: cuotasPagadasColumns, data: cuotasPagadas, card: CuotasPagadasCard},
    { label: 'En Revisión', columnDefinitions: cuotasPendientesColumns, data: cuotasEnRevision, card: CuotasPendientesCard},
  ];

  return(
    <Layout>
      <CuotaModalMarcarPagado/>
      <CuotaModalAbonar/>
      <CuotaModalNotas/>
      <CuotaModalEditar/>

      {/* Mobile */}
      
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
        >
          {id && (
          <button className='btn-danger' onClick={() => descargarPDFCuotas(!id ? null : id)}>
            <i className='fas fa-print'/>PDF
          </button>
          )}
        </BaseTable>
      </div>
      
    </Layout>
  )
}