import { Link } from "react-router-dom"

export default function NavbarLanding() {
  return (
    <div className="navbar">
      <div className="navbar-header">
        <Link to={'./'}>
          <img className="logo" src="/images/logo.png" alt="Multipréstamos ATLAS"/>
        </Link>
      </div>

      <div className="navbar-content">
        <div className="button-container">
          <Link className="btn-ghost active">Inicio</Link>
          <Link className="btn-ghost">Nosotros</Link>
          <Link className="btn-ghost">Servicios</Link>
          <Link className="btn-ghost">Contacto</Link>
          <Link className="btn-warning">REGISTRARSE</Link>
          <Link className="btn-warning" to={'./admin/'}>INICIAR SESIÓN</Link>
        </div>
      </div>
    </div>
  )
}