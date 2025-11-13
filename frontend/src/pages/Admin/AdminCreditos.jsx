import Layout from '../../Layout'
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
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { formatCurrencySV } from '../../utils/currencyUtils'

export default function AdminCreditos(){
  const { usuarioId } = useParams();
  const {filterCreditos, filteredCreditos, isFetchingCreditos, getCreditos, currentTipo: storeCurrentTipo } = useCreditoStore();
  const [currentTipo, setCurrentTipo] = useState(storeCurrentTipo || 'rapi-cash');
  const [currentTab, setCurrentTab] = useState('Pendientes');

  useEffect(() => {
    getCreditos(usuarioId ?? null);
  }, [getCreditos, usuarioId]);

  // Sync local state with store when store changes
  useEffect(() => {
    if (storeCurrentTipo && storeCurrentTipo !== currentTipo) {
      setCurrentTipo(storeCurrentTipo);
    }
  }, [storeCurrentTipo]);

  useEffect(() =>{
    filterCreditos(currentTipo);
  }, [currentTipo, filterCreditos])

  const centered = ['estado', 'calificacion', 'monto', 'montoDesembolsar', 'mora', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion']

  const getIconBgColor = (iconBgColor) => {
    const colorMap = {
      'success': 'var(--color-success)',
      'success-light': 'var(--color-success-light)',
      'warning': 'var(--color-warning)',
      'danger': 'var(--color-danger)',
      'accent': 'var(--color-accent)',
      'accent-light': 'var(--color-accent-light)',
      'primary': 'var(--color-primary)'
    };
    return colorMap[iconBgColor] || 'var(--color-warning)';
  }

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
      card: CreditosPendientesCard,
      value: filteredCreditos.creditosPendientes?.length ?? 0
    },
    { 
      label: 'Aceptados', 
      columnDefinitions: creditosAceptadosColumns, 
      data: filteredCreditos.creditosAceptados,
      card: CreditosAceptadosCard,
      value: filteredCreditos.creditosAceptados?.length ?? 0
    },
    { 
      label: 'Rechazados', 
      columnDefinitions: creditosRechazadosColumns, 
      data: filteredCreditos.creditosRechazados,
      card: CreditosDefaultCard,
      value: filteredCreditos.creditosRechazados?.length ?? 0
    },
    { 
      label: 'Finalizados', 
      columnDefinitions: creditosFinalizadosColumns, 
      data: filteredCreditos.creditosFinalizados,
      card: CreditosDefaultCard,
      value: filteredCreditos.creditosFinalizados?.length ?? 0
    }
  ];

  return(
    <Layout>
      <CreditoModalGenerarDocumentos/>      
      <CreditoModalDesembolsar/>
      <CreditoModalAceptar/>      
      <CreditoModalRechazar/>      

      <div className="content">
        <ContentTitleWithInfo>
          <div className="w-full flex flex-row gap-2">
            {tipoTabs.map((tab) => {
              const hasValue = tab.value !== null && tab.value !== undefined;
              const hasText = tab.text !== null && tab.text !== undefined;
              const showBadge = hasValue && hasText;
              const mainText = hasValue ? formatCurrencySV(tab.value) : (hasText ? tab.text : null);

              return (
                <Card
                  key={tab.label}
                  className={`@container/card tab ${tab.isActive ? 'active' : ''} cursor-pointer min-w-[150px] max-w-full flex-1 p-3 transition-all duration-150 relative ${
                    tab.isActive 
                      ? 'scale-[0.975] bg-[var(--color-accent-light)] border-[var(--border-width-sm)] border-[var(--color-accent)]' 
                      : 'hover:brightness-90'
                  } ${isFetchingCreditos ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={tab.onClick}
                >
                  {showBadge && (
                    <Badge variant="default" className={`absolute top-2 right-2 w-fit truncate ${tab.isActive ? 'text-white' : ''}`}>
                      {tab.text}
                    </Badge>
                  )}
                  <CardHeader className="flex flex-row p-0">
                    <div className="flex items-center gap-2 w-full">
                      <div 
                        className='flex items-center justify-center p-3 px-4 rounded-md shrink-0'
                        style={{ backgroundColor: getIconBgColor(tab.iconBgColor) }}
                      >
                        <i className={`${tab.icon} text-white !text-lg`} />
                      </div>

                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <CardDescription className={`whitespace-nowrap truncate ${tab.isActive ? 'text-white' : ''}`}>{tab.label}</CardDescription>
                        {isFetchingCreditos ? (
                          <div className="flex items-center gap-2">
                            <div className="spinner w-3 h-3"></div>
                          </div>
                        ) : mainText ? (
                          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-xl m-0 p-0 whitespace-nowrap truncate ${tab.isActive ? 'text-white' : ''}`}>
                            {hasValue ? `$${mainText}` : mainText}
                          </CardTitle>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
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
    </Layout>
  )
}