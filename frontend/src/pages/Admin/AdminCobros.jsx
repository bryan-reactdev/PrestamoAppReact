import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosConVencidasColumns, usuariosConVencidasMorososColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import ContentTitleWithInfo from '../../components/Content/ContentTitleWithInfo'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import UsuarioModalVerDetallesCobro from '../../components/Modal/Usuario/UsuarioModalVerDetallesCobro'
import FormField from '../../components/Form/FormField'
import { getCurrentDate } from '../../utils/dateUtils'
import { useCuotaStore } from '../../stores/useCuotaStore'
import { cuotasCobrosColumns } from '../../components/Table/Cuota/CuotaTableDefinitions'
import { CuotasPendientesCard, CuotasCobrosCard } from '../../components/Card/Cuota/CuotaCardDefinitions'
import CuotaModalMarcarPagado from '../../components/Modal/Cuota/CuotaModalMarcarPagado'
import CuotaModalAbonar from '../../components/Modal/Cuota/CuotaModalAbonar'
import CuotaModalNotas from '../../components/Modal/Cuota/CuotaModalNotas'
import CuotaModalEditar from '../../components/Modal/Cuota/CuotaModalEditar'
import { formatCurrencySV } from '../../utils/currencyUtils'
import Layout from '../../Layout'
import { Button } from '../../components/ui/button'

export default function AdminCobros(){
  const {usuariosConVencidas, isFetchingUsuariosConVencidas, getUsuariosConVencidas, usuariosConCuotas, isFetchingUsuariosConCuotas, getUsuariosConCuotas, descargarPDFCobros} = useUsuarioStore();
  const {cuotasForMapeo, isFetchingCuotas, getCuotas, selectedDate, setSelectedDate} = useCuotaStore();
  const {cuotasTotales, getCuotasTotales, isFetchingCuotasTotales} = useCurrencyStore();
  const [currentTab, setCurrentTab] = useState('');

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (usuariosConVencidas.length === 0) {
      getUsuariosConVencidas();
    }
    if (usuariosConCuotas.length === 0) {
      getUsuariosConCuotas();
    }
    getCuotasTotales();
    getCuotas();
  }, [getUsuariosConVencidas, getUsuariosConCuotas, getCuotasTotales, getCuotas]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['calificacion', 'estado', 'celular', 'fechaVencimiento', 'cuotaVencimiento', 'cuotaMonto', 'cuotaMora', 'cuotaAbono', 'cuotaTotal', 'monto', 'mora', 'abono', 'total', 'totalPagar', 'creditoMonto', 'cuotasPendientes', 'cuotasVencidas', 'direccion', 'referencias', 'parentesco', 'referenciasCelular', 'accion']

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

  const summaryCards = [
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'warning',
      label: 'Pendientes a Cobrar',
      value: cuotasTotales?.totalPendientes,
      isLoading: isFetchingCuotasTotales
    },
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'danger',
      label: 'Vencidas a Cobrar',
      value: cuotasTotales?.totalVencidas,
      isLoading: isFetchingCuotasTotales
    },
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'primary',
      label: 'Total a Cobrar',
      value: cuotasTotales?.totalVencidas + cuotasTotales?.totalPendientes,
      isLoading: isFetchingCuotasTotales
    },
    {
      icon: 'fas fa-chart-line',
      iconBgColor: 'success',
      label: 'Pagadas Totales',
      value: cuotasTotales?.totalPagadas,
      isLoading: isFetchingCuotasTotales
    },
  ];

  const tabs = [
    { icon: 'fas fa-users',  iconBgColor: 'accent-light', color: 'warning', label: 'Mapeo de Cuotas', value: cuotasForMapeo?.reduce((sum, cuota) => sum + (cuota.cuotaTotal || 0), 0) ?? 0, text: cuotasForMapeo?.length ?? 0, isLoading: isFetchingCuotas, data: cuotasForMapeo, card: CuotasCobrosCard, columnDefinitions: cuotasCobrosColumns},
    { icon: 'fas fa-check', iconBgColor: 'accent-light', color: 'warning', label: 'Listado de Clientes Al Día', value: cuotasTotales?.totalPendientes ?? 0, text: usuariosConCuotas?.length ?? 0, isLoading: isFetchingUsuariosConCuotas, data: usuariosConCuotas, card: UsuariosCard, columnDefinitions: usuariosConVencidasColumns},
    { icon: 'fas fa-warning', iconBgColor: 'accent-light', color: 'danger', label: 'Listado de Clientes Morosos', value: cuotasTotales?.totalVencidas ?? 0, text: usuariosConVencidas?.length ?? 0, isLoading: isFetchingUsuariosConVencidas, data: usuariosConVencidas, card: UsuariosCard, columnDefinitions: usuariosConVencidasMorososColumns},
  ];

  return(
    <Layout>
      <UsuarioModalVerDetalles/>
      <UsuarioModalVerDetallesCobro/>

      <CuotaModalMarcarPagado/>
      <CuotaModalAbonar/>
      <CuotaModalNotas/>
      <CuotaModalEditar/>

      <div className="content">
        <ContentTitleWithInfo title={''} subtitle={''}>
          <div className="w-full flex flex-row gap-2">
            {summaryCards.map((card) => {
              const hasValue = card.value !== null && card.value !== undefined;
              const mainText = hasValue ? formatCurrencySV(card.value) : null;

              return (
                <Card
                  key={card.label}
                  className="@container/card min-w-[150px] max-w-full flex-1 p-3 relative bg-transparent border-none"
                >
                  <CardHeader className="flex flex-row p-0">
                    <div className="flex items-center gap-2 w-full">
                      <div 
                        className='flex items-center justify-center p-3 px-4 rounded-md shrink-0 accent-light '
                      >
                        <i className={`${card.icon} text-primary !text-lg`} />
                      </div>

                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <CardDescription className="whitespace-nowrap truncate text-primary">{card.label}</CardDescription>
                        {card.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="spinner w-3 h-3"></div>
                          </div>
                        ) : mainText ? (
                          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-xl m-0 p-0 whitespace-nowrap truncate text-primary`}>
                            ${mainText}
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
          data={usuariosConVencidas} 
          card={UsuariosCard}
          columns={usuariosConVencidasColumns} 
          centered={centered} 
          flexable={''} 
          loading={isFetchingUsuariosConVencidas}
          customHeaderHeight={50}
          tabs={tabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCardTabs={true}
          showTabsAtTop={true}
        >

        {currentTab === "Mapeo de Cuotas" &&
          <div className="date-controls">
            <FormField
              classNames={'simple !p-0'}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Button className="btn-glass" onClick={() => setSelectedDate(getCurrentDate())}>
              <i className="fas fa-rotate"/>
              IR A HOY
            </Button>

            <Button className="btn-glass" onClick={() => setSelectedDate(null)}>
              <i className="fas fa-times"/>
              LIMPIAR
            </Button>
          </div>
        }
          {(currentTab === "Listado de Clientes Morosos" || currentTab === "Listado de Clientes Al Día") && (
            <button className='btn-danger' onClick={() => descargarPDFCobros()}>
              <i className='fas fa-print'/>PDF
            </button>
          )}
        </BaseTable>

      </div>
    </Layout>
  )
}