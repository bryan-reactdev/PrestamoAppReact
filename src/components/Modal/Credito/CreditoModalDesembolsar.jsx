import React, { useEffect, useState } from 'react'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'

export default function CreditoModalDesembolsar() {
  const { desembolsar, row, closeModal } = useCreditoModalStore()
  const { setCreditoDesembolsado } = useCreditoStore()

  if (row === null || row.original === null) return;

  const handleDesembolsar = () => {
    setCreditoDesembolsado(row.id, row.original.desembolsado)
    closeModal('desembolsar')
  }

  return (
    <BaseModal
      isOpen={desembolsar}
      onConfirm={handleDesembolsar}
      onClose={() => closeModal('desembolsar')}
      customWidth={500}
      title={!row.original.desembolsado ? '¿Desembolsar?' : '¿Revertir desembolso?'}
      confirmText={`Si, ${!row.original.desembolsado ? 'desembolsar' : 'revertir desembolso'}`}
      icon={'fas fa-warning'}
    >
      <div className="modal-content">
        <span>
          ¿Estás seguro de que deseas {!row.original.desembolsado ? 'desembolsar' : 'revertir el desembolso de'} este crédito de <strong>{row.original.usuario}</strong>?
        </span>
      </div>
    </BaseModal>
  )
}