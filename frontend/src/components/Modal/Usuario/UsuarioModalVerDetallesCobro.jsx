import { BaseModal } from '../ModalUtils'
import BaseTable from '../../Table/BaseTable'
import { useUsuarioModalStore } from '../../../stores/Modal/useUsuarioModalStore'
import { useUsuarioStore } from '../../../stores/useUsuarioStore'
import { useState, useEffect } from 'react'
import { creditosTodosMinimalColumns } from '../../Table/Credito/CreditoTableDefinitions'
import { cuotasTodosMinimalColumns } from '../../Table/Cuota/CuotaTableDefinitions'
import FormField from '../../Form/FormField'

export default function UsuarioModalVerDetallesCobro() {
  const { verDetallesCobro, row, closeModal } = useUsuarioModalStore()
  const { usuario, getUsuario, isFetchingUsuario } = useUsuarioStore()
  const [selectedCredito, setSelectedCredito] = useState(null)

  // Reset selected credito when modal opens/closes
  useEffect(() => {
    if (verDetallesCobro) {
      setSelectedCredito(null)
    }
  }, [verDetallesCobro])

  // Fetch usuario data if userId is present
  useEffect(() => {
    const userId = row?.original?.userId
    if (userId && verDetallesCobro) {
      getUsuario(userId)
    }
  }, [row, verDetallesCobro, getUsuario])

  const handleCloseModal = () => {
    setSelectedCredito(null)
    closeModal('verDetallesCobro')
  }

  const handleCreditoSelect = (credito) => {
    setSelectedCredito(credito)
  }

  if (!row?.original) return null

  // Determine which data source to use
  const hasUserId = row.original.userId
  const fetchedUsuario = usuario
  
  const usuarioData = hasUserId && fetchedUsuario ? fetchedUsuario : row.original
  const creditos = hasUserId && fetchedUsuario ? (fetchedUsuario.creditos || []) : (row.original.creditos || [])

  return (
    <BaseModal
      isOpen={verDetallesCobro}
      onClose={handleCloseModal}
      customWidth={1000}
      title={`Detalles para Cobro`}
      cancelText="CERRAR"
    >
      <div className="modal-content" style={{width: '80%'}}>
        {isFetchingUsuario && hasUserId ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="spinner large" />
          </div>
        ) : (
          <>
            {/* User Info Header */}
            <h3>{usuarioData.usuario || `${usuarioData.nombres} ${usuarioData.apellidos}`}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
              <FormField
                classNames={'one'}
                label="Dirección"
                value={usuarioData.direccion}
                type="textarea"
                disabled={true}
              />
              <FormField
                classNames={'one'}
                label="Celular"
                type="phone"
                value={usuarioData.celular}
                disabled={true}
              />
            </div>

        {/* Creditos Table */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Créditos</h4>
          <BaseTable
            data={creditos}
            columns={creditosTodosMinimalColumns}
            hideSearchbar={true}
            hidePagination={true}
            selectedRowId={selectedCredito?.id}
            onRowSelect={handleCreditoSelect}
            centered={['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado']}
            flexable={['monto']}
          />
        </div>

        {/* Cuotas Table for Selected Credito */}
        {selectedCredito && (
          <div>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>
              Cuotas del Crédito de ${selectedCredito.monto}
            </h4>
            <BaseTable
              data={(selectedCredito.cuotas || []).filter(cuota => cuota.estado !== 'Pagado')}
              columns={cuotasTodosMinimalColumns}
              hideSearchbar={true}
              hidePagination={true}
              centered={['estado', 'fechaVencimiento', 'monto', 'mora', 'abono', 'total']}
              flexable={['fechaVencimiento']}
            />
          </div>
        )}

        {!selectedCredito && creditos.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p>Selecciona un crédito para ver sus cuotas</p>
          </div>
        )}

        {creditos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p>No hay créditos disponibles para este usuario</p>
          </div>
        )}
          </>
        )}
      </div>
    </BaseModal>
  )
}
