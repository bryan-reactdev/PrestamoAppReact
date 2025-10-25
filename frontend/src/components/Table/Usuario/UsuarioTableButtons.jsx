import { Link } from "react-router-dom"
import { useUsuarioStore } from "../../../stores/useUsuarioStore"
import { useUsuarioModalStore } from "../../../stores/Modal/useUsuarioModalStore";

export const ButtonDescargarPDFInforme = ({row}) => {
  const { descargarPDFInforme} = useUsuarioStore();

  return (
    <button 
      className="btn-accion"
      onClick={() => descargarPDFInforme(row.id)}
    >
      <i className="fas fa-print"/>
      Descargar PDF de Informe
    </button>
  )
}

export const ButtonVerDetallesUsuario = ({row}) => {
  const { openModal } = useUsuarioModalStore();

  return (
    <button 
      className="btn-accion"
      onClick={() => openModal('verDetalles', row)}
    >
      <i className="fas fa-eye"/>
      Ver Detalles
    </button>
  )
}

export const ButtonCrearCreditoUsuario = ({row}) => {
  return (
    <Link className="a-accion" to={`/admin/usuarios/${row.id}/crear`}>
      <button className="btn-accion">
        <i className="fas fa-hand-holding"/>
        Crear Crédito
      </button>
    </Link>
  )
}

export const ButtonVerCreditosUsuario = ({row}) => {
  return (
    <Link className="a-accion" to={`/admin/usuarios/${row.id}/creditos`}>
      <button className="btn-accion">
        <i className="fas fa-credit-card"/>
        Ver Créditos
      </button>
    </Link>
  )
}

export const ButtonVerCuotasUsuario = ({row}) => {
  return (
    <Link className="a-accion" to={`/admin/usuarios/${row.id}/cuotas`}>
      <button className="btn-accion">
        <i className="fas fa-money-bill"/>
        Ver Cuotas
      </button>
    </Link>
  )
}

export const ButtonBloquearUsuario = ({row}) => {
  const {bloquearUsuario} = useUsuarioStore();

  return (
    <button 
      className="btn-accion color-danger"
      onClick={() => bloquearUsuario(row.id)}
    >
      <i className="fas fa-lock"/>
      Bloquear
    </button>
  )
}
ButtonBloquearUsuario.visibleIf = (row, role) => {
  return role.includes("ADMIN") && row.original.enabled
}

export const ButtonDesbloquearUsuario = ({row}) => {
  const {desbloquearUsuario} = useUsuarioStore();
  
  return (
    <button 
      className="btn-accion color-warning"
      onClick={() => desbloquearUsuario(row.id)}
    >
      <i className="fas fa-unlock"/>
      Desbloquear
    </button>
  )
}
ButtonDesbloquearUsuario.visibleIf = (row, role) => {
  return role.includes("ADMIN") && !row.original.enabled
}