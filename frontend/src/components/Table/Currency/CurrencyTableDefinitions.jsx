// --- Todos los Créditos ---
export const ingresoEgresoColumns = [
  {
    accessorKey: 'motivo',
    header: "Motivo",
    enableSorting: false,
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fecha',
    header: "Fecha",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'monto',
    header: "Monto",
    size: 125,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
]

// --- Cuotas ---
export const cuotasPagadasIngresoColumns = [
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => {
      console.log(props.row.original)

      return <p>{props.getValue()}</p>;
    }
  },
  {
    accessorKey: 'fechaVencimiento',
    header: "Fecha Vencimiento",
    size: 110,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p className="empty">N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'fechaPagado',
    header: "Fecha Pagado",
    size: 110,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p className="empty">N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'monto',
    header: "Monto",
    size: 90,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
  {
    accessorKey: 'mora',
    header: "Mora",
    size: 90,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
  {
    accessorKey: 'abono',
    header: "Abono",
    size: 90,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
  {
    accessorKey: 'total',
    header: "Total",
    size: 90,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
]

// --- Abonos ---
export const abonosColumns = [
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'credito',
    header: "Crédito",
    size: 115,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
  {
    accessorKey: 'fechaCuota',
    header: "Fecha de Cuota",
    size: 110,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p className="empty">N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'fecha',
    header: "Fecha Abono",
    size: 110,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p className="empty">N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'monto',
    header: "Monto",
    size: 90,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
]

// --- Creditos ---
export const creditosDesembolsadosColumns = [
  {
    accessorKey: 'calificacion',
    header: "Calificación",
    size: 115,
    enableSorting: false,
    cell: (props) => {
      const value = props.getValue();
      let displayValue = value;
      if (value === 'A_PLUS') displayValue = 'A+';
      else if (value === 'D') displayValue = 'Indeseable';
      return <p className={value}>{displayValue}</p>;
    }
  },
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'monto',
    header: "Monto",
    size: 115,
    cell: (props) => {
      const value = props.getValue();
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
  {
    accessorKey: 'montoDesembolsar',
    header: "Monto a Dar",
    size: 115,
    enableSorting: false,
    cell: (props) => {
      const value = (props.getValue() === 0 || props.getValue() === null)  ? props.row.original.monto : props.getValue();
      
      return (
        <span>
          <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
  },
  {
    accessorKey: 'frecuencia',
    header: "Frecuencia",
    size: 115,
    enableSorting: false,
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fechaAceptado',
    header: "Fecha Aceptado",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'desembolsado',
    header: "Desembolso",
    size: 115,
    enableSorting: false,
    cell: (props) => {
      const value = props.getValue();

      if (value === null) return <p>???</p>;

      if (value === true){
        const [y, m, d] = props?.row?.original?.fechaDesembolsado?.split('T')[0].split('-');
        return <p className="badge Realizado">{`${d}/${m}/${y.slice(-2)}`}</p>;
      }

      return <p className={`badge Pendiente`}>Pendiente</p>
    }  
  },
  // {
  //   accessorKey: 'accion',
  //   header: "Acción",
  //   size: 125,
  //   enableSorting: false,
  //   enableGlobalFilter: false,
  //   cell: ({ row }) => <ButtonAcciones row={row} acciones={creditosAceptadosAcciones} />,
  // },
]
