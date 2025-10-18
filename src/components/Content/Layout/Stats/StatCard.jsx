export default function StatCard({title, titleIcon, value, color, actions, children}) {
  return (
    <div className="stat-card-container" style={{ borderColor: `var(--color-${color})` }}>
        <div className={`stat-header color-${color}`}>
            <i className={titleIcon}/>
            <h3>{title}</h3>

            <div className="stat-header-actions">
                {actions}
            </div>
        </div>
        
        <div className="stat-content">
            <div className={`stat-value color-${color} ${value < 0 && 'color-danger'}`}>
                {value 
                    ? <p><i className='fas fa-dollar-sign'/> <strong>{value}</strong></p>
                    : <div> <i className="fas fa-dollar-sign"/> <div className="spinner"/> </div>
                }
            </div>
            
            <div className="stat-summary">
                {children}
            </div>

            <div className="stat-graph">

            </div>
        </div>
    </div>
  )
}
