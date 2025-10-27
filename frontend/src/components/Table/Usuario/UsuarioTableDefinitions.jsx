import ButtonAcciones from "../ButtonAcciones";
import UsuarioTableAccionTipos from './UsuarioTableAccionTipos';

// --- Usuarios Todos ---
export const usuariosTodosColumns = [
  {
    accessorKey: 'calificacion',
    header: "Calificación",
    size: 125,
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
    header: "Nombre y Apellido",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'email',
    header: "Email",
    size: 360,
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'dui',
    header: "DUI",
    size: 105,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value || value.includes('@')) return <p className="empty">N/A</p>

      return <p>{value}</p>
    }
  },
  {
    accessorKey: 'celular',
    header: "Celular",
    size:125,
    cell: ({getValue}) => {
      const value = getValue();
      if (!value) return <p className="empty">N/A</p>

      return <p>{value}</p>
    }
  },
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={usuarioAcciones} />,
  },
]

export const usuarioAcciones = [
  UsuarioTableAccionTipos.VER_DETALLES,
  UsuarioTableAccionTipos.VER_CUOTAS,
  UsuarioTableAccionTipos.VER_CREDITOS,
  UsuarioTableAccionTipos.CREAR_CREDITO,
  UsuarioTableAccionTipos.DESCARGAR_PDF_INFORME,
  UsuarioTableAccionTipos.BLOQUEAR,
  UsuarioTableAccionTipos.DESBLOQUEAR,
]
// --- Usuarios Todos ---
export const usuariosConVencidasColumns = [
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'celular',
    header: "Celular",
    size:125,
    cell: ({getValue}) => {
      const value = getValue();
      if (!value) return <p className="empty">N/A</p>

      return <p>{value}</p>
    }
  },

  {
    accessorKey: 'cuotaVencimiento',
    header: "Cuota Vencimiento",
    size: 110,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p className="empty">N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'cuotaMonto',
    header: "Cuota Monto",
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
    accessorKey: 'cuotaMora',
    header: "Cuota Mora",
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
    accessorKey: 'cuotaAbono',
    header: "Cuota Abono",
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
    accessorKey: 'cuotaTotal',
    header: "Cuota Total",
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
    cell: ({ row }) => <ButtonAcciones row={row} acciones={usuarioAcciones} />,
  },
]