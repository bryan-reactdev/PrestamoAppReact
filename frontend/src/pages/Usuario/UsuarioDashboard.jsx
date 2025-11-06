import ContentTitle from '../../components/Content/ContentTitle'
import MenuButton from '../../components/Content/Layout/MenuButton'
import { useUsuarioModalStore } from '../../stores/Modal/useUsuarioModalStore'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import Layout from '../../Layout'

export default function UsuarioDashboard(){
  const { openModal } = useUsuarioModalStore();

  return(
    <Layout>
      <UsuarioModalVerDetalles/>

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
      
    </Layout>
  )
}