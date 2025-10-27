import { BaseModal } from '../ModalUtils'
import { useCurrencyStore } from '../../../stores/useCurrencyStore'
import { useCurrencyModalStore } from '../../../stores/Modal/useCurrencyModalStore'
import FormField from '../../Form/FormField'
import { useEffect, useState } from 'react'
import FormSelect from '../../Form/FormSelect'

export default function CurrencyModalEgreso() {
    const { egreso, row, closeModal } = useCurrencyModalStore()
    const { realizarEgreso, selectedDate } = useCurrencyStore()
    const [formData, setFormData] = useState({
      monto: '',
      motivo: '',
      tipo: '',
      fecha: selectedDate ?? ''
    })

  const handleRealizar = () => {
    realizarEgreso(formData)

    // -- Clear form data --
    formData.monto = '';
    formData.motivo = '';
    formData.tipo = '';

    closeModal('egreso')
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
  
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fecha: selectedDate ?? ''
    }));
  }, [selectedDate]);

  return (
    <BaseModal
      isOpen={egreso}
      onConfirm={handleRealizar}
      onClose={() => closeModal('egreso')}
      title={'Realizar Egreso'}
      customWidth={500}
      confirmText={`REALIZAR EGRESO`}
      confirmColor='danger'
      cancelColor='secondary'
    >
      <div className="modal-content">
        <div className="form-container">
          <div className="form-section">
            <div className="form-section-content">
              <FormField
                classNames={'primary danger'}
                label={'Monto'}
                name={'monto'}
                type={'money'}
                value={formData.monto}
                onChange={handleChange}
                placeholder={'0.00'}
                required
                min={0.01}
              />

              <FormSelect
                classNames={'primary'}
                label={'Tipo'}
                name={'tipo'}
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value={'Empresa'}>Empresa</option>
                <option value={'Varios'}>Varios</option>
                <option value={'Retiro de Cuotas'}>Retiro de Cuotas</option>
              </FormSelect>

              <FormField
                classNames={'primary'}
                label={'Fecha'}
                name={'fecha'}
                type={'date'}
                value={formData.fecha}
                onChange={handleChange}
                required
              />

              <FormField
                classNames={'primary'}
                label={'Motivo'}
                name={'motivo'}
                type={'textarea'}
                value={formData.motivo}
                onChange={handleChange}
                placeholder={'Escriba el motivo del egreso...'}
                required
                minLength={5}
              />
            </div>
          </div>
        </div>

        <p className='color-secondary'>Esta función está hecha para registrar egresos generales. Los desembolsos deben registrarse desde el listado de créditos de cada cliente.</p>
      </div>
    </BaseModal>
  )
}