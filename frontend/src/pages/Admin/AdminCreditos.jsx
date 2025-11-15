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
import CreditoModalNotas from '../../components/Modal/Credito/CreditoModalNotas'
import { useParams } from 'react-router-dom'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { formatCurrencySV } from '../../utils/currencyUtils'

export default function AdminCreditos() {
  const { usuarioId } = useParams();
  const { filterCreditos, filteredCreditos, isFetchingCreditos, getCreditos, currentTipo: storeCurrentTipo } = useCreditoStore();
  const [currentTipo, setCurrentTipo] = useState(storeCurrentTipo || 'rapi-cash');
  const [currentTab, setCurrentTab] = useState('Pendientes');

  useEffect(() => {
    getCreditos(usuarioId ?? null);
  }, [getCreditos, usuarioId]);

  useEffect(() => {
    if (storeCurrentTipo && storeCurrentTipo !== currentTipo) {
      setCurrentTipo(storeCurrentTipo);
    }
  }, [storeCurrentTipo]);

  useEffect(() => {
    filterCreditos(currentTipo);
  }, [currentTipo, filterCreditos]);

  const centered = ['estado', 'calificacion', 'monto', 'montoDesembolsar', 'mora', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion'];

  const getIconBgColor = (iconBgColor) => {
    const colorMap = {
      'success': 'var(--color-accent-light)',
      'success-light': 'var(--color-accent-light)',
      'warning': 'var(--color-accent-light)',
      'danger': 'var(--color-danger)',
      'accent': 'var(--color-accent-light)',
      'accent-light': 'var(--color-accent-light)',
      'primary': 'var(--color-primary)'
    };
    return colorMap[iconBgColor] || 'var(--color-warning)';
  };

  const tipoTabs = [
    {
      icon: 'fas fa-money-bill',
      label: 'Rapi-Cash',
      text: filteredCreditos?.totalRapicash?.length,
      value: filteredCreditos?.totalRapicash?.monto,
      iconBgColor: 'success',
      onClick: () => setCurrentTipo('rapi-cash'),
      isActive: currentTipo === 'rapi-cash'
    },
    {
      icon: 'fas fa-ring',
      label: 'Prendarios',
      text: filteredCreditos?.totalPrendarios?.length,
      value: filteredCreditos?.totalPrendarios?.monto,
      iconBgColor: 'warning',
      onClick: () => setCurrentTipo('prendario'),
      isActive: currentTipo === 'prendario'
    },
    {
      icon: 'fas fa-landmark',
      label: 'Hipotecarios',
      text: filteredCreditos?.totalHipotecarios?.length,
      value: filteredCreditos?.totalHipotecarios?.monto,
      iconBgColor: 'accent',
      onClick: () => setCurrentTipo('hipotecario'),
      isActive: currentTipo === 'hipotecario'
    }
  ];

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

  return (
    <Layout>
      <CreditoModalGenerarDocumentos />
      <CreditoModalDesembolsar />
      <CreditoModalAceptar />
      <CreditoModalRechazar />
      <CreditoModalNotas />

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
                  style={{
                    background: tab.isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)",
                    backdropFilter: tab.isActive ? "blur(20px)" : "blur(12px)",
                    WebkitBackdropFilter: tab.isActive ? "blur(10px)" : "blur(12px)",
                    iconBgColor: getIconBgColor(tab.iconBgColor),
                    color: "white",
                    border: tab.isActive ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.25)",
                    boxShadow: tab.isActive ? "0 4px 16px 0 rgba(31, 38, 135, 0.25)" : undefined
                  }}
                  className={`@container/card tab cursor-pointer min-w-[150px] max-w-full flex-1 p-3 transition-all duration-150 relative
                    ${tab.isActive ? 'scale-[0.97]' : 'hover:brightness-110'}
                    ${isFetchingCreditos ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={tab.onClick}
                >
                  {showBadge && (
                    <Badge variant="default" className="absolute top-2 right-2 w-fit">
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
                        <CardDescription className="whitespace-nowrap truncate text-white">
                          {tab.label}
                        </CardDescription>

                        {isFetchingCreditos ? (
                          <div className="flex items-center gap-2">
                            <div className="spinner w-3 h-3"></div>
                          </div>
                        ) : mainText ? (
                          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-xl m-0 p-0 whitespace-nowrap truncate text-white">
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
          tabs={estadoTabs.map(t => ({
            ...t,
            tabLabelClass: "text-white font-bold",
            tabActiveClass: "bg-[var(--color-accent-light)] text-white font-bold",
            tabInactiveClass: "text-white/70 hover:text-white"
          }))}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCardTabs={false}
        />
      </div>
    </Layout>
  );
}
