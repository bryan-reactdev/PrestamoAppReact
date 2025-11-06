import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";

export default function Tabs({ tabs, currentTab, setCurrentTab, className }) {
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
    <div className={`tabs-container ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={currentTab === tab.label ? 'active-tab' : 'inactive-tab'}
          onClick={() => handleEstadoChange(tab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}