import { useCurrencyModalStore } from "../../../../stores/Modal/useCurrencyModalStore";

export const ButtonPDF = () => {
  return (
    <button className="btn-danger" onClick={(e) => {e.stopPropagation();}}>
        <i className="fas fa-print"/>
        PDF
    </button>
  )
}

export const ButtonIngreso = () => {
  const { openModal } = useCurrencyModalStore()

  const handleOpenModal = (e) => {
    e.stopPropagation();
    openModal('ingreso');
  }

  return (
    <button className="btn-success" onClick={handleOpenModal}>
        <i className="fas fa-plus"/>
        Ingreso
    </button>
  )
}

export const ButtonEgreso = () => {
  const { openModal } = useCurrencyModalStore()

  const handleOpenModal = (e) => {
    e.stopPropagation();
    openModal('egreso');
  }

  return (
    <button className="btn-warning" onClick={handleOpenModal}>
        <i className="fas fa-minus"/>
        Egreso
    </button>
  )
}