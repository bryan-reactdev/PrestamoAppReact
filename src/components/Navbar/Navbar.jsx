import { isMobile } from "react-device-detect"

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-header">
        <h1>MULTIPRÉSTAMOS ATLAS</h1>
      </div>
      <div className="navbar-content">
        <div className="user-nav">
          {!isMobile && 
            <p className="username">Usuario</p>
          }
          <button className="btn-transparent"><i className="fas fa-caret-down"/></button>
        </div>
      </div>
    </div>
  )
}