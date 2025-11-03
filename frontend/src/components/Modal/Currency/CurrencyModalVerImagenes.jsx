import { BaseModal } from '../ModalUtils'
import { useCurrencyModalStore } from '../../../stores/Modal/useCurrencyModalStore'
import { useState, useEffect } from 'react'
import { API_BASE_IP } from '../../../utils/axiosWrapper'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

export default function CurrencyModalVerImagenes() {
  const { verImagenes, row, closeModal } = useCurrencyModalStore()
  const [isIngreso, setIsIngreso] = useState(false)

  useEffect(() => {
    if (verImagenes && row?.original) {
      const isIngresoType = row.original?.tipo === 'Capital' || (row.original?.tipo === 'Varios' && row.original?.tipo !== 'Empresa')
      setIsIngreso(isIngresoType)
    }
  }, [verImagenes, row])

  // Get images directly from row data
  const imagenes = row?.original?.imagenes || []

  if (!verImagenes) return null

  return (
    <BaseModal
      isOpen={verImagenes}
      onClose={() => closeModal('verImagenes')}
      title={isIngreso ? `Imágenes del Ingreso de $${row?.original?.monto}` : `Imágenes del Egreso de $${row?.original?.monto}`}
      customWidth={800}
      cancelText='CERRAR'
      cancelColor='secondary'
    >
      <div className="modal-content">
        <h4 style={{ margin: 0, padding: 0 }}>{row?.original?.motivo}</h4>
        {imagenes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <i className="fas fa-images" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
            <p>No hay imágenes disponibles para este registro</p>
          </div>
        ) : (
          <PhotoProvider>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', padding: '16px' }}>
              {imagenes.map((filePath, index) => {
                const imageUrl = `${API_BASE_IP}${filePath}`
                return (
                  <PhotoView key={index} src={imageUrl}>
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        cursor: 'pointer',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        backgroundColor: '#f9fafb'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          overflow: 'hidden',
                        }}
                      >
                      </div>
                    </div>
                  </PhotoView>
                )
              })}
            </div>
          </PhotoProvider>
        )}
      </div>
    </BaseModal>
  )
}

