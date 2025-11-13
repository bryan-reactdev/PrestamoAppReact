
import { useEffect, useState } from 'react'

import { useCreditoStore } from '../../stores/useCreditoStore'
import BaseTable from '../../components/Table/BaseTable'
import { creditosAceptadosColumns, creditosFinalizadosColumns, creditosPendientesColumns, creditosRechazadosColumns, creditosTodosColumns } from '../../components/Table/Credito/CreditoTableDefinitions'
import CreditoModalDesembolsar from '../../components/Modal/Credito/CreditoModalDesembolsar'
import CreditoModalAceptar from '../../components/Modal/Credito/CreditoModalAceptar'
import { CreditosAceptadosCard, CreditosDefaultCard, CreditosPendientesCard } from '../../components/Card/Credito/CreditoCardDefinitions'
import CreditoModalGenerarDocumentos from '../../components/Modal/Credito/CreditoModalGenerarDocumentos'
import CreditoModalRechazar from '../../components/Modal/Credito/CreditoModalRechazar'
import CreditoModalNotas from '../../components/Modal/Credito/CreditoModalNotas'
import { useParams } from 'react-router-dom'
import ContentTitle from '../../components/Content/ContentTitle'
import Layout from '../../Layout'

export default function UsuarioCreditos(){
  const { usuarioId } = useParams();
  const {creditos, creditosPendientes, creditosAceptados, creditosRechazados, creditosFinalizados, isFetchingCreditos, getCreditos } = useCreditoStore();
  // const [currentTab, setCurrentTab] = useState('Todos');
  const [currentTab, setCurrentTab] = useState('Pendientes');

  useEffect(() => {
    getCreditos(usuarioId ?? null, true);
  }, [getCreditos, usuarioId]);

  const centered = ['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion', ]

  const tabs = [
    // { label: 'Todos'},
    { label: 'Pendientes', columnDefinitions: creditosPendientesColumns, card: CreditosPendientesCard, data: creditosPendientes},
    { label: 'Aceptados', columnDefinitions: creditosAceptadosColumns, card: CreditosAceptadosCard, data: creditosAceptados},
    { label: 'Rechazados', columnDefinitions: creditosRechazadosColumns, data: creditosRechazados},
    { label: 'Finalizados', columnDefinitions: creditosFinalizadosColumns, data: creditosFinalizados},
  ];

  return(
    <Layout>
      <CreditoModalGenerarDocumentos/>      
      <CreditoModalDesembolsar/>
      <CreditoModalAceptar/>      
      <CreditoModalRechazar/>
      <CreditoModalNotas/>      

      {/* Mobile */}

      <div className="content">
        <ContentTitle title={'Tus Créditos'} subtitle={'Gestión de tus créditos'}/>
        
        <BaseTable 
          data={creditos} 
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
    </Layout>
  )
}