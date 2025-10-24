import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import { useEffect, useState } from 'react'

import { useCreditoStore } from '../../stores/useCreditoStore'
import BaseTable from '../../components/Table/BaseTable'
import { creditosAceptadosColumns, creditosFinalizadosColumns, creditosPendientesColumns, creditosRechazadosColumns, creditosTodosColumns } from '../../components/Table/Credito/CreditoTableDefinitions'
import CreditoModalDesembolsar from '../../components/Modal/Credito/CreditoModalDesembolsar'
import CreditoModalAceptar from '../../components/Modal/Credito/CreditoModalAceptar'
import { CreditosAceptadosCard, CreditosDefaultCard, CreditosPendientesCard } from '../../components/Card/Credito/CreditoCardDefinitions'
import CreditoModalGenerarDocumentos from '../../components/Modal/Credito/CreditoModalGenerarDocumentos'
import CreditoModalRechazar from '../../components/Modal/Credito/CreditoModalRechazar'
import { useParams } from 'react-router-dom'
import AccionesModal from '../../components/Card/AccionesModal'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import TotalCard from '../../components/Cards/TotalCard'

export default function AdminCreditos(){
  const { usuarioId } = useParams();
  const {filterCreditos, filteredCreditos, isFetchingCreditos, getCreditos } = useCreditoStore();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'
  const [currentTipo, setCurrentTipo] = useState('rapi-cash');

  useEffect(() => {
    getCreditos(usuarioId ?? null);
  }, [getCreditos, usuarioId]);

  useEffect(() =>{
    filterCreditos(currentTipo);
  }, [currentTipo])

  const centered = ['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion', ]

  const tabs = [
    { label: 'Todos'},
    { label: 'Pendientes', columnDefinitions: creditosPendientesColumns, card: CreditosPendientesCard, data: filteredCreditos.creditosPendientes},
    { label: 'Aceptados', columnDefinitions: creditosAceptadosColumns, card: CreditosAceptadosCard, data: filteredCreditos.creditosAceptados},
    { label: 'Rechazados', columnDefinitions: creditosRechazadosColumns, data: filteredCreditos.creditosRechazados},
    { label: 'Finalizados', columnDefinitions: creditosFinalizadosColumns, data: filteredCreditos.creditosFinalizados},
  ];

  return(
    <div className="page">
      <CreditoModalGenerarDocumentos/>      
      <CreditoModalDesembolsar/>
      <CreditoModalAceptar/>      
      <CreditoModalRechazar/>      

      {/* Mobile */}
      <AccionesModal/>

      <Navbar/>
      <Sidebar activePage={'creditos'}/>

      <div className="content">
        <ContentTitleWithInfo
          title={
            !usuarioId
              ? 'Créditos'
              : (
                  <div>
                    {'Créditos de '}
                    {filteredCreditos.creditos[0]?.usuario ?? 'Usuario'}
                  </div>
                )
          }
          subtitle={'Gestión de Creditos'}
        >
          <TotalCard onClick={() => setCurrentTipo('rapi-cash')} className={`tab ${currentTipo == 'rapi-cash' && 'active'} w-bg`} icon={'fas fa-money-bill'} iconBgColor='success' title={'Rapi-Cash'}>
              <h3 className='color-success'>{filteredCreditos?.totalRapicash}</h3>
          </TotalCard>
          <TotalCard onClick={() => setCurrentTipo('prendario')} className={`tab ${currentTipo == 'prendario' && 'active'} w-bg`} icon={'fas fa-ring'} iconBgColor='warning' title={'Prendarios'}>
              <h3 className='color-warning'>{filteredCreditos?.totalPrendarios}</h3>
          </TotalCard>
          <TotalCard onClick={() => setCurrentTipo('hipotecario')} className={`tab ${currentTipo == 'hipotecario' && 'active'} w-bg`} icon={'fas fa-landmark'} iconBgColor='accent' title={'Hipotecarios'}>
              <h3 className='color-accent'>{filteredCreditos?.totalHipotecarios}</h3>
          </TotalCard>
        </ContentTitleWithInfo>
        
        <BaseTable 
          data={filteredCreditos.creditos} 
          columns={creditosTodosColumns} 
          card={CreditosDefaultCard}
          centered={centered} 
          flexable='usuario' 
          loading={isFetchingCreditos}
          tabs={tabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>
    </div>
  )
}