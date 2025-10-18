export default function StatSummaryItem({children, value, color}) {
  return (
    <div className="stat-summary-item">
        <p className={`stat-summary-item-title color-${color}`}>{children}</p>
        <p className={`stat-summary-item-value color-${color}`}><i className='fas fa-dollar-sign dollar'/><strong>{value}</strong></p>
    </div>
  )
}
