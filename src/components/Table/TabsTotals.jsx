import { useNavigate } from "react-router-dom";
import TotalCard from "../Cards/TotalCard";
import { isMobile } from "react-device-detect";

export default function TabsTotals({ tabs, currentTab, setCurrentTab }) {
  const navigate = useNavigate();

  const handleEstadoChange = (tab) => {
    setCurrentTab(
      {
        label: tab.label ?? 'Todos',
        columns: tab.columnDefinitions ?? null,
        card: tab.card ?? null,
        data: tab.data ?? null
      },
    );

    if ((currentTab != tab.label) && !isMobile){
      navigate(`?tab=${tab.label}`, { replace: false });
    }
  }

  return (
    <div className="tabs-container totals">
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
            {tab.text
            ?
              <div>
                <span className={`color-${tab.color}`}>{tab.text}</span>
              </div>            
            :
              <div>
                <i className={`fas fa-dollar-sign color-${tab.color}`}/>
                <span className={`color-${tab.color}`}>{tab.value}</span>
              </div>
            }
          </div>
        </TotalCard>
      ))}
    </div>
  );
}