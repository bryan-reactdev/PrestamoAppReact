export default function TotalCard({icon, className, iconBgColor = 'success', title, children, isLoading = false, ...props}) {
  return (
    <div className={`total-card ${className}`} {...props}>
        <i className={`${icon} ${iconBgColor}`}/>

        <div className={`total-content`}>
            <h4>{title}</h4>
            <div className="total-children">
              {isLoading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                children
              )}
            </div>
        </div>
    </div>
  )
}