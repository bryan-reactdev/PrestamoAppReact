import { Link } from "react-router-dom";
import { useCreditoModalStore } from "../../../stores/Modal/useCreditoModalStore";
import { useCreditoStore } from "../../../stores/useCreditoStore";
import { Switch } from "../../ui/switch";

export const ButtonDesembolsarCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button className="btn-accion" onClick={() => openModal('desembolsar', row)}>
      <i className="fas fa-money-bill"/>
      {!row.original.desembolsado ? 'Desembolsar' : 'Revertir Desembolso'}
    </button>
  )
}
ButtonDesembolsarCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN') || row.original.desembolsable; 
};

export const ButtonVerCuotasCredito = ({row}) => {
  return (
    <Link className={`a-accion ${!row.original.desembolsado ? 'disabled' : ''}`} to={`./${row.id}/cuotas`}>
      <button className="btn-accion">
        <i className="fas fa-calendar"/>
        Ver Cuotas
      </button>
    </Link>
  )
}


export const ButtonAceptarCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button className="btn-accion" onClick={() => openModal('aceptar', row)}>
      <i className="fas fa-check"/>
      Aceptar
    </button>
  )
}
ButtonAceptarCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN'); 
};


export const ButtonRechazarCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button className="btn-accion" onClick={() => openModal('rechazar', row)}>
      <i className="fas fa-times"/>
      Rechazar
    </button>
  )
}
ButtonRechazarCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN'); 
};

export const ButtonGenerarDocumentosCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button className="btn-accion" onClick={() => openModal('generarDocumentos', row)}>
      <i className="fas fa-print"/>
      Generar Documentos
    </button>
  )
}
ButtonGenerarDocumentosCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN') || row.original.descargable; 
};

export const ButtonEditarCredito = ({row}) => {
  return (
    <Link className={`a-accion`} to={`./${row.id}/editar`}>
      <button className="btn-accion">
        <i className="fas fa-edit"/>
        Editar
      </button>
    </Link>
  )
}
ButtonEditarCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN') || row.original.editable; 
};