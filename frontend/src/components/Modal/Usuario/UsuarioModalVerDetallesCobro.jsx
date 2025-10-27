import { BaseModal } from '../ModalUtils'
import BaseTable from '../../Table/BaseTable'
import { useUsuarioModalStore } from '../../../stores/Modal/useUsuarioModalStore'
import { useState, useEffect } from 'react'
import { creditosTodosColumns } from '../../Table/Credito/CreditoTableDefinitions'
import { cuotasTodosColumns, cuotasTodosMinimalColumns } from '../../Table/Cuota/CuotaTableDefinitions'
import FormField from '../../Form/FormField'

export default function UsuarioModalVerDetallesCobro() {
  const { verDetallesCobro, row, closeModal } = useUsuarioModalStore()
  const [selectedCredito, setSelectedCredito] = useState(null)

  // Reset selected credito when modal opens/closes
  useEffect(() => {
    if (verDetallesCobro) {
      setSelectedCredito(null)
    }
  }, [verDetallesCobro])

  const handleCloseModal = () => {
    setSelectedCredito(null)
    closeModal('verDetallesCobro')
  }

  const handleCreditoSelect = (credito) => {
    setSelectedCredito(credito)
  }

  if (!row?.original) return null

  console.log(row.original)
  const usuarioData = row.original
  const creditos = usuarioData.creditos || []

  return (
    <BaseModal
      isOpen={verDetallesCobro}
      onClose={handleCloseModal}
      customWidth={1200}
      title={`Detalles para Cobro - ${usuarioData.usuario}`}
      cancelText="CERRAR"
    >
      <div className="modal-content">
        {/* User Info Header */}
        <div>
          <h3>{usuarioData.usuario}</h3>
          <FormField
            label="Dirección"
            value={usuarioData.direccion}
            disabled={true}
          />
        </div>

        {/* Creditos Table */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Créditos</h4>
          <BaseTable
            data={creditos}
            columns={creditosTodosColumns}
            hideSearchbar={true}
            hidePagination={true}
            selectedRowId={selectedCredito?.id}
            onRowSelect={handleCreditoSelect}
            centered={['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado']}
            flexable={[]}
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
              flexable={[]}
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
      </div>
    </BaseModal>
  )
}
