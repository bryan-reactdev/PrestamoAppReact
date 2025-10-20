import { useUsuarioStore } from '../../stores/useUsuarioStore';
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import MenuButton from '../../components/Content/Layout/MenuButton'

export default function AdminDashboard(){
  const {currentUsuario} = useUsuarioStore();

  return(
    <div className="page">
      <Navbar/>

      <Sidebar activePage={'dashboard'}/>
      <div className="content">
        <ContentTitle title={"Panel de Control"} subtitle={"Panel de Control de Multipréstamos Atlas"} />

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
            icon={'fas fa-user-pen'}
            color={'orange'}
            title={'Editar Cuenta'} 
            subtitle={'Gestiona tu cuenta'} 
            footer={'Edita tu cuenta'}
          />

        </div>
      </div>
      
    </div>
  )
}