import { BaseModal } from '../ModalUtils'
import { useCurrencyModalStore } from '../../../stores/Modal/useCurrencyModalStore'
import { useState, useEffect } from 'react'
import { API_BASE_IP } from '../../../utils/axiosWrapper'

export default function CurrencyModalVerImagenes() {
  const { verImagenes, row, closeModal } = useCurrencyModalStore()
  const [selectedImage, setSelectedImage] = useState(null)
  const [isIngreso, setIsIngreso] = useState(false)

  useEffect(() => {
    if (verImagenes && row?.original) {
      const isIngresoType = row.original?.tipo === 'Capital' || (row.original?.tipo === 'Varios' && row.original?.tipo !== 'Empresa')
      setIsIngreso(isIngresoType)
    }
  }, [verImagenes, row])

  // Get images directly from row data
  const imagenes = row?.original?.imagenes || []

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseFullscreen = () => {
    setSelectedImage(null)
  }

  if (!verImagenes) return null
  console.log(row.original)

  return (
    <>
      <BaseModal
        isOpen={verImagenes}
        onClose={() => {
          closeModal('verImagenes')
          setSelectedImage(null)
        }}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', padding: '16px' }}>
              {imagenes.map((filePath, index) => {
                const image = { filePath };
                return (
                <div
                  key={index}
                  onClick={() => handleImageClick(image)}
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
                    src={`${API_BASE_IP}${image.filePath}`}
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
                      background: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      fontSize: '10px',
                      padding: '4px',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={image.filePath?.split('/').pop() || `Imagen ${index + 1}`}
                  >
                    {filePath?.split('/').pop() || `Imagen ${index + 1}`}
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </BaseModal>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          onClick={handleCloseFullscreen}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <img
            src={`${API_BASE_IP}${selectedImage.filePath}`}
            alt={selectedImage.filePath?.split('/').pop() || 'Imagen'}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCloseFullscreen()
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </>
  )
}

