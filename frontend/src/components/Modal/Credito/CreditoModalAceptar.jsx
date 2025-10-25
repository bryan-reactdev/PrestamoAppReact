import React, { useEffect, useState } from 'react'
import { useCreditoStore } from '../../../stores/useCreditoStore'
import { BaseModal } from '../ModalUtils'
import { useCreditoModalStore } from '../../../stores/Modal/useCreditoModalStore'
import FormField from '../../Form/FormField'
import FormSelect from '../../Form/FormSelect'
import BaseTable from '../../Table/BaseTable'
import { creditosRefinanciarColumns } from '../../Table/Credito/CreditoTableDefinitions'
import { CreditosDefaultCard } from '../../Card/Credito/CreditoCardDefinitions'
import { cuotasRefinanciablesColumns, cuotasTodosColumns } from '../../Table/Cuota/CuotaTableDefinitions'
import { CuotasPendientesCard } from '../../Card/Cuota/CuotaCardDefinitions'

export default function CreditoModalAceptar() {
  const { aceptar, row, closeModal } = useCreditoModalStore()
  const { aceptarCredito, descargarCreditoPDF, creditosRefinanciables, getCreditosRefinanciables, isFetchingCreditosRefinanciables } = useCreditoStore()

  const [selectedCredito, setSelectedCredito] = useState(null);
  const [selectedCuotas, setSelectedCuotas] = useState([]);
  const [refinanciados, setRefinanciados] = useState(false);

  const handleDescargarPDF = (tipo) => {
    descargarCreditoPDF(row.id, tipo);
  }
  
  const [formData, setFormData] = useState({
    montoAprobado: '',
    cuotaMensual: '',
    monto: '',
    mora: '',
    frecuencia: '',
    cuotaCantidad: ''
  })
  const [usuario, setUsuario] = useState(null)
  
  useEffect(() =>{
    setUsuario(row?.original?.usuario);

    setFormData((prev) => 
    ({...prev,
      montoAprobado: row?.original?.monto,
      frecuencia: row?.original?.frecuencia,
    }))

    setRefinanciados(false);
  }, [row])

  // -- Handler para el formData --
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Dynamically add/update the field
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true' ? true : value === 'false' ? false : value,
    }));
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
    const success = await getCreditosRefinanciables(row?.original?.id); 
    setRefinanciados(success);
  }

  const handleAceptar = () => {
    let payload = { ...formData };

    if (selectedCredito != null) {
      payload.selectedCreditoId = selectedCredito.id;
      payload.selectedCuotas = selectedCuotas;
    }

    aceptarCredito(row?.original?.id, payload);
    closeModal('aceptar');
  };

  return (
    <BaseModal
      isOpen={aceptar}
      onConfirm={handleAceptar}
      onClose={() => closeModal('aceptar')}
      title={'Configurar Cargos Financieros'}
      customWidth={800}
      confirmText={`ACEPTAR`}
      // icon={'fas fa-cog'}
    >
      <div className="modal-content">
        <div className="form-container">

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
              />

              <FormSelect 
                label={'Frecuencia'}
                name='frecuencia'
                value={formData.frecuencia}
                onChange={handleChange}
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
                    <i className="fas fa-times" />
                  ) : (
                    <>
                      <i className="fas fa-dollar-sign" /> REFINANCIAR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {refinanciados &&
          <div className="form-section">
            <div className="form-section-header light">
              <i className='fas fa-dollar-sign'></i>
              Refinanciamiento
            </div>

            <div className="form-section-content" style={{display: 'flex', flexDirection: 'column'}}>
              <BaseTable
                data={creditosRefinanciables}
                columns={creditosRefinanciarColumns}
                card={CreditosDefaultCard}
                centered={['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion', ]} 
                flexable='usuario' 
                loading={isFetchingCreditosRefinanciables}
                hideSearchbar
                hidePagination
                selectedRowId={selectedCredito?.id}
                onRowSelect={(row) => {
                  setSelectedCredito(row);
                  setSelectedCuotas(row.cuotas ?? []); // or map to add any extra props if needed
                }}

              />
              
              {selectedCredito &&
              <>
                <h3 style={{margin: 0, padding: 0}}>Cuotas</h3>

                {console.log(selectedCuotas[0])}

                <BaseTable
                  data={selectedCuotas}
                  columns={cuotasRefinanciablesColumns(selectedCuotas, handleCuotaChange)}
                  card={CuotasPendientesCard}
                  centered={['estado', 'calificacion', 'monto', 'montoDesembolsar', 'frecuencia', 'fechaAceptado', 'fechaSolicitud', 'fechaRechazado', 'desembolsado', 'accion', ]} 
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
                placeholder='Ingresa una cuota mensual'
              />
              <FormField
                label={'Mora'} 
                classNames={'full'}
                type={'money'}
                name='mora'
                value={formData.mora}
                onChange={handleChange}
                placeholder='Ingresa una mora'
              />
              <FormField
                label={'Cantidad de Cuotas'} 
                classNames={'full'}
                type={'number'}
                name='cuotaCantidad'
                value={formData.cuotaCantidad}
                onChange={handleChange}
                placeholder='Ingresa una cantidad de cuotas'
              />

            </div>
          </div>

        </div>
      </div>
    </BaseModal>
  )
}