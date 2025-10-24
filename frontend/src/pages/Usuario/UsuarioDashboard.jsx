import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import MenuButton from '../../components/Content/Layout/MenuButton'
import UsuarioSidebar from '../../components/Sidebar/UsuarioSidebar'
import { useUsuarioModalStore } from '../../stores/Modal/useUsuarioModalStore'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'

export default function UsuarioDashboard(){
  const {verDetalles, openModal} = useUsuarioModalStore();

  return(
    <div className="page">
      <UsuarioModalVerDetalles/>

      <Navbar/>

      <UsuarioSidebar activePage={'dashboard'}/>
      <div className="content">
        <ContentTitle title={"Inicio"} />

        <div className="menu-container">
          <MenuButton 
            icon={'fas fa-file'}
            color={'accent-light'}
            title={'Solicitar Crédito'} 
            subtitle={'Solicita un crédito'} 
            footer={'Ir al formulario'}
            to={'/usuario/solicitar'}
          />

          <MenuButton 
            icon={'fas fa-credit-card'}
            color={'danger'}
            title={'Tus Créditos'} 
            subtitle={'Gestiona todos tus créditos'} 
            footer={'Mostrar tabla de tus créditos'}
            to={'/usuario/creditos'}
          />

          <MenuButton 
            icon={'fas fa-user-pen'}
            color={'orange'}
            title={'Editar Cuenta'} 
            subtitle={'Gestiona tu cuenta'} 
            footer={'Edita tu cuenta'}
            onClick={() => {
              openModal('verDetalles', null)
            }}
          />
        </div>
      </div>
      
    </div>
  )
}