import { BaseModal } from '../ModalUtils'
import { useCurrencyStore } from '../../../stores/useCurrencyStore'
import { useCurrencyModalStore } from '../../../stores/Modal/useCurrencyModalStore'
import FormField from '../../Form/FormField'
import { useEffect, useState, useRef } from 'react'
import FormSelect from '../../Form/FormSelect'
import { API_BASE_IP } from '../../../utils/axiosWrapper'

export default function CurrencyModalEditar() {
  const { editar, closeModal, row } = useCurrencyModalStore()
  const { editHistorial, isUpdatingHistorial, getBalance, ingresosVarios, egresosVarios } = useCurrencyStore()
  const [formData, setFormData] = useState({
    monto: '',
    motivo: '',
    tipo: '',
    fecha: ''
  })
  const [existingImages, setExistingImages] = useState([]) // Array of file paths to keep
  const [newImages, setNewImages] = useState([]) // Array of File objects
  const formRef = useRef(null)

  useEffect(() => {
    if (editar && row?.original) {
      const record = row.original
      setFormData({
        monto: record.monto || '',
        motivo: record.motivo || '',
        tipo: record.tipo || '',
        fecha: record.fecha ? record.fecha.split('T')[0] : ''
      })
      // Initialize existing images from record
      setExistingImages(record.imagenes || [])
      setNewImages([])
    }
  }, [editar, row])

  const handleGuardar = async () => {
    const success = await editHistorial(row.original?.id, formData, existingImages, newImages)
    if (success) {
      getBalance()
      closeModal('editar')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === 'file') {
      // Handle multiple file uploads - FormField passes files array in synthetic event
      const fileArray = Array.from(files || [])
      setNewImages(fileArray)
    } else {
      // Dynamically add/update the field
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'true' ? true : value === 'false' ? false : value,
      }))
    }
  }

  const handleRemoveExistingImage = (filePath) => {
    setExistingImages(prev => prev.filter(path => path !== filePath))
  }

  // Determine if it's an ingreso or egreso
  const tipo = row?.original?.tipo
  const id = row?.original?.id
  
  let isIngreso = false
  
  // Definitely ingreso
  if (tipo === 'Capital') {
    isIngreso = true
  }
  // Definitely egreso
  else if (tipo === 'Empresa' || tipo === 'Retiro de Cuotas') {
    isIngreso = false
  }
  // For "Varios", check which array contains this record
  else if (tipo === 'Varios') {
    // Check if it's in ingresos arrays
    const inIngresosVarios = ingresosVarios?.some(item => item.id === id)
    
    // Check if it's in egresos arrays
    const inEgresosVarios = egresosVarios?.some(item => item.id === id)
    
    // If found in ingresos arrays, it's an ingreso
    if (inIngresosVarios || inEgresosVarios) {
      isIngreso = true
    }
    else {
      isIngreso = false
    }
  }

  return (
    <BaseModal
      isOpen={editar}
      onConfirm={handleGuardar}
      onClose={() => closeModal('editar')}
      title={`Editar ${isIngreso ? 'Ingreso' : 'Egreso'}`}
      customWidth={600}
      confirmText="GUARDAR"
      confirmColor="success"
      cancelColor="secondary"
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
                {isIngreso ? (
                  <>
                    <option value={'Capital'}>Capital</option>
                    <option value={'Varios'}>Varios</option>
                  </>
                ) : (
                  <>
                    <option value={'Empresa'}>Empresa</option>
                    <option value={'Varios'}>Varios</option>
                    <option value={'Retiro de Cuotas'}>Retiro de Cuotas</option>
                  </>
                )}
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
                placeholder={'Escriba el motivo...'}
                required
                minLength={5}
              />

              {/* Existing Images Preview */}
              {existingImages.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Imágenes Existentes
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                    {existingImages.map((filePath, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          border: '2px solid #ddd',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={`${API_BASE_IP}${filePath}`}
                          alt={`Imagen ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(filePath)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(220, 53, 69, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}
                          title="Eliminar imagen"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FormField
                classNames={'primary'}
                label={'Agregar Nuevas Fotos/Facturas'}
                name={'images'}
                type={'file'}
                accept={'image/*'}
                multiple
                onChange={handleChange}
              />
            </div>
          </div>
        </form>

        {isUpdatingHistorial && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}

