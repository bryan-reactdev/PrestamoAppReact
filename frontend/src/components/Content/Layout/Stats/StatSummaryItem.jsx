import { formatCurrencySV } from "../../../../utils/currencyUtils";

export default function StatSummaryItem({ children, value, color }) {
  return (
    <div className="stat-summary-item" style={{ color: 'white' }}>
      <p
        className={`stat-summary-item-title color-${color}`}
        style={{ color: 'white' }}
      >
        {children}
      </p>

      <div
        className={`stat-summary-item-value color-${color}`}
        style={{ color: 'white' }}
      >
        {(value === null) || (!Number(value) && value !== 0) ? (
          <div className="loading" style={{ color: 'white' }}>
            <i className="fas fa-dollar-sign" style={{ color: 'white' }} />
            <div className="spinner small" />
          </div>
        ) : (
          <p style={{ color: 'white' }}>
            <i className="fas fa-dollar-sign" style={{ color: 'white' }} />{" "}
            <strong style={{ color: 'white' }}>
              {formatCurrencySV(value)}
            </strong>
          </p>
        )}
      </div>
    </div>
  );
}
