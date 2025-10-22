import { Link } from "react-router-dom";
import { useCreditoModalStore } from "../../../stores/Modal/useCreditoModalStore";
import { useCreditoStore } from "../../../stores/useCreditoStore";
import Switch from "../../Elements/Switch";

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
    <Link className="a-accion" to={`/admin/creditos/${row.id}/cuotas`}>
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

export const ButtonRechazarCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button className="btn-accion" onClick={() => openModal('rechazar', row)}>
      <i className="fas fa-times"/>
      Rechazar
    </button>
  )
}

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
    <button className="btn-accion" onClick={() => console.log(`Editado: ${row.id} `)}>
      <i className="fas fa-edit"/>
      Editar
    </button>
  )
}
ButtonEditarCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN') || row.original.editable; 
};

export const ButtonEditableCredito = ({row}) => {
  const { toggleCreditoEditable } = useCreditoStore();

  return (
    <Switch 
      title={'Editable'}  
      checked={row.original.editable}  
      onClick={() => toggleCreditoEditable(row.original.id, row.original.editable)}
    />
  )
}
ButtonEditableCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN'); 
};

export const ButtonDescargableCredito = ({row}) => {
  const { toggleCreditoDescargable } = useCreditoStore();

  return (
    <Switch 
      title={'Descargable'} 
      checked={row.original.descargable} 
      onClick={() => toggleCreditoDescargable(row.original.id, row.original.descargable)}/>
  )
}
ButtonDescargableCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN'); 
};

export const ButtonDesembolsableCredito = ({row}) => {
  const { toggleCreditoDesembolsable } = useCreditoStore();

  return (
    <Switch 
      title={'Desembolsable'} 
      checked={row.original.desembolsable} 
      onClick={() => toggleCreditoDesembolsable(row.original.id, row.original.desembolsable)}/>
  )
}
ButtonDesembolsableCredito.visibleIf = (row, role) => { 
  return role.includes('ADMIN');
};