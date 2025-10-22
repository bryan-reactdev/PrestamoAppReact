import { isMobile } from 'react-device-detect';
import { useModalStore } from '../../stores/Modal/useModalStore'
import SidebarItem from '../SidebarItem/SidebarItem'
import { Link } from 'react-router-dom';

export default function UsuarioSidebar({ activePage }) {
  const { sidebar } = useModalStore();

  if (isMobile) return(
    <div className="homebar">
      <Link className={`btn-homebar ${activePage === 'dashboard' && 'active'}`} to={'/usuario/'}>
        <i className="fas fa-home"/>
      </Link>
      <Link className={`btn-homebar ${activePage === 'solicitar' && 'active'}`} to={'/usuario/solicitar'}>
        <i className="fas fa-file"/>
      </Link>
      <Link className={`btn-homebar ${activePage === 'creditos' && 'active'}`} to={'/usuario/creditos'}>
        <i className="fas fa-credit-card"/>
      </Link>
    </div>
  )

  return (
    <div className={`sidebar ${sidebar ? 'open' : 'closed'}`}>
      <div className="sidebar-legend">
        NAVEGACIÓN PRINCIPAL
      </div>

      <SidebarItem icon={'fas fa-home'} active={activePage === 'dashboard'} to={'/usuario/'}>
        Inicio
      </SidebarItem>

      <SidebarItem icon={'fas fa-file'} active={activePage === 'solicitar'} to={'/usuario/solicitar'}>
        Solicitar Crédito
      </SidebarItem>

      <SidebarItem icon={'fas fa-credit-card'} active={activePage === 'creditos'} to={'/usuario/creditos'}>
        Tus Créditos
      </SidebarItem>
    </div>
  )
}