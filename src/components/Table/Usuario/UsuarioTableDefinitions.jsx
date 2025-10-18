import ButtonAcciones from "../ButtonAcciones";
import UsuarioTableAccionTipos from './UsuarioTableAccionTipos';

// --- Creditos Activos ---
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
  UsuarioTableAccionTipos.DESCARGAR_PDF_INFORME,
  UsuarioTableAccionTipos.VER_DETALLES,
  UsuarioTableAccionTipos.CREAR_CREDITO,
  UsuarioTableAccionTipos.VER_CREDITOS,
  UsuarioTableAccionTipos.BLOQUEAR,
  UsuarioTableAccionTipos.DESBLOQUEAR,
]