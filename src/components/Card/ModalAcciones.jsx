import { useModalStore } from '../../stores/Modal/useModalStore';
import { BaseModal } from '../Modal/ModalUtils';

export default function ModalAcciones() {
  const { acciones, accionesModal, row, closeModal } = useModalStore()

  if (row === null || row.original === null) return;

  return (
    <BaseModal
      isOpen={accionesModal}
      onClose={() => closeModal('accionesModal')}
      customWidth={300}
      title={`Crédito de: ${row.original.usuario}`}
    >
      <div className="modal-content">
        <span>
            {acciones.map((Btn, index) => (
            <Btn key={`${row.original?.id ?? index}-${Btn.name}`} row={row} />
            ))}
        </span>
      </div>
    </BaseModal>
  )
}