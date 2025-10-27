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
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import TotalCard from '../../components/Cards/TotalCard'

export default function AdminCreditos(){
  const { usuarioId } = useParams();
  const {filterCreditos, filteredCreditos, isFetchingCreditos, getCreditos } = useCreditoStore();
  const [currentTipo, setCurrentTipo] = useState('rapi-cash');
  const [currentTab, setCurrentTab] = useState('Pendientes');

  useEffect(() => {
    getCreditos(usuarioId ?? null);
  }, [getCreditos, usuarioId]);

  useEffect(() =>{
    filterCreditos(currentTipo);
  }, [currentTipo])

  const centered = ['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion']

  // Main tipo tabs (higher level)
  const tipoTabs = [
    { 
      icon: 'fas fa-money-bill', 
      label: 'Rapi-Cash', 
      value: filteredCreditos?.totalRapicash,
      iconBgColor: 'success',
      onClick: () => setCurrentTipo('rapi-cash'),
      isActive: currentTipo === 'rapi-cash'
    },
    { 
      icon: 'fas fa-ring', 
      label: 'Prendarios', 
      value: filteredCreditos?.totalPrendarios,
      iconBgColor: 'warning',
      onClick: () => setCurrentTipo('prendario'),
      isActive: currentTipo === 'prendario'
    },
    { 
      icon: 'fas fa-landmark', 
      label: 'Hipotecarios', 
      value: filteredCreditos?.totalHipotecarios,
      iconBgColor: 'accent',
      onClick: () => setCurrentTipo('hipotecario'),
      isActive: currentTipo === 'hipotecario'
    }
  ];

  // Estado tabs (filtered by current tipo)
  const estadoTabs = [
    { 
      label: 'Pendientes', 
      columnDefinitions: creditosPendientesColumns, 
      data: filteredCreditos.creditosPendientes,
      card: CreditosPendientesCard
    },
    { 
      label: 'Aceptados', 
      columnDefinitions: creditosAceptadosColumns, 
      data: filteredCreditos.creditosAceptados,
      card: CreditosAceptadosCard
    },
    { 
      label: 'Rechazados', 
      columnDefinitions: creditosRechazadosColumns, 
      data: filteredCreditos.creditosRechazados,
      card: CreditosDefaultCard
    },
    { 
      label: 'Finalizados', 
      columnDefinitions: creditosFinalizadosColumns, 
      data: filteredCreditos.creditosFinalizados,
      card: CreditosDefaultCard
    }
  ];

  return(
    <div className="page">
      <CreditoModalGenerarDocumentos/>      
      <CreditoModalDesembolsar/>
      <CreditoModalAceptar/>      
      <CreditoModalRechazar/>      

      {/* Mobile */}

      <Navbar/>
      <Sidebar activePage={'creditos'}/>

      <div className="content">
        <ContentTitleWithInfo>
          {tipoTabs.map((tab) => (
            <TotalCard 
              key={tab.label}
              onClick={tab.onClick} 
              className={`tab ${tab.isActive ? 'active' : ''} w-bg ${isFetchingCreditos ? 'disabled' : ''}`} 
              icon={tab.icon} 
              iconBgColor={tab.iconBgColor} 
              title={tab.label}
            >
              <h3 className={`color-${tab.iconBgColor}`}>{tab.value}</h3>
            </TotalCard>
          ))}
        </ContentTitleWithInfo>
        
        <BaseTable 
          data={filteredCreditos.creditos} 
          columns={creditosTodosColumns} 
          card={estadoTabs.find(tab => tab.label === currentTab)?.card || CreditosDefaultCard}
          centered={centered} 
          flexable='usuario' 
          loading={isFetchingCreditos}
          tabs={estadoTabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCardTabs={false}
        />
      </div>
    </div>
  )
}