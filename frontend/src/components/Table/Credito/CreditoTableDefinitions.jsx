import { DateTimeToDate } from "../../../utils/dateUtils";
import ButtonAcciones from "../ButtonAcciones";
import CreditoTableAccionTipos from "./CreditoTableAccionTipos";

// --- Todos los Créditos ---
export const creditosTodosColumns = [
  {
    accessorKey: 'estado',
    header: "Estado",
    size: 125,
    enableSorting: false,
    cell: (props) => <p className={'badge ' + props.getValue()}>{props.getValue()}</p>
  },
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
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
  {
    accessorKey: 'frecuencia',
    header: "Frecuencia",
    size: 125,
    enableSorting: false,
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fechaSolicitud',
    header: "Fecha Solicitud",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  }
]

// --- Créditos Aceptados ---
export const creditosAceptadosColumns = [
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
        return <p className="badge Realizado">{DateTimeToDate(props.row.original.fechaDesembolsado)}</p>;
      }

      return <p className={`badge Pendiente`}>Pendiente</p>
    }  
  },
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={creditosAceptadosAcciones} />,
  },
]

export const creditosRefinanciarColumns = [
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
        return <p className="badge Realizado">{DateTimeToDate(props.row.original.fechaDesembolsado)}</p>;
      }

      return <p className={`badge Pendiente`}>Pendiente</p>
    }  
  },
]

export const creditosAceptadosAcciones = [
  CreditoTableAccionTipos.DESEMBOLSAR,
  CreditoTableAccionTipos.VER_CUOTAS,
  CreditoTableAccionTipos.GENERAR_DOCUMENTOS, 
  CreditoTableAccionTipos.EDITAR,
  CreditoTableAccionTipos.EDITABLE,
  CreditoTableAccionTipos.DESCARGABLE,
  CreditoTableAccionTipos.DESEMBOLSABLE,
]

// --- Créditos Pendientes ---
export const creditosPendientesColumns = [
  {
    accessorKey: 'estado',
    header: "Estado",
    size: 125,
    enableSorting: false,
    cell: (props) => <p className={'badge ' + props.getValue()}>{props.getValue()}</p>
  },
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
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
  {
    accessorKey: 'frecuencia',
    header: "Frecuencia",
    size: 125,
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fechaSolicitud',
    header: "Fecha Solicitud",
    size: 125,
    sortDescFirst: true,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={creditosPendientesAcciones} />,
  },
]

export const creditosPendientesAcciones = [
  CreditoTableAccionTipos.ACEPTAR,
  CreditoTableAccionTipos.RECHAZAR, 
  CreditoTableAccionTipos.GENERAR_DOCUMENTOS, 
  CreditoTableAccionTipos.EDITAR,
  CreditoTableAccionTipos.DESCARGABLE,
  CreditoTableAccionTipos.EDITABLE
]

// --- Créditos Rechazados ---
export const creditosRechazadosColumns = [
  {
    accessorKey: 'estado',
    header: "Estado",
    size: 125,
    enableSorting: false,
    cell: (props) => <p className={'badge ' + props.getValue()}>{props.getValue()}</p>
  },
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
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
  {
    accessorKey: 'frecuencia',
    header: "Frecuencia",
    size: 125,
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fechaSolicitud',
    header: "Fecha Solicitud",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'fechaRechazado',
    header: "Fecha Rechazado",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
  },
  {
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={creditosDefaultAcciones} />,
  },
]

// --- Créditos Finalizados ---
export const creditosFinalizadosColumns = [
  {
    accessorKey: 'estado',
    header: "Estado",
    size: 125,
    enableSorting: false,
    cell: (props) => <p className={'badge ' + props.getValue()}>{props.getValue()}</p>
  },
  {
    accessorKey: 'usuario',
    header: "Usuario",
    cell: (props) => <p>{props.getValue()}</p>
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
  {
    accessorKey: 'frecuencia',
    header: "Frecuencia",
    size: 125,
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fechaSolicitud',
    header: "Fecha Solicitud",
    size: 125,
    cell: (props) => {
      const value = props.getValue();

      if (!value) return <p>N/A</p>;

      const [y, m, d] = value.split('T')[0].split('-');
      return <p>{`${d}/${m}/${y.slice(-2)}`}</p>;
    }
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
    accessorKey: 'accion',
    header: "Acción",
    size: 125,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <ButtonAcciones row={row} acciones={creditosDefaultAcciones} />,
  },
]

export const creditosDefaultAcciones = [
  CreditoTableAccionTipos.GENERAR_DOCUMENTOS, 
  CreditoTableAccionTipos.EDITAR,
  CreditoTableAccionTipos.EDITABLE,
  CreditoTableAccionTipos.DESCARGABLE,
]