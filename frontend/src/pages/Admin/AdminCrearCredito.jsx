import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'

import { useEffect, useState } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { useNavigate, useParams } from 'react-router-dom'
import FormField from '../../components/Form/FormField'
import FormSelect from '../../components/Form/FormSelect'
import { useCreditoStore } from '../../stores/useCreditoStore'
import toast from 'react-hot-toast'

export default function AdminCrearCredito(){
  const {id} = useParams();
  const navigate = useNavigate();
  const {submitCredito, isSubmittingCredito, tryGetExistingSolicitud} = useCreditoStore();
  const [formData, setFormData] = useState({
    usuarioId: 0,

    // --- Sección 1 ---
    monto: '',
    frecuenciaPago: '',
    finalidadCredito: '',
    formaPago: '',
    propiedadANombre: '',
    direccionPropiedad: '',
    vehiculoANombre: '',

    // --- Info personal ---
    dui: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    direccion: '',
    tiempoResidencia: '',
    estadoCivil: '',
    fechaNacimiento: '',
    gastosMensuales: '',
    comoConocio: '',
    conoceAlguien: '',
    nombrePersonaConocida: '',
    telefonoPersonaConocida: '',
    enlaceRedSocial: '',

    // --- Info laboral ---
    ocupacion: '',
    // --- Campos Empleado ---
    empresaTrabajo: '',
    direccionEmpresa: '',
    telefonoEmpresa: '',
    antiguedadLaboral: '',
    ingresoMensualEmpleado: '',
    // --- Campos Emprendedor ---
    actividadEmprendedor: '',
    ingresoMensualEmprendedor: '',
    otrosIngresos: '',
    telefonoNegocio: '',
    direccionNegocio: '',
    antiguedadNegocio: '',

    // --- Referencias ---
    nombreReferencia1: '',
    celularReferencia1: '',
    parentescoReferencia1: '',
    nombreReferencia2: '',
    celularReferencia2: '',
    parentescoReferencia2: '',

    // --- Co-deudor ---
    nombreCodeudor: '',
    duiCodeudor: '',
    direccionCodeudor: '',
    ingresosMensualesCodeudor: '',
    duiDelanteCodeudor: '',
    duiAtrasCodeudor: '',
    fotoRecibo: '',

    // --- Antecedentes ---
    solicitadoAnteriormente: '',
    solicitadoEntidad: '',
    frecuenciaPagoCreditoAnterior: '',
    solicitadoMonto: '',
    solicitadoEstado: '',
    atrasosAnteriormente: '',
    reportadoAnteriormente: '',
    cobrosAnteriormente: '',
    empleo: '',
    deudasActualmente: '',
    otrasDeudasEntidad: '',
    otrasDeudasMonto: '',
  });

  const {usuario, isFetchingUsuario, getUsuario} = useUsuarioStore();
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- Cosas a correr al inicializar la página '''
  // --- Try to get existing solicitud first, otherwise get user data ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      // First try to get existing solicitud
      const existingSolicitud = await tryGetExistingSolicitud(id);
      
      if (existingSolicitud) {
        // Auto-fill form with existing solicitud data
        setFormData((prev) => ({
          ...prev,
          ...existingSolicitud,
          usuarioId: existingSolicitud.usuarioId || id,
          // Handle file previews - if they exist, use the preview path as the form value
          duiDelanteCodeudor: existingSolicitud.duiDelanteCodeudorPreview || '',
          duiAtrasCodeudor: existingSolicitud.duiAtrasCodeudorPreview || '',
          fotoRecibo: existingSolicitud.fotoReciboPreview || '',
          monto: '',
          frecuenciaPago: '',
          finalidadCredito: '',
          formaPago: '',
        }));
      } else {
        getUsuario(id);
      }
      
      setIsLoadingData(false);
    };

    loadData();
  }, [id, tryGetExistingSolicitud, getUsuario]);

  // --- Asignar los valores default del usuario (fallback) ---
  useEffect(() => {
    if (usuario !== null && !isLoadingData){
      setFormData((prev) => ({
        ...prev,
        usuarioId: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        dui: usuario.dui,
        direccion: usuario.direccion,
        email: usuario.email,
        celular: usuario.celular,
      }));
    }
  }, [usuario, isLoadingData])

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'file'
          ? files[0]                           // handle file uploads
          : value === 'true'
          ? true
          : value === 'false'
          ? false
          : value,                             // normal text/select input
    }));
  };

  // --- Handler para el submit ---
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // HTML5 validation will automatically show required// No need for custom validation - the browser handles it!
    
    const res = await submitCredito(formData);
    if (res) navigate('/admin/creditos?tab=Pendientes');
  };

  // --- Estado de Carga ---
  if (isLoadingData || (isFetchingUsuario && !usuario)){
    return(
      <div className="page">
        <Navbar/>
        <Sidebar activePage={'usuarios'}/>

        <div className="content">
          <ContentTitle 
            title={`Cargando...`}
            subtitle={`Cargando información del usuario...`}
          />
        </div>
        
      </div>
    )
  }

  return(
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'usuarios'}/>

      <div className="content">
        <ContentTitle 
          title={`Crear Crédito`}
          subtitle={`Creación de crédito para: ${formData.nombres + ' ' + formData.apellidos}`}
        />

        {/* Sección 1 */}
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-header">
              <i className='fas fa-file-invoice'></i>
              Resumen del Credito
            </div>
            
            <div className="form-section-content">
              <FormField
                classNames={'primary success'} 
                name='monto'
                value={formData.monto || ''}
                onChange={handleChange}
                label={'Monto del Crédito'} 
                type={'money'} 
                placeholder={'0.00'}
                required
                min={1}
              />

              <FormSelect 
                label={'Frecuencia de Pagos'}
                name='frecuenciaPago'
                value={formData.frecuenciaPago}
                onChange={handleChange}
                required
              >
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </FormSelect>

              <FormSelect 
                label={'Finalidad del Crédito'}
                name='finalidadCredito'
                value={formData.finalidadCredito}
                onChange={handleChange}
                required
              >
                <option value="Consumo personal">Consumo personal</option>
                <option value="Negocio">Negocio</option>
                <option value="Compra de bienes">Compra de bienes</option>
                <option value="Pago de deudas">Pago de deudas</option>
                <option value="Emergencia">Emergencia</option>
                <option value="Medicina">Medicina</option>
                <option value="Alimentacion">Alimentacion</option>
                <option value="Pago de alquiler">Pago de alquiler</option>
                <option value="Viaje o vacanciones">Viaje o vacaciones</option>
              </FormSelect>

              <FormSelect 
                label={'Forma de Pago'}
                name='formaPago'
                value={formData.formaPago}
                onChange={handleChange}
                required
              >
                <option value="efectivo">Efectivo</option>
                <option value="deposito">Depósito</option>
                <option value="bitcoin">Bitcoin</option>
              </FormSelect>

              <FormSelect 
                label={'¿Tiene propiedad a su nombre?'}
                name='propiedadANombre'
                value={formData.propiedadANombre}
                onChange={handleChange}
                required
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              {formData.propiedadANombre === true && (
                <FormField
                  name='direccionPropiedad'
                  value={formData.direccionPropiedad || ''}
                  onChange={handleChange}
                  label={'Dirección de la Propiedad'} 
                  placeholder={'Ingresa la dirección completa de la propiedad...'}
                  required
                  minLength={10}
                />
              )}

              <FormSelect 
                label={'¿Tiene vehículo a su nombre?'}
                name='vehiculoANombre'
                value={formData.vehiculoANombre}
                onChange={handleChange}
                required
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <i className='fas fa-user'></i>
              Informacion Personal
            </div>

            <div className="form-section-content">
              <FormField 
                classNames={'primary'}
                label={'DUI'}
                name='dui'
                value={formData.dui || ''}
                onChange={handleChange}
                placeholder='ej. 12345678-9'
                required
                pattern='[0-9]{8}-[0-9]'
                title='Formato: 12345678-9'
              />

              <FormField 
                classNames={'half primary'}
                label={'Nombres'}
                name='nombres'
                value={formData.nombres || ''}
                onChange={handleChange}
                placeholder='ej. Juan Edgardo'
                required
                minLength={2}
              />

              <FormField 
                classNames={'half primary'}
                label={'Apellidos'}
                name='apellidos'
                value={formData.apellidos || ''}
                onChange={handleChange}
                placeholder='ej. Martínez Salazar'
                required
                minLength={2}
              />

              <FormField 
                classNames={'half'}
                label={'Email'}
                name='email'
                value={formData.email || ''}
                onChange={handleChange}
                type='email'
                placeholder='ej. juanedgardo123@gmail.com'
                required
              />

              <FormField 
                classNames={'half'}
                label={'Número de Celular (WhatsApp)'}
                name='celular'
                value={formData.celular || ''}
                onChange={handleChange}
                placeholder='ej. 7070 6060'
                required
              />

              <FormField 
                classNames={'primary'}
                label={'Dirección Completa'}
                name='direccion'
                value={formData.direccion || ''}
                onChange={handleChange}
                placeholder='Ingresa tu dirección completa...'
                required
                minLength={10}
              />

              <FormField 
                classNames={'full'}
                label={'Tiempo de residencia en la dirección actual'}
                name='tiempoResidencia'
                value={formData.tiempoResidencia || ''}
                onChange={handleChange}
                placeholder='ej. 6 meses, 3 años'
              />

              <FormSelect 
                classNames={'half'}
                label={'Estado Civil'}
                name='estadoCivil'
                value={formData.estadoCivil}
                onChange={handleChange}
                required
              >
                <option value="soltero">Soltero/a</option>
                <option value="casado">Casado/a</option>
                <option value="divorciado">Divorciado/a</option>
                <option value="viudo">Viudo/a</option>
                <option value="union_libre">Unión libre</option>
              </FormSelect>

              <FormField 
                classNames={'half'}
                label={'Fecha de Nacimiento'}
                name='fechaNacimiento'
                value={formData.fechaNacimiento || ''}
                onChange={handleChange}
                type='date'
                required
              />

              <FormField 
                classNames={'full success'}
                label={'Gastos Mensuales (Vivienda, Alimentación, Transporte, etc.)'}
                name='gastosMensuales'
                value={formData.gastosMensuales || ''}
                onChange={handleChange}
                type='money'
                placeholder='0.00'
                required
                min={1}
              />

              <FormField 
                classNames={'full'}
                label={'¿Cómo conoció Multipréstamos ATLAS?'}
                name='comoConocio'
                value={formData.comoConocio || ''}
                onChange={handleChange}
                placeholder='ej. Facebook, Amigo, Publicidad'
              />

              <FormSelect 
                classNames={'full'}
                label={'¿Conoce a alguien con crédito(s) en Multipréstamos ATLAS?'}
                name='conoceAlguien'
                value={formData.conoceAlguien}
                onChange={handleChange}
                required
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              {formData.conoceAlguien === true && (
                <>
                  <FormField
                    classNames={'half'}
                    name='nombrePersonaConocida'
                    value={formData.nombrePersonaConocida || ''}
                    onChange={handleChange}
                    label={'Nombre de la Persona Conocida'} 
                    placeholder={'Nombre completo'}
                  />

                  <FormField
                    classNames={'half'}
                    name='telefonoPersonaConocida'
                    value={formData.telefonoPersonaConocida || ''}
                    onChange={handleChange}
                    label={'Teléfono de la Persona Conocida'} 
                    placeholder={'Teléfono'}
                  />
                </>
              )}

              <FormField 
                classNames={'full'}
                label={'Coloque un enlace a su Facebook u otra red social que utilice'}
                name='enlaceRedSocial'
                value={formData.enlaceRedSocial || ''}
                onChange={handleChange}
                placeholder='Coloca el link a tu perfil'
                required
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <i className='fas fa-briefcase'/>
              Información Laboral
            </div>

            <div className="form-section-content">
              <FormSelect 
                classNames={'full'}
                label={'Ocupación/Negocio'}
                name='ocupacion'
                value={formData.ocupacion}
                onChange={handleChange}
                required
              >
                <option value="Empleado">Empleado</option>
                <option value="Emprendedor">Emprendedor</option>
              </FormSelect>

              {/* Campos Empleado */}
              {formData.ocupacion === 'Empleado' && (
                <>
                  <FormField
                    classNames={'half'}
                    name='empresaTrabajo'
                    value={formData.empresaTrabajo || ''}
                    onChange={handleChange}
                    label={'Empresa de Trabajo'} 
                    placeholder={'Nombre de la empresa'}
                  />

                  <FormField
                    classNames={'half'}
                    name='direccionEmpresa'
                    value={formData.direccionEmpresa || ''}
                    onChange={handleChange}
                    label={'Dirección de la Empresa'} 
                    placeholder={'Dirección de la empresa'}
                  />

                  <FormField
                    classNames={'half'}
                    name='telefonoEmpresa'
                    value={formData.telefonoEmpresa || ''}
                    onChange={handleChange}
                    label={'Número de Contacto de la Empresa'} 
                    placeholder={'Teléfono'}
                  />

                  <FormField
                    classNames={'half'}
                    name='antiguedadLaboral'
                    value={formData.antiguedadLaboral || ''}
                    onChange={handleChange}
                    label={'Antigüedad Laboral'} 
                    placeholder={'Ej: 3 años'}
                  />

                  <FormField
                    classNames={'full success'}
                    name='ingresoMensualEmpleado'
                    value={formData.ingresoMensualEmpleado || ''}
                    onChange={handleChange}
                    label={'Ingreso Mensual Aproximado'} 
                    type={'money'}
                    placeholder={'0.00'}
                  />
                </>
              )}

              {/* Campos Emprendedor */}
              {formData.ocupacion === 'Emprendedor' && (
                <>
                  <FormField
                    classNames={'half'}
                    name='actividadEmprendedor'
                    value={formData.actividadEmprendedor || ''}
                    onChange={handleChange}
                    label={'A qué se dedica'} 
                    placeholder={'Ej: venta de ropa, accesorios, tortas'}
                  />

                  <FormField
                    classNames={'half success'}
                    name='ingresoMensualEmprendedor'
                    value={formData.ingresoMensualEmprendedor || ''}
                    onChange={handleChange}
                    label={'Ingreso Mensual Aproximado'} 
                    type={'money'}
                    placeholder={'0.00'}
                  />

                  <FormField
                    classNames={'full'}
                    name='otrosIngresos'
                    value={formData.otrosIngresos || ''}
                    onChange={handleChange}
                    label={'Otros Ingresos (detalle y monto)'} 
                    placeholder={'Detalle y monto'}
                  />

                  <FormField
                    classNames={'half'}
                    name='telefonoNegocio'
                    value={formData.telefonoNegocio || ''}
                    onChange={handleChange}
                    label={'Número de Contacto del Negocio'} 
                    placeholder={'Teléfono del negocio'}
                  />

                  <FormField
                    classNames={'half'}
                    name='direccionNegocio'
                    value={formData.direccionNegocio || ''}
                    onChange={handleChange}
                    label={'Dirección del Negocio'} 
                    placeholder={'Dirección del negocio'}
                  />

                  <FormField
                    classNames={'full'}
                    name='antiguedadNegocio'
                    value={formData.antiguedadNegocio || ''}
                    onChange={handleChange}
                    label={'Antigüedad del Negocio'} 
                    placeholder={'Ej: 2 años'}
                  />
                </>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <i className='fas fa-users'/>
               Referencias Personales 
            </div>

            <div className="form-section-content">
              <FormField 
                label={'Nombre Referencia 1'}
                name='nombreReferencia1'
                value={formData.nombreReferencia1 || ''}
                onChange={handleChange}
                placeholder='Nombre Completo'
              />

              <FormField 
                label={'Celular (WhatsApp) Referencia 1'}
                name='celularReferencia1'
                value={formData.celularReferencia1 || ''}
                onChange={handleChange}
                placeholder='Ej. 7070 6060'
              />

              <FormField 
                label={'Parentesco Referencia 1'}
                name='parentescoReferencia1'
                value={formData.parentescoReferencia1 || ''}
                onChange={handleChange}
                placeholder='Ej. Familiar, Amigo'
              />

              <FormField 
                label={'Nombre Referencia 2'}
                name='nombreReferencia2'
                value={formData.nombreReferencia2 || ''}
                onChange={handleChange}
                placeholder='Nombre Completo'
              />

              <FormField 
                label={'Celular (WhatsApp) Referencia 2'}
                name='celularReferencia2'
                value={formData.celularReferencia2 || ''}
                onChange={handleChange}
                placeholder='Ej. 7070 6060'
              />

              <FormField 
                label={'Parentesco Referencia 2'}
                name='parentescoReferencia2'
                value={formData.parentescoReferencia2 || ''}
                onChange={handleChange}
                placeholder='Ej. Familiar, Amigo'
              />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <i className='fas fa-file-invoice'></i>
              Información de Co-Deudor
            </div>
            
            <div className="form-section-content">
              <FormField
                classNames={'half primary'}
                label={'Nombre de Co-Deudor'}
                name='nombreCodeudor'
                value={formData.nombreCodeudor}
                onChange={handleChange}
                placeholder='Nombre Completo'
              />

              <FormField
                classNames={'half primary'}
                label={'DUI de Co-Deudor'}
                name='duiCodeudor'
                value={formData.duiCodeudor}
                onChange={handleChange}
                placeholder='Ej. 98765432-1'
              />

              <FormField
                classNames={'primary'}
                label={'Dirección de Co-Deudor'}
                name='direccionCodeudor'
                value={formData.direccionCodeudor}
                onChange={handleChange}
                placeholder='Ingresa la dirección completa'
              />

              <FormField
                classNames={'primary success'}
                label={'Ingresos Mensuales de Co-Deudor (Aproximación)'}
                name='ingresosMensualesCodeudor'
                value={formData.ingresosMensualesCodeudor}
                onChange={handleChange}
                type='money'
                placeholder='0.00'
              />

              <FormField
                classNames={'primary'}
                label={'Foto del frente del DUI de Co-Deudor'}
                name='duiDelanteCodeudor'
                preview={formData.duiDelanteCodeudor}
                value={formData.duiDelanteCodeudor}
                onChange={handleChange}
                type='file'
              />

              <FormField
                classNames={'primary'}
                label={'Foto de atrás del DUI de Co-Deudor'}
                name='duiAtrasCodeudor'
                preview={formData.duiAtrasCodeudor}
                value={formData.duiAtrasCodeudor}
                onChange={handleChange}
                type='file'
              />

              <FormField
                classNames={'primary'}
                label={'Foto de un recibo de Agua o Luz'}
                name='fotoRecibo'
                preview={formData.fotoRecibo}
                value={formData.fotoRecibo}
                onChange={handleChange}
                type='file'
              />
            </div>

          </div>

          {/* Sección 3 */}
          <div className="form-section">
            <div className="form-section-header">
              <i className='fas fa-file-invoice'></i>
              Antecedentes de Pago 
            </div>
            
            <div className="form-section-content">
              <FormSelect 
                classNames={'full'}
                label={'¿Has solicitado créditos en los últimos 2 años?'}
                name='solicitadoAnteriormente'
                value={formData.solicitadoAnteriormente}
                onChange={handleChange}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              {formData.solicitadoAnteriormente === true && (
                <>
                  <FormField
                    classNames={'full'}
                    name='solicitadoEntidad'
                    value={formData.solicitadoEntidad || ''}
                    onChange={handleChange}
                    label={'Entidad Financiera Anterior'} 
                    placeholder={'Nombre de la entidad financiera'}
                  />

                  <FormField
                    classNames={'full'}
                    name='frecuenciaPagoCreditoAnterior'
                    value={formData.frecuenciaPagoCreditoAnterior || ''}
                    onChange={handleChange}
                    label={'Frecuencia de Pago en Crédito Anterior'} 
                    placeholder={'ejemplo: diario, semanal, quincenal, mensual'}
                  />

                  <FormField
                    classNames={'full success'}
                    name='solicitadoMonto'
                    value={formData.solicitadoMonto || ''}
                    onChange={handleChange}
                    label={'Monto de Crédito Anterior'} 
                    type={'money'}
                    placeholder={'0.00'}
                  />

                  <FormSelect 
                    classNames={'full'}
                    label={'Estado del Crédito Anterior'}
                    name='solicitadoEstado'
                    value={formData.solicitadoEstado}
                    onChange={handleChange}
                  >
                    <option value="pagado">Pagado</option>
                    <option value="en_curso">En curso</option>
                    <option value="incumplido">Incumplido</option>
                  </FormSelect>
                </>
              )}

              <FormSelect 
                classNames={'full'}
                label={'¿Has tenido atrasos en pagos de créditos, tarjetas u obligaciones financieras en los últimos 24 meses?'}
                name='atrasosAnteriormente'
                value={formData.atrasosAnteriormente}
                onChange={handleChange}
              >
                <option value="nunca">Nunca</option>
                <option value="uno_a_dos">1 a 2 veces</option>
                <option value="dos_o_mas">Más de 2 veces</option>
              </FormSelect>

              <FormSelect 
                classNames={'full'}
                label={'¿Alguna entidad financiera te ha reportado como moroso en los últimos 2 años?'}
                name='reportadoAnteriormente'
                value={formData.reportadoAnteriormente}
                onChange={handleChange}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              <FormSelect 
                classNames={'full'}
                label={'¿Has sido objeto de cobros judiciales o procesos legales por deudas en este periodo?'}
                name='cobrosAnteriormente'
                value={formData.cobrosAnteriormente}
                onChange={handleChange}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              <FormSelect 
                classNames={'full'}
                label={'¿Actualmente cuentas con un empleo fijo o negocio propio?'}
                name='empleo'
                value={formData.empleo}
                onChange={handleChange}
              >
                <option value="empleo_fijo">Empleo fijo</option>
                <option value="negocio_propio">Negocio propio</option>
                <option value="ninguno">Ninguno</option>
              </FormSelect>            

              <FormSelect 
                classNames={'full'}
                label={'¿Tienes otras deudas activas actualmente?'}
                name='deudasActualmente'
                value={formData.deudasActualmente}
                onChange={handleChange}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              {formData.deudasActualmente === true && (
                <>
                  <FormField
                    classNames={'full'}
                    name='otrasDeudasEntidad'
                    value={formData.otrasDeudasEntidad || ''}
                    onChange={handleChange}
                    label={'Entidad de estas Deudas'} 
                    placeholder={'Nombre de la entidad'}
                  />

                  <FormField
                    classNames={'full success'}
                    name='otrasDeudasMonto'
                    value={formData.otrasDeudasMonto || ''}
                    onChange={handleChange}
                    label={'Monto Mensual de estas Deudas'} 
                    type={'money'}
                    placeholder={'0.00'}
                  />
                </>
              )}
            </div>

          </div>

          <div className="form-button-container">
            {isSubmittingCredito
              ? <div className="spinner"></div>
              : <button type="submit" className='btn-submit'>ENVIAR SOLICITUD<i className='fas fa-paper-plane'/></button>            
            }
          </div>
        </form>

      </div>
    </div>
  )
}