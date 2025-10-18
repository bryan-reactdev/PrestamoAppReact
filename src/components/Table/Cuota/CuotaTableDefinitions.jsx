import ButtonAcciones from "../ButtonAcciones";
import CuotaTableAccionTipos from "./CuotaTableAccionTipos";

// --- Todas las Cuotas ---
export const cuotasTodosColumns = [
  {
    accessorKey: 'estado',
    header: "Estado",
    size: 125,
    cell: ({ getValue }) => {
      const value = getValue();
      const displayText = value === 'EnRevision' ? 'En Revisión' : value;
    
      return <p className={`badge ${value}`}>{displayText}</p>;
    }
  },
  {
    accessorKey: 'codigo',
    header: "Código",
    size: 135,
    cell: (props) => <p className={props.getValue()}>{props.getValue()}</p>
  },
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
    accessorKey: 'fechaPago',
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
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={cuotasPendientesAcciones} />,
  },
]

// --- Cuotas Pendientes ---
export const cuotasPendientesColumns = [
  {
    accessorKey: 'estado',
    header: "Estado",
    size: 125,
    cell: ({ getValue }) => {
      const value = getValue();
      const displayText = value === 'EnRevision' ? 'En Revisión' : value;
    
      return <p className={`badge ${value}`}>{displayText}</p>;
    }
  },
  {
    accessorKey: 'codigo',
    header: "Código",
    size: 135,
    cell: (props) => <p className={props.getValue()}>{props.getValue()}</p>
  },
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
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={cuotasPendientesAcciones} />,
  },
]

export const cuotasPendientesAcciones = [
  CuotaTableAccionTipos.MARCAR_PAGADO,
  CuotaTableAccionTipos.NOTAS,
  CuotaTableAccionTipos.EDITAR
]