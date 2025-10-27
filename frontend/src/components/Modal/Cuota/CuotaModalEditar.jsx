import { useEffect, useState } from 'react'
import { BaseModal } from '../ModalUtils'
import { useCuotaStore } from '../../../stores/useCuotaStore'
import { useCuotaModalStore } from '../../../stores/Modal/useCuotaModalStore'
import FormField from '../../Form/FormField'
import FormSelect from '../../Form/FormSelect'

export default function CuotaModalEditar() {
  const { editar, closeModal, row } = useCuotaModalStore()
  const { cuota, getCuota, isFetchingCuota, updateCuota, isUpdatingCuota } = useCuotaStore()
  const [formData, setFormData] = useState(null)
  
  const handleGuardar = async() => {
    const success = await updateCuota(row.id, formData)
    if (success) closeModal('editar')
  }

  useEffect(() => {
    if (!editar) return // only run when modal is open

    const cuotaId = row?.original?.id
    if (cuotaId) getCuota(cuotaId)
  }, [editar, row])

  useEffect(() => {
    if (editar && cuota) {
      setFormData({
        fechaVencimiento: cuota.fechaVencimiento,
        fechaPagado: cuota.fechaPagado,
        
        estado: cuota.estado,
        
        monto: cuota.monto,
        mora: cuota.mora,
      })
    }
  }, [editar, cuota])

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Dynamically add/update the field
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true' ? true : value === 'false' ? false : value,
    }));
  };

  return (
    <BaseModal
      isOpen={editar}
      onConfirm={handleGuardar}
      onClose={() => closeModal('editar')}
      customWidth={800}
      title="Editar Cuota"
      confirmText="GUARDAR"
      cancelText="CERRAR"
    >
      <div className="modal-content">
        <div className="form-container">
          <div className="form-section">
              {!formData || isFetchingCuota ? (
                <div className="spinner large"></div>
              ) : (
                <div className='form-section-content'>
                  <FormSelect
                    classNames="two"
                    label="Estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Pagado" disabled hidden>Pagado</option>
                    <option value="EnRevision" disabled hidden>EnRevision</option>
                  </FormSelect>

                  <FormField
                    classNames={'two'}
                    label={'Fecha Vencimiento'}
                    type='date'
                    name='fechaVencimiento'
                    value={formData.fechaVencimiento}
                    onChange={handleChange}
                    required
                  />

                  <FormField
                    classNames={'two'}
                    label={'Fecha Pagado'}
                    type='date'
                    name='fechaPagado'
                    value={formData.fechaPagado}
                    onChange={handleChange}
                  />

                  <FormField
                    classNames={'two'}
                    label={'Monto'}
                    type='money'
                    name='monto'
                    value={formData.monto}
                    onChange={handleChange}
                    required
                    min={0.01}
                  />

                  <FormField
                    classNames={'two'}
                    label={'Mora'}
                    type='money'
                    name='mora'
                    value={formData.mora}
                    onChange={handleChange}
                    min={0}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
