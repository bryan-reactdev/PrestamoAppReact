import { useNavigate } from "react-router-dom";
import { formatCurrencySV } from "../../../../utils/currencyUtils";

export default function StatCard({ title, titleIcon, value, color, actions, to, children }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (to) navigate(to);
  };

  return (
    <div
      className="stat-card-container"
      style={{ borderColor: `var(--color-${color})`}}
      onClick={handleCardClick}
    >
      <div className={`stat-header color-${color}`}>
        <i className={titleIcon} />
        <h3>{title}</h3>

        <div className="stat-header-actions">
          {actions}
        </div>
      </div>

      <div className="stat-content">
        <div className={`stat-value color-${color} ${value < 0 && 'color-danger'}`}>
          {(value === null) || (value === undefined) || (isNaN(value))
            ? <div> <i className="fas fa-dollar-sign" /> <div className="spinner" /> </div>
            : <p><i className='fas fa-dollar-sign' /> <strong>{formatCurrencySV(value)}</strong></p>
          }
        </div>

        <div className="stat-summary">
          {children}
        </div>

        <div className="stat-graph" />
      </div>
    </div>
  );
}
