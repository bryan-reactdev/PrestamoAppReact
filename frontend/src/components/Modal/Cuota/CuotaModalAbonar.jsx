import React, { useState } from 'react'
import { BaseModal } from '../ModalUtils'
import { useCuotaStore } from '../../../stores/useCuotaStore'
import { useCuotaModalStore } from '../../../stores/Modal/useCuotaModalStore'
import FormField from '../../Form/FormField'
import { getCurrentDate } from '../../../utils/dateUtils'

export default function CuotaModalAbonar() {
  const { abonar, closeModal, row } = useCuotaModalStore()
  const { abonarCuota } = useCuotaStore()
  
  const [formData, setFormData] = useState({
    monto: '',
    fecha: getCurrentDate(),
  });

  const handleAbonar = () => {
    abonarCuota(row.id, row, formData);
    
    setFormData({
      monto: '',
      fecha: getCurrentDate(),
    })
    closeModal('abonar')
  }

  // -- Handler para el formData --
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
      isOpen={abonar}
      onConfirm={handleAbonar}
      onClose={() => closeModal('abonar')}
      customWidth={500}
      title='Abonar Cuota'
      confirmText='ABONAR'
    >
      <div className="modal-content">

        <div className="form-container">
          <div className="form-section">
            <div className="form-section-content">
              <FormField
                classNames='primary success'
                type='money'
                label={'Monto a Abonar'}
                name='monto'
                value={formData.monto}
                onChange={handleChange}  
                placeholder='0.00'
                required
                min={0.01}
              />

              <FormField
                classNames='primary'
                type='date'
                label={'Fecha de Abono'}
                name='fecha'
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div> 
        
      </div>
    </BaseModal>
  )
}