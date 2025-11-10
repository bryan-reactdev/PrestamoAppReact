import { formatCurrencySV } from "../../../utils/currencyUtils";

// Helper to format date based on view type
const formatDate = (date, viewType) => {
  if (!date) return 'N/A';
  
  const dateStr = date.split('T')[0];
  const [y, m, d] = dateStr.split('-');
  
  if (viewType === 'week') {
    // For week view, show day/month
    return `${d}/${m}`;
  } else if (viewType === 'month') {
    // For month view, show day/month
    return `${d}/${m}`;
  } else {
    // For multi-month view, show month/year
    return `${m}/${y}`;
  }
};

// Helper to format period label
const formatPeriodLabel = (row, viewType) => {
  if (viewType === 'week') {
    return row.original.dayName || formatDate(row.original.date, viewType);
  } else if (viewType === 'month') {
    return row.original.dayNumber?.toString() || formatDate(row.original.date, viewType);
  } else {
    // Multi-month view
    if (row.original.monthName) {
      return row.original.monthName.charAt(0).toUpperCase() + row.original.monthName.slice(1);
    }
    return `${row.original.monthNumber || ''}/${row.original.year || ''}`;
  }
};

// Week view columns
export const weekStatsColumns = [
  {
    accessorKey: 'dayName',
    header: "Día",
    size: 100,
    cell: (props) => {
      const row = props.row.original;
      return <p>{row.dayName || formatDate(row.date, 'week')}</p>;
    }
  },
  {
    accessorKey: 'date',
    header: "Fecha",
    size: 110,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p>N/A</p>;
      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'totalIngresosCapitales',
    header: "Ingresos Capitales",
    size: 150,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-success">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'totalIngresos',
    header: "Ingresos",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-success">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'totalEgresos',
    header: "Egresos",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-danger">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'balance',
    header: "Balance Neto",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className={`color-${value >= 0 ? 'success' : 'danger'}`}>
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'historialBalance',
    header: "Balance Final",
    size: 130,
    cell: (props) => {
      const value = props.getValue();
      if (value === null || value === undefined || value === 0) {
        return <p>N/A</p>;
      }
      return (
        <span>
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  }
];

// Month view columns (same structure as week)
export const monthStatsColumns = [
  {
    accessorKey: 'dayNumber',
    header: "Día",
    size: 80,
    cell: (props) => {
      const row = props.row.original;
      return <p>{row.dayNumber || formatDate(row.date, 'month')}</p>;
    }
  },
  {
    accessorKey: 'date',
    header: "Fecha",
    size: 110,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p>N/A</p>;
      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'totalIngresosCapitales',
    header: "Ingresos Capitales",
    size: 150,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-success">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'totalIngresos',
    header: "Ingresos",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-success">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'totalEgresos',
    header: "Egresos",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-danger">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'balance',
    header: "Balance Neto",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className={`color-${value >= 0 ? 'success' : 'danger'}`}>
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'historialBalance',
    header: "Balance Final",
    size: 130,
    cell: (props) => {
      const value = props.getValue();
      if (value === null || value === undefined || value === 0) {
        return <p>N/A</p>;
      }
      return (
        <span>
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  }
];

// Multi-month view columns
export const multiMonthStatsColumns = [
  {
    accessorKey: 'monthName',
    header: "Período",
    size: 200,
    cell: (props) => {
      const row = props.row.original;
      if (row.monthName) {
        return <p>{row.monthName.charAt(0).toUpperCase() + row.monthName.slice(1)}</p>;
      }
      return <p>{`${row.monthNumber || ''}/${row.year || ''}`}</p>;
    }
  },
  {
    accessorKey: 'date',
    header: "Fecha Final",
    size: 110,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p>N/A</p>;
      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'totalIngresosCapitales',
    header: "Ingresos Capitales",
    size: 150,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-success">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'totalIngresos',
    header: "Ingresos",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-success">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'totalEgresos',
    header: "Egresos",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className="color-danger">
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'balance',
    header: "Balance Neto",
    size: 130,
    cell: (props) => {
      const value = props.getValue() || 0;
      return (
        <span className={`color-${value >= 0 ? 'success' : 'danger'}`}>
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  },
  {
    accessorKey: 'historialBalance',
    header: "Balance Final",
    size: 130,
    cell: (props) => {
      const value = props.getValue();
      if (value === null || value === undefined || value === 0) {
        return <p>N/A</p>;
      }
      return (
        <span>
          <small>$</small> {formatCurrencySV(value)}
        </span>
      );
    }
  }
];

// Helper function to get columns based on view type
export const getStatsColumns = (viewType) => {
  if (viewType === 'week') {
    return weekStatsColumns;
  } else if (viewType === 'month') {
    return monthStatsColumns;
  } else {
    return multiMonthStatsColumns;
  }
};

