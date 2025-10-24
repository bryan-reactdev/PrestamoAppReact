import { Link } from 'react-router-dom'

export default function SidebarItem({children, icon, active, to, ...props}) {
    return(
        <Link className={active ? 'sidebar-item active' : 'sidebar-item'} to={to} {...props}>
            <i className={icon}></i>
            <label>{children}</label>
        </Link>
    )
}