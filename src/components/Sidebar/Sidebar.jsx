import { isMobile } from 'react-device-detect';
import { useModalStore } from '../../stores/Modal/useModalStore'
import SidebarItem from '../SidebarItem/SidebarItem'
import { Link } from 'react-router-dom';

export default function Sidebar({ activePage }) {
  const { sidebar } = useModalStore();

  if (isMobile) return(
    <div className="homebar">
      <Link className={`btn-homebar ${activePage === 'dashboard' && 'active'}`} to={'/admin/'}>
        <i className="fas fa-home"/>
      </Link>
      <Link className={`btn-homebar ${activePage === 'creditos' && 'active'}`} to={'/admin/creditos'}>
        <i className="fas fa-credit-card"/>
      </Link>
      <Link className={`btn-homebar ${activePage === 'cobros' && 'active'}`} to={'/admin/cobros'}>
        <i className="fas fa-money-bill"/>
      </Link>
      <Link className={`btn-homebar ${activePage === 'usuarios' && 'active'}`} to={'/admin/usuarios'}>
        <i className="fas fa-users"/>
      </Link>
      <Link className={`btn-homebar ${activePage === 'caja' && 'active'}`} to={'/admin/caja'}>
        <i className="fas fa-cash-register"/>
      </Link>
    </div>
  )

  return (
    <div className={`sidebar ${sidebar ? 'open' : 'closed'}`}>
      <div className="sidebar-legend">
        NAVEGACIÓN PRINCIPAL
      </div>

      <SidebarItem icon={'fas fa-home'} active={activePage === 'dashboard'} to={'/admin/'}>
        Panel de Control
      </SidebarItem>

      <SidebarItem icon={'fas fa-credit-card'} active={activePage === 'creditos'} to={'/admin/creditos'}>
        Creditos
      </SidebarItem>

      <SidebarItem icon={'fas fa-money-bill'} active={activePage === 'cobros'} to={'/admin/cobros'}>
        Cobros
      </SidebarItem>
      
      <SidebarItem icon={'fas fa-cash-register'} active={activePage === 'caja'} to={'/admin/caja'}>
        Caja Chica
      </SidebarItem>

      <SidebarItem icon={'fas fa-history'} active={activePage === 'historial'} to={'/admin/historial'}>
        Historial
      </SidebarItem>
      
      <SidebarItem icon={'fas fa-users'} active={activePage === 'usuarios'} to={'/admin/usuarios'}>
        Usuarios
      </SidebarItem>
    </div>
  )
}