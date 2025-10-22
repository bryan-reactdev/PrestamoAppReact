import { Link } from "react-router-dom"

export default function NavbarLanding({activePage = 'inicio'}) {
  return (
    <div className="navbar">
      <div className="navbar-header">
        <Link to={'/'}>
          <img className="logo" src="/images/logo.png" alt="Multipréstamos ATLAS"/>
        </Link>
      </div>

      <div className="navbar-content">
        <div className="button-container">
          <Link className={`btn-ghost ${activePage === 'inicio' && 'active'}`} to={'/'}>Inicio</Link>
          <Link className={`btn-ghost ${activePage === 'nosotros' && 'active'}`}>Nosotros</Link>
          <Link className={`btn-ghost ${activePage === 'servicios' && 'active'}`}>Servicios</Link>
          <Link className={`btn-ghost ${activePage === 'contacto' && 'active'}`} to={'/admin/creditos'}>Contacto</Link>
          <Link className={`${activePage === 'register' ? 'btn-warning active' : 'btn-warning'}`} to={'/register'}>REGISTRARSE</Link>
          <Link className={`${activePage === 'login' ? 'btn-warning active' : 'btn-warning'}`} to={'/login'}>INICIAR SESIÓN</Link>
        </div>
      </div>
    </div>
  )
}