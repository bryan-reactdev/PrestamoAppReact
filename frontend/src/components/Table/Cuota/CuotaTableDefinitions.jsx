import FormField from "../../Form/FormField";
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
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={cuotasPendientesAcciones} />,
  },
]

export const cuotasRefinanciablesColumns = (selectedCuotas, handleCuotaChange) => [
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
    accessorKey: 'fechaVencimiento',
    header: "Fecha Vencimiento",
    size: 140,
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
    size: 140,
    cell: (props) => {
      const value = props.getValue();
      const rowIndex = props.row.index;
      const isPagado = props.row.original.estado === 'Pagado';

      return (
        !isPagado
          ?
            <FormField
              classNames={'simple one'}
              label={''}
              type="money"
              value={selectedCuotas?.find(c => c.id == props.row.id)?.monto}
              onChange={(e) => handleCuotaChange(rowIndex, 'monto', e.target.value)}
            />
          :
          <span>
            <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
      );
    }
  },
  {
    accessorKey: 'mora',
    header: "Mora",
    size: 140,
    cell: (props) => {
      const value = props.getValue();
      const rowIndex = props.row.index;
      const isPagado = props.row.original.estado === 'Pagado';

      return (
        !isPagado
          ?
            <FormField
              classNames={'simple one'}
              label={''}
              type="money"
              value={selectedCuotas?.find(c => c.id == props.row.id)?.mora}
              onChange={(e) => handleCuotaChange(rowIndex, 'mora', e.target.value)}
            />
          :
            <span>
              <small>$</small> {Number(value).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
      );
    }
  },
  {
    accessorKey: 'total',
    header: "Total",
    size: 140,
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
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={cuotasPendientesAcciones} />,
  },
]

export const cuotasPendientesAcciones = [
  CuotaTableAccionTipos.MARCAR_PAGADO,
  CuotaTableAccionTipos.ABONAR,
  CuotaTableAccionTipos.NOTAS,
  CuotaTableAccionTipos.EDITAR
]

// --- Cuotas Pagadas ---
export const cuotasPagadasColumns = [
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
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={cuotasPagadasAcciones} />,
  },
]

export const cuotasPagadasAcciones = [
  CuotaTableAccionTipos.NOTAS,
  CuotaTableAccionTipos.EDITAR
]
