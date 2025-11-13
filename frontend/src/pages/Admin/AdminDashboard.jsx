import ContentTitle from '../../components/Content/ContentTitle'
import MenuButton from '../../components/Content/Layout/MenuButton'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import { useUsuarioModalStore } from '../../stores/Modal/useUsuarioModalStore'

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { TrendingUp } from "lucide-react";

import Layout from '../../Layout'

export default function AdminDashboard(){
  const { openModal } = useUsuarioModalStore();
  
  return(
    <Layout>
      <UsuarioModalVerDetalles/>

      <div className="content">
        <ContentTitle title={"Panel de Control"} />

        <div className="menu-container">
          <MenuButton 
            icon={'fas fa-credit-card'}
            color={'danger'}
            title={'Créditos'} 
            subtitle={'Gestiona todos los créditos'} 
            footer={'Mostrar tabla de créditos'}
            to={'./creditos'}
          />

          <MenuButton 
            icon={'fas fa-wallet'}
            color={'danger'}
            title={'Cobros'} 
            subtitle={'Gestiona todos los cobros'} 
            footer={'Mostrar tabla de cobros'}
            to={'./cobros'}
          />

          <MenuButton 
            icon={'fas fa-cash-register'}
            color={'danger'}
            title={'Caja Chica'} 
            subtitle={'Gestiona la caja chica'} 
            footer={'Mostrar información de la caja chica'}
            to={'./caja'}
          />

          <MenuButton 
            icon={'fas fa-history'}
            color={'success'}
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
      </div>
      
    </Layout>
  )
}