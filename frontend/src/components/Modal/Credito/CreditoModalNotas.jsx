import React, { useEffect, useState, useRef } from 'react'
import { BaseModal } from '../ModalUtils'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'
import FormField from '../../Form/FormField'

export default function CreditoModalNotas() {
  const { notas, closeModal, row } = useCreditoModalStore()
  const { credito, getCredito, isFetchingCredito, guardarNota, isGuardandoNota } = useCreditoStore()
  
  const [creditoNota, setCreditoNota] = useState('')
  const formRef = useRef(null)

  const handleGuardar = async() => {
    const success = await guardarNota(row?.original?.id, creditoNota)
    if (success) closeModal('notas')
  }

  useEffect(() => {
    if (!notas) return // only run when modal is open
    const creditoId = row?.original?.id
    if (creditoId) {
      // Set initial value from row data if available
      setCreditoNota(row?.original?.nota || '')
      getCredito(creditoId)
    }
  }, [notas, row])

  useEffect(() => {
    // Update from fetched credito data
    if (credito?.nota !== undefined) {
      setCreditoNota(credito.nota || '')
    }
  }, [credito])

  // -- Handler for editing the nota --
  const handleChange = (e) => {
    const { value } = e.target
    setCreditoNota(value)
  }

  return (
    <BaseModal
      isOpen={notas}
      onConfirm={handleGuardar}
      onClose={() => closeModal('notas')}
      customWidth={500}
      title="Nota de Crédito"
      confirmText="GUARDAR"
      cancelText="CERRAR"
      formRef={formRef}
    >
      <div className="modal-content">
        <form ref={formRef} className="form-container">
          <div className="form-section">
            <div className="form-section-content">
              {isFetchingCredito &&
                <div className="spinner large"></div>
              }

              {!isFetchingCredito &&
                <FormField
                  type="textarea"
                  label="Nota"
                  name="nota"
                  value={creditoNota}
                  onChange={handleChange}
                  placeholder="Escribe una nota sobre el crédito..."
                  disabled={isGuardandoNota}
                  maxLength={500}
                  classNames="full"
                />
              }
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}

