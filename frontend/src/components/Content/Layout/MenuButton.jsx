import { Link } from "react-router-dom";

export default function MenuButton({color, icon, title, subtitle, footer, to, hidden = false, ...props}) {
  return (
    <Link 
      className={`menu-button ${hidden ? 'hidden' : ''}`} 
      to={to} 
      {...props}
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "12px",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
        <div 
          className="menu-button-header" 
          style={{display:"flex", alignItems:"center", gap:"10px"}}
        >
            <i className={`${icon} ${color}`} style={{color:"white"}}/>
            <div className="menu-button-title">
                <h2 style={{margin:0, color:"white"}}>{title}</h2>
                <span style={{color:"white"}}>{subtitle}</span>
            </div>
        </div>

        <div 
          className="menu-button-footer"
          style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            color:"white",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "8px 10px",
            borderRadius: "10px"
          }}
        >
            {footer}
            <i className='fas fa-arrow-right' style={{color:"white"}}/>
        </div>
    </Link>
  )
}
