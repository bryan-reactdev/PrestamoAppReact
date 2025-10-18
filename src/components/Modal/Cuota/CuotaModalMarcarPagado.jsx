import React from 'react'
import { BaseModal } from '../ModalUtils'
import { useCuotaStore } from '../../../stores/useCuotaStore'
import { useCuotaModalStore } from '../../../stores/Modal/useCuotaModalStore'

export default function CuotaModalMarcarPagado() {
  const { openMarcarPagado, row, closeMarcarPagadoModal } = useCuotaModalStore()
  const { pagarCuota } = useCuotaStore()

  const id = row?.id
  const currentEstado = row?.estado
  const usuario = row?.original?.usuario

  const handlePagar = () => {
    pagarCuota(id, currentEstado);
    closeMarcarPagadoModal();
  }

  return (
    <BaseModal
      isOpen={openMarcarPagado}
      onConfirm={handlePagar}
      onClose={closeMarcarPagadoModal}
      customWidth={500}
      title='Confirmar Pago'
      confirmText='Si, pagar'
      icon={'fas fa-question'}
    >
      <div className="modal-content">
        <span>
          ¿Estás seguro de que deseas marcar como pagada esta cuota de <strong>{usuario}</strong>?
        </span>
      </div>
    </BaseModal>
  )
}