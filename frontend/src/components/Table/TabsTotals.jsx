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

        return (
          <Card
            key={tab.label}
            className={`@container/card tab ${currentTab === tab.label && 'active'} cursor-pointer min-w-[150px] max-w-full flex-1 p-3 transition-all duration-150 relative ${
              currentTab === tab.label 
                ? 'scale-[0.975] bg-[var(--color-accent-light)] border-[var(--border-width-sm)] border-[var(--color-accent)]' 
                : 'hover:brightness-90'
            }`}
            onClick={() => handleEstadoChange(tab)}
          >
            {showBadge && (
              <Badge variant="default" className={`absolute top-2 right-2 w-fit truncate ${currentTab === tab.label ? 'text-white' : ''}`}>
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
                  <CardDescription className={`whitespace-nowrap truncate ${currentTab === tab.label ? 'text-white' : ''}`}>{tab.label}</CardDescription>
                  {tab.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="spinner w-3 h-3"></div>
                    </div>
                  ) : mainText ? (
                    <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-xl m-0 p-0 whitespace-nowrap truncate ${currentTab === tab.label ? 'text-white' : ''}`}>
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