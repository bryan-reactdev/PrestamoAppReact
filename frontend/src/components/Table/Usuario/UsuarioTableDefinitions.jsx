import ButtonAcciones from "../ButtonAcciones";
import UsuarioTableAccionTipos from './UsuarioTableAccionTipos';
import WhatsAppIcon from '../../Elements/WhatsAppIcon';

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
    size:150,
    cell: ({getValue}) => {
      const value = getValue();
      if (!value) return <p className="empty">N/A</p>

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p style={{ margin: 0 }}>{value}</p>
          <WhatsAppIcon phoneNumber={value} size={24} />
        </div>
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

export const usuarioAcciones = [
  UsuarioTableAccionTipos.VER_DETALLES,
  UsuarioTableAccionTipos.VER_CREDITOS,
  UsuarioTableAccionTipos.CREAR_CREDITO,
  UsuarioTableAccionTipos.DESCARGAR_PDF_INFORME,
  UsuarioTableAccionTipos.BLOQUEAR,
  UsuarioTableAccionTipos.DESBLOQUEAR,
]

export const usuarioConVencidasAcciones = [
  UsuarioTableAccionTipos.VER_DETALLES_COBRO,
  ...usuarioAcciones,
]
// --- Usuarios Todos ---
export const usuariosConVencidasColumns = [
  {
    accessorKey: 'usuario',
    header: "Usuario",
    size: 400,
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'celular',
    header: "Celular",
    size:150,
    cell: ({getValue}) => {
      const value = getValue();
      if (!value) return <p className="empty">N/A</p>

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p style={{ margin: 0 }}>{value}</p>
          <WhatsAppIcon phoneNumber={value} size={24} />
        </div>
      );
    }
  },
  {
    accessorKey: 'cuotaVencimiento',
    header: "Vencimiento de la Cuota",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p className="empty">N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'cuotaTotal',
    header: "Total de la Cuota",
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
    accessorKey: 'direccion',
    header: "Dirección",
    size: 350,
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'creditoMonto',
    header: "Crédito Monto",
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
    accessorKey: 'cuotasPendientes',
    size: 115,
    header: "Cuotas Pendientes",
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'totalPagar',
    header: "Total Pagar",
    size: 105,
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
    accessorKey: 'referencias',
    header: "Referencias",
    size: 300,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p className="empty">N/A</p>;
      return (
        <div>
          {value.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: 'referenciasCelular',
    header: "Referencias Celular",
    size: 200,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p className="empty">N/A</p>;
      return (
        <div>
          {value.split(';\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: 'parentesco',
    header: "Parentesco",
    size: 125,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p className="empty">N/A</p>;
      return (
        <div>
          {value.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: 'codeudorNombre',
    header: "Codeudor Nombre",
    size: 300,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p className="empty">N/A</p>;
      return <p>{value}</p>;
    }
  },
  {
    accessorKey: 'codeudorDui',
    header: "Codeudor DUI",
    size: 150,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p className="empty">N/A</p>;
      return <p>{value}</p>;
    }
  },
  {
    accessorKey: 'codeudorDireccion',
    header: "Codeudor Dirección",
    size: 350,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p className="empty">N/A</p>;
      return <p>{value}</p>;
    }
  },
  {
    accessorKey: 'notas',
    header: "Notas",
    size: 300,
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={usuarioConVencidasAcciones} />,
  },
]