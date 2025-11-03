import { BaseModal } from '../ModalUtils'
import { useCurrencyStore } from '../../../stores/useCurrencyStore'
import { useCurrencyModalStore } from '../../../stores/Modal/useCurrencyModalStore'
import FormField from '../../Form/FormField'
import { useEffect, useState, useRef } from 'react'
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
    const [images, setImages] = useState([])
    const formRef = useRef(null)

  const handleRealizar = () => {
    realizarIngreso(formData, images)

    // -- Clear form data --
    setFormData({
      monto: '',
      motivo: '',
      tipo: '',
      fecha: selectedDate ?? ''
    })
    setImages([])

    closeModal('ingreso')
  }

  // -- Handler para el formData --
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Handle multiple file uploads - FormField passes files array in synthetic event
      const fileArray = Array.from(files || []);
      setImages(fileArray);
    } else {
      // Dynamically add/update the field
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'true' ? true : value === 'false' ? false : value,
      }));
    }
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
      formRef={formRef}
    >
      <div className="modal-content">
        <form ref={formRef} className="form-container">
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

              <FormField
                classNames={'primary'}
                label={'Fotos/Facturas'}
                name={'images'}
                type={'file'}
                accept={'image/*'}
                multiple
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </form>

        <p className='color-secondary'>Esta función está hecha para registrar ingresos generales. Los pagos de cuotas deben registrarse desde el listado de cuotas de cada cliente.</p>
      </div>
    </BaseModal>
  )
}