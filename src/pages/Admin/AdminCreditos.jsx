import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import { useEffect, useState } from 'react'

import { useCreditoStore } from '../../stores/useCreditoStore'
import BaseTable from '../../components/Table/BaseTable'
import { creditosAceptadosColumns, creditosFinalizadosColumns, creditosPendientesColumns, creditosRechazadosColumns, creditosTodosColumns } from '../../components/Table/Credito/CreditoTableDefinitions'
import CreditoModalDesembolsar from '../../components/Modal/Credito/CreditoModalDesembolsar'
import CreditoModalAceptar from '../../components/Modal/Credito/CreditoModalAceptar'
import { CreditosAceptadosCard, CreditosRechazadosCard } from '../../components/Card/Credito/CreditoCardDefinitions'
import CreditoModalGenerarDocumentos from '../../components/Modal/Credito/CreditoModalGenerarDocumentos'
import ModalAcciones from '../../components/Card/ModalAcciones'
import CreditoModalRechazar from '../../components/Modal/Credito/CreditoModalRechazar'
import { useParams } from 'react-router-dom'

export default function AdminCreditos(){
  const { usuarioId } = useParams();
  const {creditos, creditosPendientes, creditosAceptados, creditosRechazados, creditosFinalizados, isFetchingCreditos, getCreditos } = useCreditoStore();
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  useEffect(() => {
    getCreditos(usuarioId ?? null);
  }, [getCreditos, usuarioId]);

  const centered = ['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'desembolsado', 'accion', ]

  const tabs = [
    { label: 'Todos'},
    { label: 'Pendientes', columnDefinitions: creditosPendientesColumns, data: creditosPendientes},
    { label: 'Aceptados', columnDefinitions: creditosAceptadosColumns, card: CreditosAceptadosCard, data: creditosAceptados},
    { label: 'Rechazados', columnDefinitions: creditosRechazadosColumns, card: CreditosRechazadosCard, data: creditosRechazados},
    { label: 'Finalizados', columnDefinitions: creditosFinalizadosColumns, data: creditosFinalizados},
  ];

  return(
    <div className="page">
      <CreditoModalGenerarDocumentos/>      
      <CreditoModalDesembolsar/>
      <CreditoModalAceptar/>      
      <CreditoModalRechazar/>      

      {/* Mobile */}
      <ModalAcciones/>

      <Navbar/>
      <Sidebar activePage={'creditos'}/>

      <div className="content">
        <ContentTitle
          title={
            !usuarioId
              ? 'Créditos'
              : (
                  <div>
                    {'Créditos de '}
                    {creditos[0]?.usuario ?? 'Usuario'}
                  </div>
                )
          }
          subtitle={'Gestión de Creditos'}
        />
        
        <BaseTable 
          data={creditos} 
          columns={creditosTodosColumns} 
          card={CreditosAceptadosCard}
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