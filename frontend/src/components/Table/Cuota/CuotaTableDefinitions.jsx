import FormField from "../../Form/FormField";
import ButtonAcciones from "../ButtonAcciones";
import CuotaTableAccionTipos from "./CuotaTableAccionTipos";
import WhatsAppIcon from '../../Elements/WhatsAppIcon';
import UsuarioTableAccionTipos from "../Usuario/UsuarioTableAccionTipos";
import { DateTimeToDate } from "../../../utils/dateUtils";

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
    accessorKey: 'celular',
    header: "Celular",
    size: 150,
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
      return <p>{DateTimeToDate(value)}</p>;
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
    cell: ({ row }) => <ButtonAcciones row={row} acciones={getAccionesByEstado(row.original.estado)} />,
  },
]
// --- Todas las Cuotas Minimal ---
export const cuotasTodosMinimalColumns = [
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
    size: 150,
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
    accessorKey: 'celular',
    header: "Celular",
    size: 150,
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
    accessorKey: 'celular',
    header: "Celular",
    size: 150,
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
    size: 90,
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

// Function to get the correct acciones based on cuota estado
export const getAccionesByEstado = (estado) => {
  switch (estado) {
    case 'Pagado':
      return cuotasPagadasAcciones;
    case 'Pendiente':
    case 'Vencida':
    case 'EnRevision':
    default:
      return cuotasPendientesAcciones;
  }
}

// --- Cuotas Cobros ---
export const cuotasCobrosColumns = [
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={cuotasCobrosAcciones} />,
  },
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
]

export const cuotasCobrosAcciones = [
  UsuarioTableAccionTipos.VER_DETALLES_COBRO,
  CuotaTableAccionTipos.MARCAR_PAGADO,
  CuotaTableAccionTipos.ABONAR,
  CuotaTableAccionTipos.NOTAS,
  CuotaTableAccionTipos.EDITAR
]