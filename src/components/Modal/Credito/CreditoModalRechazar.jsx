import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'

export default function CreditoModalRechazar() {
  const { rechazar, row, closeModal } = useCreditoModalStore()
  const { rechazarCredito } = useCreditoStore()

  const handleRechazar = () => {
    rechazarCredito(row?.original?.id, row.original.estado)
    closeModal('rechazar')
  }

  return (
    <BaseModal
      isOpen={rechazar}
      onConfirm={handleRechazar}
      onClose={() => closeModal('rechazar')}
      title={'¿Rechazar Crédito?'}
      customWidth={500}
      confirmText={`RECHAZAR`}
      confirmColor='danger'
      cancelColor='secondary'
      icon={'fas fa-warning color-danger'}
    >
      <div className="modal-content">
        <span>
          Estás seguro que quieres rechazar este crédito de <strong>{row?.original.usuario}</strong>?
        </span>
      </div>
    </BaseModal>
  )
}