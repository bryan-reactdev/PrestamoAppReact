import { useNavigate } from "react-router-dom";
import TotalCard from "../Cards/TotalCard";

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

    if (currentTab != tab.label){
      navigate(`?tab=${tab.label}`, { replace: false });
    }
  }

  return (
    <div className="tabs-container">
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
            <i className="fas fa-dollar-sign"/>
            <span>{tab.value}</span>
          </div>
        </TotalCard>
      ))}
    </div>
  );
}