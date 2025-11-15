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
      onClick={handleCardClick}
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "14px",
        padding: "16px",
        color: "white",
        cursor: to ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <div 
        className="stat-header"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          color: "white"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className={titleIcon} style={{ color: "white" }} />
          <h3 style={{ margin: 0, color: "white" }}>{title}</h3>
        </div>

        <div className="stat-header-actions" style={{ color: "white" }}>
          {actions}
        </div>
      </div>

      <div className="stat-content" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div 
          className={`stat-value ${value < 0 ? 'color-danger' : ''}`}
          style={{ color: "white" }}
        >
          {(value === null) || (value === undefined) || (isNaN(value))
            ? <div> 
                <i className="fas fa-dollar-sign" style={{ color: "white" }} /> 
                <div className="spinner" /> 
              </div>
            : <p style={{ margin: 0, color: "white" }}>
                <i className='fas fa-dollar-sign' style={{ color: "white" }} /> 
                <strong style={{ color: "white" }}>{formatCurrencySV(value)}</strong>
              </p>
          }
        </div>

        <div className="stat-summary" style={{ color: "white" }}>
          {children}
        </div>

        {/* Rectángulo eliminado */}
      </div>
    </div>
  );
}
