import { useModalStore } from '../../stores/Modal/useModalStore';
import { BaseModal } from '../Modal/ModalUtils';

export default function AccionesModal() {
  const { acciones, accionesModal, row, closeModal } = useModalStore()

  if (row === null || row.original === null) return;

  return (
    <BaseModal
      isOpen={accionesModal}
      onClose={() => closeModal('accionesModal')}
      customWidth={300}
      title={`Crédito de: ${row.original.usuario}`}
      style={{zIndex: 99}}
    >
      <div className="modal-content">
        <span>
            {acciones.map((Btn, index) => (
              <Btn key={index} row={row} />
            ))}
        </span>
      </div>
    </BaseModal>
  )
}