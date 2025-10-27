import React, { useEffect, useState } from 'react'
import { BaseModal } from '../ModalUtils'
import { useCuotaStore } from '../../../stores/useCuotaStore'
import { useCuotaModalStore } from '../../../stores/Modal/useCuotaModalStore'
import FormField from '../../Form/FormField'
import { DateTimeToDate, getCurrentDate } from '../../../utils/dateUtils'

export default function CuotaModalNotas() {
  const { notas, closeModal, row } = useCuotaModalStore()
  const { cuota, getCuota, isFetchingCuota, guardarNotas, isGuardandoNotas } = useCuotaStore()
  
  const [cuotaNotas, setCuotaNotas] = useState([])

  const handleGuardar = async() => {
    const success = await guardarNotas(row.id, cuotaNotas)
    if (success) closeModal('notas')
  }

  useEffect(() => {
    if (!notas) return // only run when modal is open
    const cuotaId = row?.original?.id
    if (cuotaId) getCuota(cuotaId)
  }, [notas, row])

  useEffect(() => {
    setCuotaNotas(cuota?.notas || [])
  }, [cuota])

  // -- Handler for editing a specific note --
  const handleChange = (index, e) => {
    const { name, value } = e.target
    setCuotaNotas(prev =>
      prev.map((nota, i) =>
        i === index ? { ...nota, [name]: value } : nota
      )
    )
  }

  // -- Add a new note input (frontend-only until saved) --
  const handleAddNota = () => {
    setCuotaNotas(prev => [
      ...prev,
      {
        id: null, // backend will auto-assign
        contenido: '',
        fecha: getCurrentDate(),
      },
    ])
  }
    
  const handleDeleteNota = (index) => {
    setCuotaNotas(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <BaseModal
      isOpen={notas}
      onConfirm={handleGuardar}
      onClose={() => closeModal('notas')}
      customWidth={500}
      title="Notas de Cuota"
      confirmText="GUARDAR"
      cancelText="CERRAR"
    >
      <div className="modal-content">
        <div className="form-container">
          <div className="form-section">
              <div className="notas-container">
                {isFetchingCuota &&
                  <div className="spinner large"></div>
                }

                {cuotaNotas?.map((nota, index) => (
                  <div className='nota'>
                    <FormField
                      key={nota.id ?? `new-${index}`}
                      type="textarea"
                      label={`${DateTimeToDate(nota.fecha)}`}
                      name="contenido"
                      value={nota.contenido}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="Escribe una nota..."
                      disabled={isGuardandoNotas}
                      minLength={3}
                    />

                    <button
                      className={`btn-danger ${isGuardandoNotas && 'disabled'}`}
                      onClick={() => handleDeleteNota(index)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                ))}

                  {!isFetchingCuota &&
                  <button
                    type="button"
                    className={`btn-primary ${isGuardandoNotas && 'disabled'}`}
                    onClick={handleAddNota}
                    style={{width: '100%'}}
                  >
                    <i className="fas fa-plus"/>
                    AÑADIR NOTA
                  </button>
                  }
              </div>

          </div>
        </div>
      </div>
    </BaseModal>
  )
}
