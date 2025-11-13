import { useState, useEffect, useRef } from 'react'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'
import FormField from '../../Form/FormField'

export default function CreditoModalRechazar() {
  const { rechazar, row, closeModal } = useCreditoModalStore()
  const { rechazarCredito, isRechazandoCredito } = useCreditoStore()
  const [nota, setNota] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    if (!rechazar) return
    // Reset nota when modal opens
    setNota('')
  }, [rechazar])

  const handleRechazar = () => {
    rechazarCredito(row?.original?.id, row.original.estado, nota)
    closeModal('rechazar')
  }

  const handleChange = (e) => {
    const { value } = e.target
    setNota(value)
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
      formRef={formRef}
    >
      <div className="modal-content">
        <form ref={formRef} className="form-container">
          <div className="form-section">
            <div className="form-section-content">
              <div className="form-field simple full">
                <span>
                  Estás seguro que quieres rechazar este crédito de <strong>{row?.original.usuario}</strong>?
                </span>
              </div>

              <FormField
                type="textarea"
                label="Nota (Opcional)"
                name="nota"
                value={nota}
                onChange={handleChange}
                placeholder="Escribe una nota sobre el rechazo..."
                disabled={isRechazandoCredito}
                maxLength={500}
                classNames="full"
              />
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}