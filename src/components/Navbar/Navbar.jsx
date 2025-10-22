import { isMobile } from "react-device-detect"
import { Link } from "react-router-dom"
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { useState } from "react";

export default function Navbar() {
  const { currentUsuario, logout } = useUsuarioStore();
  const [showDropdown, setShowDropdown] = useState();

  return (
    <div className="navbar">
      <div className="navbar-header">
        <Link className="btn-transparent" style={{width: '100%', margin: 0, padding: 0}} to={'/'}>
          <h1>MULTIPRÉSTAMOS ATLAS</h1>
        </Link>
      </div>
      <div className="navbar-content">
        <div className="user-nav" style={{position: 'relative'}}>
          <button className="btn-transparent" onClick={() => setShowDropdown(!showDropdown)}>
            {!isMobile && 
              <p className="username">{currentUsuario.nombres + ' ' + currentUsuario.apellidos}</p>
            }
            <i className="fas fa-caret-down"/>
          </button>
          
          <div className="dropdown" style={{display: showDropdown ? '' : 'none'}}>
            <Link className="btn-accion" to={'/'} onClick={() => logout()}>
              <i className="fas fa-right-from-bracket"/>
              Log Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}