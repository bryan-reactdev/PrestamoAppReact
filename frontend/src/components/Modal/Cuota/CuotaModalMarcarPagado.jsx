import React from 'react'
import { BaseModal } from '../ModalUtils'
import { useCuotaStore } from '../../../stores/useCuotaStore'
import { useCuotaModalStore } from '../../../stores/Modal/useCuotaModalStore'

export default function CuotaModalMarcarPagado() {
  const { marcarPagado, closeModal, row } = useCuotaModalStore()
  const { pagarCuota } = useCuotaStore()

  const handlePagar = () => {
    pagarCuota(row.id, row);
    closeModal('marcarPagado')
  }

  return (
    <BaseModal
      isOpen={marcarPagado}
      onConfirm={handlePagar}
      onClose={() => closeModal('marcarPagado')}
      customWidth={500}
      title='Confirmar Pago'
      confirmText='SÍ, PAGAR'
      icon={'fas fa-question'}
    >
      <div className="modal-content">
        <span>
          ¿Estás seguro de que deseas marcar como pagada esta cuota de <strong>{row?.original?.usuario}</strong>?
        </span>
      </div>
    </BaseModal>
  )
}