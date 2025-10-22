import { Link } from "react-router-dom";

export default function MenuButton({color, icon, title, subtitle, footer, to, hidden = false}) {
  return (
    <Link className={`menu-button ${hidden ? 'hidden' : ''}`} to={to}>
        <div className="menu-button-header">
            <i className={`${icon} ${color}`}/>
            <div className="menu-button-title">
                <h2>{title}</h2>
                <span>{subtitle}</span>
            </div>
        </div>

        <div className="menu-button-footer">
            {footer}
            <i className='fas fa-arrow-right'/>
        </div>
    </Link>
  )
}
