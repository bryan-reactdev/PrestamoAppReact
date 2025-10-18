import { useCuotaModalStore } from "../../../stores/Modal/useCuotaModalStore";

export const ButtonMarcarPagadoCuota = ({row}) => {
  const { openMarcarPagadoModal } = useCuotaModalStore();

  return (
    <button onClick={() => openMarcarPagadoModal(row)}>Marcar como Pagado</button>
  )
}

export const ButtonNotasCuota = (row) => {
  return (
    <button onClick={() => console.log(`Notas: ${row.id} `)}>Notas</button>
  )
}

export const ButtonEditarCuota = (row) => {
  return (
    <button onClick={() => console.log(`Editado: ${row.id} `)}>Editar Cuota</button>
  )
}