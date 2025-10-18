import { Link } from "react-router-dom"
import { useUsuarioStore } from "../../../stores/useUsuarioStore"

export const ButtonDescargarPDFInforme = ({row}) => {
  const { descargarPDFInforme} = useUsuarioStore();

  return (
    <button onClick={() => descargarPDFInforme(row.id)}>Descargar PDF de Informe</button>
  )
}

export const ButtonVerDetallesUsuario = ({row}) => {
  return (
    <button onClick={() => console.log(`Notas: ${row.id} `)}>Ver Detalles</button>
  )
}

export const ButtonCrearCreditoUsuario = ({row}) => {
  return (
    <Link to={`./${row.id}/crear`}>Crear Crédito</Link >
  )
}

export const ButtonVerCreditosUsuario = ({row}) => {
  return (
    <button onClick={() => console.log(`Editado: ${row.id} `)}>Ver Créditos</button>
  )
}

export const ButtonBloquearUsuario = ({row}) => {
  return (
    <button onClick={() => console.log(`Editado: ${row.id} `)}>Bloquear</button>
  )
}

export const ButtonDesbloquearUsuario = ({row}) => {
  return (
    <button onClick={() => console.log(`Editado: ${row.id} `)}>Desbloquear</button>
  )
}