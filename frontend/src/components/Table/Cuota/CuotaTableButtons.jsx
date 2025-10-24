import { useCuotaModalStore } from "../../../stores/Modal/useCuotaModalStore";

export const ButtonMarcarPagadoCuota = ({row}) => {
  const { openModal } = useCuotaModalStore();

  return (
    <button className='btn-accion' onClick={() => openModal('marcarPagado', row)}>
      <i className="fas fa-credit-card"/>
      Marcar como Pagado
    </button>
  )
}
ButtonMarcarPagadoCuota.visibleIf = (row, role) => { 
  return !role.includes('USER'); 
};


export const ButtonAbonarCuota = ({row}) => {
  const { openModal } = useCuotaModalStore();

  return (
    <button className='btn-accion' onClick={() => openModal('abonar', row)}>
      <i className="fas fa-sack-dollar"/>
      Abonar Cuota
    </button>
  )
}
ButtonAbonarCuota.visibleIf = (row, role) => { 
  return !role.includes('USER'); 
};


export const ButtonNotasCuota = (row) => {
  return (
    <button className='btn-accion' onClick={() => console.log(`Notas: ${row.id} `)}>
      <i className="fas fa-note-sticky"/>
      Notas
    </button>
  )
}
ButtonNotasCuota.visibleIf = (row, role) => { 
  return !role.includes('USER'); 
};


export const ButtonEditarCuota = (row) => {
  return (
    <button className='btn-accion' onClick={() => console.log(`Editado: ${row.id} `)}>
      <i className="fas fa-edit"/>
      Editar Cuota
    </button>
  )
}
ButtonEditarCuota.visibleIf = (row, role) => { 
  return !role.includes('USER'); 
};
