import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'
import FormField from '../../Form/FormField'
import { useState } from 'react'
import { getCurrentDate } from '../../../utils/dateUtils'

export default function CreditoModalDesembolsar() {
  const { desembolsar, row, closeModal } = useCreditoModalStore()
  const { setCreditoDesembolsado } = useCreditoStore()
  const [formData, setFormData] = useState({
    fechaDesembolso: getCurrentDate(),
    fechaPrimeraComision: getCurrentDate(),
  });

  if (row === null || row.original === null) return;

  const handleDesembolsar = () => {
    setCreditoDesembolsado(row.id, row.original.desembolsado, formData);
    closeModal('desembolsar')
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  return (
    <BaseModal
      isOpen={desembolsar}
      onConfirm={handleDesembolsar}
      onClose={() => closeModal('desembolsar')}
      customWidth={500}
      title={!row.original.desembolsado ? '¿Desembolsar?' : '¿Revertir desembolso?'}
      confirmText={`SÍ, ${!row.original.desembolsado ? 'DESEMBOLSAR' : 'REVERTIR DESEMBOLSO'}`}
      icon={'fas fa-warning color-orange'}
    >
      <div className="modal-content">
        <span>
          ¿Estás seguro de que deseas {!row.original.desembolsado ? 'desembolsar' : 'revertir el desembolso de'} este crédito de <strong>{row.original.usuario}</strong>?

          {!row.original.desembolsado &&
          <>
            <FormField
              classNames={'primary'}
              label={'Fecha de Desembolso'}
              type='date'
              name='fechaDesembolso'
              value={formData?.fechaDesembolso}
              onChange={handleChange}
              required
            />

            <br />

            <FormField
              classNames={'primary'}
              label={'Fecha de Primer Cobro'}
              type='date'
              name='fechaPrimeraComision'
              value={formData?.fechaPrimeraComision}
              onChange={handleChange}
              required
            />
          </>
          }
        </span>
      </div>
    </BaseModal>
  )
}