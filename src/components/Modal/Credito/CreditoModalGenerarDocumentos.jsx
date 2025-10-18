import React, { useEffect, useState } from 'react'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'

export default function CreditoModalGenerarDocumentos() {
  const { generarDocumentos, row, closeModal } = useCreditoModalStore()
  const {descargarCreditoPDF} = useCreditoStore();

  const handleDescargarPDF = (tipo) => {
    descargarCreditoPDF(row.id, tipo);
  }

  return (
    <BaseModal
      isOpen={generarDocumentos}
      onClose={() => closeModal('generarDocumentos')}
      customWidth={500}
      title={'Generar Documentos'}
      cancelText='CERRAR'
      cancelColor='secondary'
    >
      <div className="modal-content">
        <div className="button-container vertical">
          <button className='btn-primary' onClick={() => handleDescargarPDF('PDFSolicitud')}><i className='fas fa-download'/>FORMULARIO DE SOLICITUD DE CRÉDITO</button>
          <button className='btn-primary' onClick={() => handleDescargarPDF('PDFSolicitudContrato')}><i className='fas fa-download'/>CONTRATO INTEGRAL DE PRÉSTAMOS Y PAGARÉ SOLIDARIO</button>
          <button className='btn-primary' onClick={() => handleDescargarPDF('PDFSolicitudCuestionario')}><i className='fas fa-download'/>CUESTIONARIO DE ANTECEDENTES DE PAGO</button>
          <button className='btn-primary' onClick={() => handleDescargarPDF('PDFSolicitudAnexo')}><i className='fas fa-download'/>ANÉXO DE RÉSPETO, NO DIFAMACIÓN Y BUENA FE COMERCIAL</button>
          <button className='btn-primary' onClick={() => handleDescargarPDF('PDFDocumentosPersonales')}><i className='fas fa-download'/>FOTOS DE DOCUMENTOS PERSONALES</button>
        </div>
      </div>
    </BaseModal>
  )
}