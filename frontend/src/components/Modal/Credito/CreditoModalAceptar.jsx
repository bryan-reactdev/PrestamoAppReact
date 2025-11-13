import React, { useEffect, useState, useRef } from 'react'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'
import FormField from '../../Form/FormField'
import FormSelect from '../../Form/FormSelect'
import BaseTable from '../../Table/BaseTable'
import { creditosRefinanciarColumns } from '../../Table/Credito/CreditoTableDefinitions'
import { cuotasRefinanciablesColumns } from '../../Table/Cuota/CuotaTableDefinitions'
import { CreditosAceptadosCard } from '../../Card/Credito/CreditoCardDefinitions'
import { CuotasPendientesCard } from '../../Card/Cuota/CuotaCardDefinitions'

export default function CreditoModalAceptar() {
  const { aceptar, row, closeModal } = useCreditoModalStore()
  const { aceptarCredito, descargarCreditoPDF, creditosRefinanciables, getCreditosRefinanciables, isFetchingCreditosRefinanciables } = useCreditoStore()

  const [selectedCredito, setSelectedCredito] = useState(null);
  const [selectedCuotas, setSelectedCuotas] = useState([]);
  const [refinanciados, setRefinanciados] = useState(false);
  const [document, setDocument] = useState(null);
  const formRef = useRef(null);

  const handleDescargarPDF = (tipo) => {
    descargarCreditoPDF(row.id, tipo);
  }
  
  const [formData, setFormData] = useState({
    montoAprobado: '',
    cuotaMensual: '',
    monto: '',
    mora: '',
    frecuencia: '',
    cuotaCantidad: '',
    document: null,
    nota: ''
  })
  const [usuario, setUsuario] = useState(null)
  
  useEffect(() =>{
    setUsuario(row?.original?.usuario);

    setFormData((prev) => 
    ({...prev,
      montoAprobado: row?.original?.monto,
      frecuencia: row?.original?.frecuencia,
      document: null,
      nota: row?.original?.nota || ''
    }))

    setDocument(null);
    setRefinanciados(false);
  }, [row])

  // -- Handler para el formData --
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Handle file uploads
      const file = files?.[0];
      if (file) {
        setDocument(file);
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    } else {
      // Dynamically add/update the field
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'true' ? true : value === 'false' ? false : value,
      }));
    }
  };

  const handleCuotaChange = (rowIndex, field, newValue) => {
    setSelectedCuotas((prev) => {
      const current = prev[rowIndex];

      // Avoid unnecessary re-renders
      if (current[field] === newValue) return prev;

      // Copy row and update the changed field
      const updatedRow = { ...current, [field]: newValue };

      // Recalculate total if relevant fields change
      if (['monto', 'mora', 'abono'].includes(field)) {
        const monto = parseFloat(updatedRow.monto) || 0;
        const mora = parseFloat(updatedRow.mora) || 0;
        const abono = parseFloat(updatedRow.abono) || 0;

        updatedRow.total = monto + mora - abono;
      }

      const updated = [...prev];
      updated[rowIndex] = updatedRow;
      return updated;
    });
  };

  const getCuotasTotal = () => {
    if (!selectedCuotas || selectedCuotas.length === 0) return 0;

    return selectedCuotas.reduce((sum, item) => {
      if (item.estado === "Pagado") return sum;
      return sum + (item?.total || 0)
    }, 0);
  };

  const handleRefinanciar = async() => {
    const success = await getCreditosRefinanciables(row?.id); 
    setRefinanciados(success);
  }

  const handleAceptar = () => {
    let payload = { ...formData };

    if (selectedCredito != null) {
      payload.selectedCreditoId = selectedCredito.id;
      payload.selectedCuotas = selectedCuotas;
    }

    // Include document file if present
    if (document) {
      payload.document = document;
    }

    aceptarCredito(row?.original?.id, payload);
    closeModal('aceptar');
  };

  const monto = Number(formData.montoAprobado) || Number(row?.original?.monto) || 0;
  const showDocumentField = monto >= 201;

  return (
    <BaseModal
      isOpen={aceptar}
      onConfirm={handleAceptar}
      onClose={() => closeModal('aceptar')}
      title={'Configurar Cargos Financieros'}
      customWidth={900}
      confirmText={`ACEPTAR`}
      formRef={formRef}
      // icon={'fas fa-cog'}
    >
      <div className="modal-content">
        <form ref={formRef} className="form-container">

          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-file'></i>
              Información
            </div>

            <div className="form-section-content">
              <FormField
                name='montoAprobado'
                value={formData.montoAprobado}
                onChange={handleChange}
                label={'Monto del Crédito'} 
                type={'money'}
                required
                min={1}
              />

              <FormSelect 
                label={'Frecuencia'}
                name='frecuencia'
                value={formData.frecuencia}
                onChange={handleChange}
                required
              >
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </FormSelect>

              <div className={`form-field`}>
                  <label>Solicitante del Crédito</label>
                  <strong>{usuario}</strong>
              </div>

            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-cog'></i>
              Opciones
            </div>

            <div className="form-section-content">
              <div className="form-field half">
                <button className='btn-primary' onClick={() => handleDescargarPDF('PDFInfoPersonal')}>
                  <i className='fas fa-download'/>
                  DOCUMENTO DE EVALUACIÓN
                </button>
              </div>

              <div className="form-field half">
                <button
                  className={`btn-success ${
                    isFetchingCreditosRefinanciables ? 'disabled loading' : refinanciados ? 'disabled' : ''
                  }`}
                  onClick={handleRefinanciar}
                >
                  {isFetchingCreditosRefinanciables ? (
                    <span className="spinner small"></span>
                  ) : refinanciados && creditosRefinanciables.length === 0 ? (
                    <>
                      <i className="fas fa-times" /> NO HAY CRÉDITOS
                    </>
                  ) : (
                    <>
                      <i className="fas fa-dollar-sign" /> REFINANCIAR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {(refinanciados && creditosRefinanciables.length !== 0) &&
          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-dollar-sign'></i>
              Créditos Refinanciables
            </div>

            <div className="form-section-content" style={{display: 'flex', flexDirection: 'column'}}>
              <BaseTable
                data={creditosRefinanciables}
                columns={creditosRefinanciarColumns}
                card={CreditosAceptadosCard}
                cardProps={{ disableModal: true }}
                centered={['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion', ]} 
                flexable='usuario' 
                loading={isFetchingCreditosRefinanciables}
                hideSearchbar
                hidePagination
                selectedRowId={selectedCredito?.id}
                onRowSelect={(row) => {
                  setSelectedCredito(row);
                  // Filter out paid cuotas (cuotasPagadas) from the cuotas
                  const unpaidCuotas = (row.cuotas ?? []).filter(cuota => cuota.estado !== 'Pagado');
                  setSelectedCuotas(unpaidCuotas);
                }}

              />
              
              {selectedCredito &&
              <>
                <h3 style={{margin: 0, padding: 0}}>Cuotas</h3>

                <BaseTable
                  data={selectedCuotas}
                  card={CuotasPendientesCard}
                  columns={cuotasRefinanciablesColumns(selectedCuotas, handleCuotaChange)}
                  centered={['estado', 'fechaVencimiento', 'monto', 'mora', 'total', 'desembolsado', 'accion', ]} 
                  flexable='usuario' 
                  loading={isFetchingCreditosRefinanciables}
                  hideSearchbar
                  hidePagination
                />

                {/* -- Totales -- */}
                <div className="form-section-content">
                  <FormField
                    label={'Monto Actual'} 
                    classNames={'simple two success no-border'}
                    type={'money'}
                    name='montoAprobado'
                    value={formData.montoAprobado}
                    onChange={handleChange}
                  />
                  <FormField
                    label={'Monto a Descontar'} 
                    classNames={'simple two danger no-border'}
                    type={'money'}
                    value={getCuotasTotal()}
                    readonly
                    disabled
                  />

                  <FormField
                    label={'Monto Final'} 
                    classNames={'simple two'}
                    type={'money'}
                    value={(formData.montoAprobado || 0) - getCuotasTotal()}
                    readonly
                    disabled
                  />
                </div>
              </>
              }
            </div>

          </div>
          }

          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-calculator'></i>
              Cargos
            </div>

            <div className="form-section-content">
              <FormField
                label={'Monto por Cuota'} 
                classNames={'full'}
                type={'money'}
                name='cuotaMensual'
                value={formData.cuotaMensual}
                onChange={handleChange}
                placeholder='0.00'
                required
                min={1}
              />
              <FormField
                label={'Mora'} 
                classNames={'full'}
                type={'money'}
                name='mora'
                value={formData.mora}
                onChange={handleChange}
                placeholder='0.00'
                min={0}
              />
              <FormField
                label={'Cantidad de Cuotas'} 
                classNames={'full'}
                type={'number'}
                name='cuotaCantidad'
                value={formData.cuotaCantidad}
                onChange={handleChange}
                placeholder='Ej: 12'
                required
                min={1}
                max={60}
              />

              {showDocumentField && (
                <FormField
                  classNames={'full'}
                  name='document'
                  onChange={handleChange}
                  label={'Documento'} 
                  type={'file'}
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
              )}

              <FormField
                classNames={'full'}
                name='nota'
                value={formData.nota}
                onChange={handleChange}
                label={'Nota'} 
                type={'textarea'}
                placeholder='Notas adicionales sobre el crédito...'
                maxLength={500}
              />

            </div>
          </div>

        </form>
      </div>
    </BaseModal>
  )
}