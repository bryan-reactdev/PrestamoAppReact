import { useCurrencyModalStore } from "../../../stores/Modal/useCurrencyModalStore";

export const ButtonVerImagenes = ({row}) => {
  const { openModal } = useCurrencyModalStore();

  return (
    <button className='btn-accion' onClick={() => openModal('verImagenes', row)}>
      <i className="fas fa-images"/>
      Ver Imágenes
    </button>
  )
}
ButtonVerImagenes.visibleIf = (row, role) => { 
  return !role.includes('USER'); 
};

export const ButtonEditarHistorial = ({row}) => {
  const {openModal} = useCurrencyModalStore();

  return (
    <button className='btn-accion' onClick={() => openModal('editar', row)}>
      <i className="fas fa-edit"/>
      Editar
    </button>
  )
}
ButtonEditarHistorial.visibleIf = (row, role) => { 
  return !role.includes('USER'); 
};

