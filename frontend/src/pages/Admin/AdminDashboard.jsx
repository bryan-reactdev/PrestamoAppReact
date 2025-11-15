import MenuButton from '../../components/Content/Layout/MenuButton'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import CurrencyModalPDFDiario from '../../components/Modal/Currency/CurrencyModalPDFDiario'
import { useModalStore } from '../../stores/Modal/useModalStore'

import Layout from '../../Layout'
import { Button } from '../../components/ui/button'

export default function AdminDashboard(){
  const { openModal: openPDFModal } = useModalStore();
  
  return(
    <Layout>
      <UsuarioModalVerDetalles/>
      <CurrencyModalPDFDiario/>

      <div className="content">
        <div className="menu-container mt-10">
          <MenuButton 
            icon={'fas fa-credit-card'}
            color={'accent-light'}
            title={'Créditos'} 
            subtitle={'Gestiona todos los créditos'} 
            footer={'Mostrar tabla de créditos'}
            to={'./creditos'}
          />

          <MenuButton 
            icon={'fas fa-wallet'}
            color={'accent-light'}
            title={'Cobros'} 
            subtitle={'Gestiona todos los cobros'} 
            footer={'Mostrar tabla de cobros'}
            to={'./cobros'}
          />

          <MenuButton 
            icon={'fas fa-cash-register'}
            color={'accent-light'}
            title={'Caja Chica'} 
            subtitle={'Gestiona la caja chica'} 
            footer={'Mostrar información de la caja chica'}
            to={'./caja'}
          />

          <MenuButton 
            icon={'fas fa-history'}
            color={'accent-light'}
            title={'Historial'} 
            subtitle={'Gestiona el historial'} 
            footer={'Mostrar tabla de historial'}
            to={'./historial'}
          />

          <MenuButton 
            icon={'fas fa-users'}
            color={'accent-light'}
            title={'Usuarios'} 
            subtitle={'Gestiona todos los usuarios'} 
            footer={'Mostrar tabla de usuarios'}
            to={'./usuarios'}
          />

          <MenuButton 
            icon={'fas fa-chart-line'}
            color={'accent-light'}
            title={'Estadísticas'} 
            subtitle={'Gestiona las estadísticas'} 
            footer={'Mostrar estadísticas'}
            to={'./estadisticas'}
          />

        </div>

        <div className="w-full mt-20">
          <Button className='w-full max-w-[300px] h-15 mx-auto flex items-center justify-center gap-2' onClick={() => openPDFModal('pdfDiario')}>
            <i className='fas fa-print'/>
            GENERAR REPORTE DIARIO PDF
          </Button>
        </div>
      </div>
      
    </Layout>
  )
}