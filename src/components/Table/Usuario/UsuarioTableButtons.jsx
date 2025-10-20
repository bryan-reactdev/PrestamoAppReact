import { Link } from "react-router-dom"
import { useUsuarioStore } from "../../../stores/useUsuarioStore"

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
  return (
    <button 
      className="btn-accion"
      onClick={() => console.log(`Notas: ${row.id} `)}
    >
      <i className="fas fa-eye"/>
      Ver Detalles
    </button>
  )
}

export const ButtonCrearCreditoUsuario = ({row}) => {
  return (
    <Link className="a-accion" to={`./${row.id}/crear`}>
      <button className="btn-accion">
        <i className="fas fa-hand-holding"/>
        Crear Crédito
      </button>
    </Link>
  )
}

export const ButtonVerCreditosUsuario = ({row}) => {
  return (
    <Link className="a-accion" to={`./${row.id}/creditos`}>
      <button className="btn-accion">
        <i className="fas fa-credit-card"/>
        Ver Créditos
      </button>
    </Link>
  )
}

export const ButtonBloquearUsuario = ({row}) => {
  return (
    <button 
      className="btn-accion color-danger"
      onClick={() => console.log(`Editado: ${row.id} `)}
    >
      <i className="fas fa-lock"/>
      Bloquear
    </button>
  )
}

export const ButtonDesbloquearUsuario = ({row}) => {
  return (
    <button 
      className="btn-accion color-warning"
      onClick={() => console.log(`Editado: ${row.id} `)}
    >
      <i className="fas fa-unlock"/>
      Desbloquear
    </button>
  )
}