import { useNavigate } from "react-router-dom";
import TotalCard from "../Cards/TotalCard";
import { isMobile } from "react-device-detect";
import { formatCurrencySV } from "../../utils/currencyUtils";

export default function TabsTotals({ tabs, currentTab, setCurrentTab, className }) {
  const navigate = useNavigate();

  const handleEstadoChange = (tab) => {
    setCurrentTab(
      {
        label: tab.label ?? 'Todos',
        columns: tab.columnDefinitions ?? null,
        card: tab.card ?? null,
        data: tab.data ?? null,
        value: tab.value ?? null
      },
    );

    if ((currentTab != tab.label) && !isMobile){
      navigate(`?tab=${tab.label}`, { replace: false });
    }
  }

  return (
    <div className={`tabs-container totals ${className}`}>
      {tabs.map((tab) => (
        <TotalCard
          icon={tab.icon}
          color={tab.color}
          iconBgColor={tab.iconBgColor}
          title={tab.label}
          key={tab.label}
          className={`tab ${currentTab === tab.label && 'active'}`}
          onClick={() => handleEstadoChange(tab)}
        >
          <div className="color-accent">
            {tab.isLoading
            ?
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="spinner" style={{ width: '12px', height: '12px' }}></div>
              </div>
            : tab.text
            ?
              <div>
                <span className={`color-${tab.color}`}>{tab.text}</span>
              </div>            
            :
              <div>
                <i className={`fas fa-dollar-sign color-${tab.color}`}/>
                <span className={`color-${tab.color}`}>{formatCurrencySV(tab.value)}</span>
              </div>
            }
          </div>
        </TotalCard>
      ))}
    </div>
  );
}