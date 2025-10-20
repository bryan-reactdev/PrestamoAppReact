import React, { useEffect, useState } from 'react'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'
import FormField from '../../Form/FormField'
import FormSelect from '../../Form/FormSelect'

export default function CreditoModalAceptar() {
  const { aceptar, row, closeModal } = useCreditoModalStore()
  const { aceptarCredito, descargarCreditoPDF } = useCreditoStore()

  const handleDescargarPDF = (tipo) => {
    descargarCreditoPDF(row.id, tipo);
  }
  
  const [formData, setFormData] = useState({
    montoAprobado: '',
    cuotaMensual: '',
    monto: '',
    mora: '',
    frecuencia: '',
    cuotaCantidad: ''
  })
  const [usuario, setUsuario] = useState(null)
  
  useEffect(() =>{
    setUsuario(row?.original?.usuario);

    setFormData((prev) => 
    ({...prev,
      montoAprobado: row?.original?.monto,
      frecuencia: row?.original?.frecuencia,
    }))
  }, [row])

  const handleAceptar = () => {
    aceptarCredito(row?.original?.id, formData)
    closeModal('aceptar')
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
      isOpen={aceptar}
      onConfirm={handleAceptar}
      onClose={() => closeModal('aceptar')}
      title={'Configurar Cargos Financieros'}
      customWidth={800}
      confirmText={`ACEPTAR`}
      // icon={'fas fa-cog'}
    >
      <div className="modal-content">
        <div className="form-container">

          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-file'></i>
              Información
            </div>

            <div className="form-section-content">
              <FormField
                name='montoAprobado'
                value={formData.montoAprobado}
                onChange={handleChange}
                label={'Monto del Crédito'} 
                type={'money'}
              />

              <FormSelect 
                label={'Frecuencia'}
                name='frecuencia'
                value={formData.frecuencia}
                onChange={handleChange}
              >
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </FormSelect>

              <div className={`form-field`}>
                  <label>Solicitante del Crédito</label>
                  <strong>{usuario}</strong>
              </div>

            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-cog'></i>
              Opciones
            </div>

            <div className="form-section-content">
              <div className="form-field half">
                <button className='btn-primary' onClick={() => handleDescargarPDF('PDFInfoPersonal')}>
                  <i className='fas fa-download'/>
                  DOCUMENTO DE EVALUACIÓN
                </button>
              </div>

              <div className="form-field half">
                <button className='btn-success'><i className='fas fa-dollar-sign'/>REFINANCIAR</button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-calculator'></i>
              Cargos
            </div>

            <div className="form-section-content">
              <FormField
                label={'Monto por Cuota'} 
                classNames={'full'}
                type={'money'}
                name='cuotaMensual'
                value={formData.cuotaMensual}
                onChange={handleChange}
                placeholder='Ingresa una cuota mensual'
              />
              <FormField
                label={'Mora'} 
                classNames={'full'}
                type={'money'}
                name='mora'
                value={formData.mora}
                onChange={handleChange}
                placeholder='Ingresa una mora'
              />
              <FormField
                label={'Cantidad de Cuotas'} 
                classNames={'full'}
                type={'number'}
                name='cuotaCantidad'
                value={formData.cuotaCantidad}
                onChange={handleChange}
                placeholder='Ingresa una cantidad de cuotas'
              />

            </div>
          </div>

        </div>
      </div>
    </BaseModal>
  )
}