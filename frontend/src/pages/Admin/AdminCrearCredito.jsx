import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'

import { useEffect, useState } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { useNavigate, useParams } from 'react-router-dom'
import FormField from '../../components/Form/FormField'
import FormSelect from '../../components/Form/FormSelect'
import { useCreditoStore } from '../../stores/useCreditoStore'

export default function AdminCrearCredito(){
  const {id} = useParams();
  const navigate = useNavigate();
  const {submitCredito, isSubmittingCredito} = useCreditoStore();
  const [formData, setFormData] = useState({
    usuarioId: 0,

    // --- Sección 1 ---
    monto: '',
    frecuenciaPago: '',
    finalidadCredito: '',
    formaPago: '',
    propiedadANombre: '',
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
    enlaceRedSocial: '',

    // --- Info laboral ---
    ocupacion: '',

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
    atrasosAnteriormente: '',
    reportadoAnteriormente: '',
    cobrosAnteriormente: '',
    empleo: '',
    deudasActualmente: '',
  });

  const {usuario, isFetchingUsuario, getUsuario} = useUsuarioStore();

  // --- Cosas a correr al inicializar la página '''
  // --- Get de el usuario ---
  useEffect(() => {
    getUsuario(id);
  }, [id]);

  // --- Asignar los valores default ---
  useEffect(() => {
    if (usuario !== null){
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
  }, [usuario])

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

    // find which fields are empty
    // const emptyFields = Object.entries(formData)
    //   .filter(([key, value]) => value === '' || value === null || value === undefined)
    //   .map(([key]) => key);

    // if (emptyFields.length > 0) {
    //   toast.error(`Por favor, completa los siguientes campos: \n- ${emptyFields.join('\n- ')}`);
    //   return;
    // }
    
    const res = await submitCredito(formData);
    if (res) navigate('/admin/creditos?tab=Pendientes');
  };

  // --- Estado de Carga ---
  if (isFetchingUsuario || !usuario){
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
          subtitle={`Creación de crédito para: ${usuario.nombres + ' ' + usuario.apellidos}`}
        />

        {/* Sección 1 */}
        <div className="form-container">
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
              />

              <FormSelect 
                label={'Frecuencia de Pagos'}
                name='frecuenciaPago'
                value={formData.frecuenciaPago}
                onChange={handleChange}
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
              >
                <option value="efectivo">Efectivo</option>
                <option value="deposito">Depósito</option>
                <option value="bitcoin">Bitcoin</option>
              </FormSelect>

              <FormSelect 
                classNames={'half'}
                label={'¿Tiene propiedad a su nombre?'}
                name='propiedadANombre'
                value={formData.propiedadANombre}
                onChange={handleChange}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              <FormSelect 
                classNames={'half'}
                label={'¿Tiene vehículo a su nombre?'}
                name='vehiculoANombre'
                value={formData.vehiculoANombre}
                onChange={handleChange}
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
              />

              <FormField 
                classNames={'half primary'}
                label={'Nombres'}
                name='nombres'
                value={formData.nombres || ''}
                onChange={handleChange}
                placeholder='ej. Juan Edgardo'
              />

              <FormField 
                classNames={'half primary'}
                label={'Apellidos'}
                name='apellidos'
                value={formData.apellidos || ''}
                onChange={handleChange}
                placeholder='ej. Martínez Salazar'
              />

              <FormField 
                classNames={'half'}
                label={'Email'}
                name='email'
                value={formData.email || ''}
                onChange={handleChange}
                type='email'
                placeholder='ej. juanedgardo123@gmail.com'
              />

              <FormField 
                classNames={'half'}
                label={'Número de Celular (WhatsApp)'}
                name='celular'
                value={formData.celular || ''}
                onChange={handleChange}
                placeholder='ej. 7070 6060'
              />

              <FormField 
                classNames={'primary'}
                label={'Dirección Completa'}
                name='direccion'
                value={formData.direccion || ''}
                onChange={handleChange}
                placeholder='Ingresa tu dirección completa...'
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
              >
                <option value="soltero">Soltero</option>
                <option value="casado">Casado</option>
              </FormSelect>

              <FormField 
                classNames={'half'}
                label={'Fecha de Nacimiento'}
                name='fechaNacimiento'
                value={formData.fechaNacimiento || ''}
                onChange={handleChange}
                type='date'
              />

              <FormField 
                classNames={'full success'}
                label={'Gastos Mensuales (Vivienda, Alimentación, Transporte, etc.)'}
                name='gastosMensuales'
                value={formData.gastosMensuales || ''}
                onChange={handleChange}
                type='money'
                placeholder='0.00'
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
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </FormSelect>

              <FormField 
                classNames={'full'}
                label={'Coloque un enlace a su Facebook u otra red social que utilice'}
                name='enlaceRedSocial'
                value={formData.enlaceRedSocial || ''}
                onChange={handleChange}
                placeholder='Ingresa un enlace...'
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
              >
                <option value="Empleado">Empleado</option>
                <option value="Emprendedor">Emprendedor</option>
              </FormSelect>
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
            </div>

          </div>

          <div className="form-button-container">
            {isSubmittingCredito
              ? <div className="spinner"></div>
              : <button className='btn-submit' onClick={handleSubmit}>ENVIAR SOLICITUD<i className='fas fa-paper-plane'/></button>            
            }
          </div>
        </div>

      </div>
    </div>
  )
}