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
    cell: (props) => <p>{props.getValue()}</p>
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
    header: "Credito",
    cell: (props) => <p>{props.getValue()}</p>
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