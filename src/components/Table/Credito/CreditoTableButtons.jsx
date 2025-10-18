import { Link } from "react-router-dom";
import { useCreditoModalStore } from "../../../stores/Modal/useCreditoModalStore";
import { useCreditoStore } from "../../../stores/useCreditoStore";

export const ButtonDesembolsarCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button onClick={() => openModal('desembolsar', row)}>
      {!row.original.desembolsado ? 'Desembolsar' : 'Revertir Desembolso'}
    </button>
  )
}

export const ButtonVerCuotasCredito = ({row}) => {
  return (
    <Link to={`./${row.id}/cuotas`}>
      Ver Cuotas
    </Link>
  )
}

export const ButtonAceptarCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button onClick={() => openModal('aceptar', row)}>
      Aceptar
    </button>
  )
}

export const ButtonRechazarCredito = ({row}) => {
  return (
    <button onClick={() => console.log(`Rechazado: ${row.id} `)}>Rechazar</button>
  )
}

export const ButtonGenerarDocumentosCredito = ({row}) => {
  const { openModal } = useCreditoModalStore();

  return (
    <button onClick={() => openModal('generarDocumentos', row)}>
      Generar Documentos
    </button>
  )
}

export const ButtonEditarCredito = ({row}) => {
  return (
    <button onClick={() => console.log(`Editado: ${row.id} `)}>Editar</button>
  )
}

export const ButtonEditableCredito = ({row}) => {
  const { toggleCreditoEditable } = useCreditoStore();

  return (
  <button
    className={`btn-switch ${row.original.editable && 'active'}`}
    onClick={() => toggleCreditoEditable(row.original.id, row.original.editable)}
  >
    Editable
    <span className="btn-switch-bubble"/>
  </button>
  )
}


export const ButtonDescargableCredito = ({row}) => {
  const { toggleCreditoDescargable } = useCreditoStore();

  return (
  <button
    className={`btn-switch ${row.original.descargable && 'active'}`}
    onClick={() => toggleCreditoDescargable(row.original.id, row.original.descargable)}
  >
    Descargable
    <span className="btn-switch-bubble"/>
  </button>
  )
}