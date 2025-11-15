import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { formatCurrencySV } from "../../utils/currencyUtils";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";

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

  const getIconBgColor = (iconBgColor) => {
    const colorMap = {
      'success': 'var(--color-success)',
      'success-light': 'var(--color-success-light)',
      'warning': 'var(--color-warning)',
      'danger': 'var(--color-danger)',
      'accent': 'var(--color-accent)',
      'accent-light': 'var(--color-accent-light)',
      'primary': 'var(--color-primary)'
    };
    return colorMap[iconBgColor] || 'var(--color-warning)';
  }

  return (
    <div className={`tabs-container totals ${className}`}>
      {tabs.map((tab) => {
        const hasValue = tab.value !== null && tab.value !== undefined;
        const hasText = tab.text !== null && tab.text !== undefined;
        const showBadge = hasValue && hasText;
        const mainText = hasValue ? formatCurrencySV(tab.value) : (hasText ? tab.text : null);
        const isActive = typeof currentTab === 'object' ? currentTab?.label === tab.label : currentTab === tab.label;

        return (
          <Card
            key={tab.label}
            style={{
              background: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "white",
              border: isActive ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.25)"
            }}
            className={`@container/card tab ${isActive && 'active'} cursor-pointer min-w-[150px] max-w-full flex-1 p-3 transition-all duration-150 relative ${
              isActive 
                ? 'scale-[0.97] bg-[var(--color-accent-light)] border-white border' 
                : 'hover:brightness-110'
            }`}
            onClick={() => handleEstadoChange(tab)}
          >
            {showBadge && (
              <Badge variant="default" className="absolute top-2 right-2 w-fit">
                {tab.text}
              </Badge>
            )}

            <CardHeader className="flex flex-row p-0">
              <div className="flex items-center gap-2 w-full">
                <div 
                  className='flex items-center justify-center p-3 px-4 rounded-md shrink-0'
                  style={{ backgroundColor: getIconBgColor(tab.iconBgColor) }}
                >
                  <i className={`${tab.icon} text-white !text-lg`} />
                </div>

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <CardDescription className="whitespace-nowrap truncate text-white">{tab.label}</CardDescription>
                  {tab.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="spinner w-3 h-3"></div>
                    </div>
                  ) : mainText ? (
                    <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-xl m-0 p-0 whitespace-nowrap truncate text-white">
                      {hasValue ? `$${mainText}` : mainText}
                    </CardTitle>
                  ) : null}
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}