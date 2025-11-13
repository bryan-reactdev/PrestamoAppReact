import { BaseModal } from '../ModalUtils'
import { useCurrencyStore } from '../../../stores/useCurrencyStore'
import { useModalStore } from '../../../stores/Modal/useModalStore'
import FormField from '../../Form/FormField'
import { useState, useEffect } from 'react'
import { getCurrentDate } from '../../../utils/dateUtils'

export default function CurrencyModalPDFDiario() {
    const { pdfDiario } = useModalStore()
    const { descargarPDFDiario } = useCurrencyStore()
    const [selectedDate, setSelectedDate] = useState(getCurrentDate())

    useEffect(() => {
        if (pdfDiario) {
            setSelectedDate(getCurrentDate())
        }
    }, [pdfDiario])

    const handleConfirm = () => {
        if (selectedDate) {
            descargarPDFDiario(selectedDate)
            useModalStore.getState().closeModal('pdfDiario')
        }
    }

    const handleClose = () => {
        useModalStore.getState().closeModal('pdfDiario')
    }

    return (
        <BaseModal
            isOpen={pdfDiario}
            onConfirm={handleConfirm}
            onClose={handleClose}
            title="Generar Reporte Diario PDF"
            icon="fas fa-print"
            confirmText="GENERAR PDF"
            confirmColor="primary"
            cancelText="CANCELAR"
        >
            <div className="modal-content">
                <FormField 
                    classNames={'simple'}
                    label={'Fecha'} 
                    type="date"
                    name="fecha"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                />
            </div>
        </BaseModal>
    )
}

