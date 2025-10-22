export default function TotalCard({icon, className, iconBgColor = 'success', title, children, ...props}) {
  return (
    <div className={`total-card ${className}`} {...props}>
        <i className={`${icon} ${iconBgColor}`}/>

        <div className={`total-content`}>
            <h4>{title}</h4>
            <div className="total-children">
              {children}
            </div>
        </div>
    </div>
  )
}