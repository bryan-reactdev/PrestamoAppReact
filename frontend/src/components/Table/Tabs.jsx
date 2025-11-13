import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

export default function Tabs({ tabs, currentTab, setCurrentTab, className }) {
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
    <div className={`tabs-container ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`flex gap-2 ${currentTab === tab.label ? 'active-tab' : 'inactive-tab'}`}
          onClick={() => handleEstadoChange(tab)}
        >
          <span className="text-xs font-medium">{tab.label}</span>

          {tab.value && (
            <Badge className="text-xs font-medium" variant="secondary">
              {tab.value}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}