import { BaseModal } from '../ModalUtils'
import { useCurrencyStore } from '../../../stores/useCurrencyStore'
import { useCurrencyModalStore } from '../../../stores/Modal/useCurrencyModalStore'
import FormField from '../../Form/FormField'
import { useEffect, useState } from 'react'
import FormSelect from '../../Form/FormSelect'

export default function CurrencyModalIngreso() {
    const { ingreso, row, closeModal } = useCurrencyModalStore()
    const { realizarIngreso, selectedDate } = useCurrencyStore()
    const [formData, setFormData] = useState({
      monto: '',
      motivo: '',
      tipo: '',
      fecha: selectedDate ?? ''
    })

  const handleRealizar = () => {
    realizarIngreso(formData)

    // -- Clear form data --
    formData.monto = '';
    formData.motivo = '';
    formData.tipo = '';

    closeModal('ingreso')
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
      isOpen={ingreso}
      onConfirm={handleRealizar}
      onClose={() => closeModal('ingreso')}
      title={'Realizar Ingreso'}
      customWidth={500}
      confirmText={`REALIZAR INGRESO`}
      confirmColor='success'
      cancelColor='secondary'
    >
      <div className="modal-content">
        <div className="form-container">
          <div className="form-section">
            <div className="form-section-content">
              <FormField
                classNames={'primary success'}
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
                <option value={'Capital'}>Capital</option>
                <option value={'Varios'}>Varios</option>
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
                placeholder={'Escriba el motivo del ingreso...'}
                required
                minLength={5}
              />
            </div>
          </div>
        </div>

        <p className='color-secondary'>Esta función está hecha para registrar ingresos generales. Los pagos de cuotas deben registrarse desde el listado de cuotas de cada cliente.</p>
      </div>
    </BaseModal>
  )
}