import { formatCurrencySV } from "../../../../utils/currencyUtils";

export default function StatSummaryItem({children, value, color}) {
  return (
    <div className="stat-summary-item">
        <p className={`stat-summary-item-title color-${color}`}>{children}</p>

        <div className={`stat-summary-item-value color-${color}`}>
          {(value === null) || (!Number(value) && value !== 0)
              ? <div className="loading"> <i className="fas fa-dollar-sign"/> <div className="spinner small"/> </div>
              : <p className={!color ? "color-accent" : ''}><i className='fas fa-dollar-sign'/> <strong>{formatCurrencySV(value)}</strong></p>
          }
        </div>
    </div>
  )
}
