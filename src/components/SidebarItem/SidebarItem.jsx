import { Link } from 'react-router-dom'

export default function SidebarItem({children, icon, active, to}) {
    return(
        <Link className={active ? 'sidebar-item active' : 'sidebar-item'} to={to}>
            <i className={icon}></i>
            <label>{children}</label>
        </Link>
    )
}