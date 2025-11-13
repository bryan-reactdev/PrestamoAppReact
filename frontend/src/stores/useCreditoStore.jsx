import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import { descargarPDFConPrint } from '../utils/generalUtil';
import toast from 'react-hot-toast';
import { getCurrentDate } from '../utils/dateUtils';

const estadoInicial = {
    credito: null,
    isFetchingCredito: false,

    creditosRefinanciables: [],
    isFetchingCreditosRefinanciables: false,

    creditos: [],
    creditosPendientes: [],
    creditosAceptados: [],
    creditosRechazados: [],
    creditosFinalizados: [],
    isFetchingCreditos: false,

    filteredCreditos: {
        creditos: [],
        creditosPendientes: [],
        creditosAceptados: [],
        creditosRechazados: [],
        creditosFinalizados: [],
        totalRapicash: null,
        totalPrendarios: null,
        totalHipotecarios: null,
    },

    creditosForDate: {
        creditos: [],
        creditosPendientes: [],
        creditosAceptados: [],
        creditosRechazados: [],
        creditosFinalizados: [],
        totalRapicash: null,
        totalPrendarios: null,
        totalHipotecarios: null,
    },

    selectedDate: getCurrentDate(),

    isDesembolsandoCredito: false,
    isAceptandoCredito: false,
    isRechazandoCredito: false,

    isSubmittingCredito: false,

    isDescargandoPDF: false,

    isSettingCreditoEditable: false,
    isSettingCreditoDescargable: false,

    wasGlobalFetch: false,
    currentTipo: 'rapi-cash',
}

// --- inside your Zustand store ---
const updateCollections = (state, id, updater) => {
  const groupKeys = [
    'creditos',
    'creditosPendientes',
    'creditosAceptados',
    'creditosRechazados',
    'creditosFinalizados',
  ];

  // update top-level creditos groups
  const updated = {};
  for (const key of groupKeys) {
    updated[key] = state[key].map(updater);
  }

  // update filteredCreditos groups
  const filteredUpdated = {};
  for (const key of groupKeys) {
    filteredUpdated[key] = state.filteredCreditos[key].map(updater);
  }

  // keep totals consistent
  filteredUpdated.totalRapicash = state.getTotalesTipos(updated.creditos, 'rapi-cash');
  filteredUpdated.totalPrendarios = state.getTotalesTipos(updated.creditos, 'prendario');
  filteredUpdated.totalHipotecarios = state.getTotalesTipos(updated.creditos, 'hipotecario');

  return {
    ...state,
    ...updated,
    filteredCreditos: { ...state.filteredCreditos, ...filteredUpdated },
  };
};


// --- Definición de Store --- //
export const useCreditoStore = create((set, get) => ({
    ...estadoInicial,

    // Helper para actualizar valores de manera optimistica
    updateKey: (id, key, value) => {
        set((state) =>
            updateCollections(state, id, (credito) =>
            credito.id === id ? { ...credito, [key]: value } : credito
            )
        );
    },

    updateEstado: (id, newEstado) => {
        set((state) =>
            updateCollections(state, id, (credito) =>
            credito.id === id ? { ...credito, estado: newEstado } : credito
            )
        );
    },

    getCredito: async (creditoId) =>{
        set({credito: null})
        set({isFetchingCredito: true})

        const res = await axiosData(`/creditoTest/${creditoId}`, { method: "GET" });

        set({credito: res?.data ?? null})
        set({isFetchingCredito: false})
    },

    tryGetExistingSolicitud: async (usuarioId) => {
        const res = await axiosData(`/creditoTest/usuario/${usuarioId}/existing-solicitud`, { method: "GET" });
        return res?.data ?? null;
    },

    // --- GET ---
    getCreditos: async (usuarioId = null, isUser = false) =>{
        const isCurrentGlobal = (usuarioId == null || usuarioId == 0);
        const {wasGlobalFetch, creditos} = get();

        if (isCurrentGlobal && wasGlobalFetch === true && creditos.length !== 0) return;
        
        set({isFetchingCreditos: true});

        get().resetArrays();
        let res = null;

        if (isCurrentGlobal){
            if (isUser){
                res = await axiosData("/usuarioText/creditos", { method: "GET" });
            }
            else{
                res = await axiosData("/creditoTest/", { method: "GET" });
            }
            set({wasGlobalFetch: true})
        }
        else{
            res = await axiosData(`/usuarioTest/${usuarioId}/creditos`, { method: "GET" });
            set({wasGlobalFetch: usuarioId})
        }
        
        const creditoGroups = res?.data;
        const todos = creditoGroups?.find(group => group.estado === "Todos")?.data;
        const aceptados = creditoGroups?.find(group => group.estado === "Aceptados")?.data;
        const pendientes = creditoGroups?.find(group => group.estado === "Pendientes")?.data;
        const rechazados = creditoGroups?.find(group => group.estado === "Rechazados")?.data;
        const finalizados = creditoGroups?.find(group => group.estado === "Finalizados")?.data;

        set({ 
            creditos: todos ?? [],
            creditosPendientes: pendientes ?? [],
            creditosAceptados: aceptados ?? [],
            creditosRechazados: rechazados ?? [],
            creditosFinalizados: finalizados ?? []
        });

        set((state) => ({
            filteredCreditos: {
                ...state.filteredCreditos,
                totalRapicash: state.getTotalesTipos(state.creditos, 'rapi-cash'),
                totalPrendarios: state.getTotalesTipos(state.creditos, 'prendario'),
                totalHipotecarios: state.getTotalesTipos(state.creditos, 'hipotecario'),
            },
        }));

        // Reapply the current filter instead of always resetting to 'rapi-cash'
        const currentTipo = get().currentTipo || 'rapi-cash';
        get().filterCreditos(currentTipo);

        // Recalculate filtered arrays for selected date
        get().getCreditosForDate();

        set({ isFetchingCreditos: false });
    },

    getCreditosRefinanciables: async (currentCreditoId) => {
        set({isFetchingCreditosRefinanciables: true})

        const res = await axiosData(`/creditoTest/${currentCreditoId}/refinanciables`, {method: "GET"})

        set({creditosRefinanciables: res?.data ?? null})
        set({isFetchingCreditosRefinanciables: false})

        return (res != null);
    },

    filterCreditos: async (tipo) => {
        const {filterByTipo, creditos, creditosPendientes, creditosAceptados, creditosRechazados, creditosFinalizados} = get();

        const filteredAll = filterByTipo(creditos, tipo);
        const filteredPendientes = filterByTipo(creditosPendientes, tipo);
        const filteredAceptados = filterByTipo(creditosAceptados, tipo);
        const filteredRechazados = filterByTipo(creditosRechazados, tipo);
        const filteredFinalizados = filterByTipo(creditosFinalizados, tipo);

        set((state) => ({
            currentTipo: tipo, // Save the current filter type
            filteredCreditos:{
                ...state.filteredCreditos,
                creditos: filteredAll,
                creditosPendientes: filteredPendientes,
                creditosAceptados: filteredAceptados,
                creditosRechazados: filteredRechazados,
                creditosFinalizados: filteredFinalizados,
            }
        }))
    },

    // --- Acciones ---
    submitCredito: async (formData, isUser = false) =>{
        set({ isSubmittingCredito: true });        
        const data = new FormData();

        // Helper function to conditionally append values
        const appendIfValue = (key, value) => {
            if (value !== null && value !== undefined && value !== '') {
                data.append(key, value);
            }
        };

        // --- Info del crédito ---
        data.append('usuarioId', formData.usuarioId);
        data.append('monto', formData.monto);
        data.append('frecuenciaPago', formData.frecuenciaPago);
        data.append('finalidadCredito', formData.finalidadCredito);
        data.append('formaPago', formData.formaPago);
        data.append('propiedadANombre', formData.propiedadANombre);
        appendIfValue('direccionPropiedad', formData.direccionPropiedad);
        data.append('vehiculoANombre', formData.vehiculoANombre);

        // --- Info personal ---
        data.append('dui', formData.dui);
        data.append('nombres', formData.nombres);
        data.append('apellidos', formData.apellidos);
        data.append('email', formData.email);
        data.append('celular', formData.celular);
        data.append('direccion', formData.direccion);
        data.append('tiempoResidencia', formData.tiempoResidencia);
        data.append('estadoCivil', formData.estadoCivil);
        data.append('fechaNacimiento', formData.fechaNacimiento);
        data.append('gastosMensuales', formData.gastosMensuales);
        data.append('comoConocio', formData.comoConocio);
        data.append('conoceAlguien', formData.conoceAlguien);
        appendIfValue('nombrePersonaConocida', formData.nombrePersonaConocida);
        appendIfValue('telefonoPersonaConocida', formData.telefonoPersonaConocida);
        data.append('enlaceRedSocial', formData.enlaceRedSocial);

        // --- Info laboral ---
        data.append('ocupacion', formData.ocupacion);
        // --- Campos Empleado ---
        appendIfValue('empresaTrabajo', formData.empresaTrabajo);
        appendIfValue('direccionEmpresa', formData.direccionEmpresa);
        appendIfValue('telefonoEmpresa', formData.telefonoEmpresa);
        appendIfValue('antiguedadLaboral', formData.antiguedadLaboral);
        appendIfValue('ingresoMensualEmpleado', formData.ingresoMensualEmpleado);
        // --- Campos Emprendedor ---
        appendIfValue('actividadEmprendedor', formData.actividadEmprendedor);
        appendIfValue('ingresoMensualEmprendedor', formData.ingresoMensualEmprendedor);
        appendIfValue('otrosIngresos', formData.otrosIngresos);
        appendIfValue('telefonoNegocio', formData.telefonoNegocio);
        appendIfValue('direccionNegocio', formData.direccionNegocio);
        appendIfValue('antiguedadNegocio', formData.antiguedadNegocio);

        // --- Referencias ---
        appendIfValue('nombreReferencia1', formData.nombreReferencia1);
        appendIfValue('celularReferencia1', formData.celularReferencia1);
        appendIfValue('parentescoReferencia1', formData.parentescoReferencia1);
        appendIfValue('nombreReferencia2', formData.nombreReferencia2);
        appendIfValue('celularReferencia2', formData.celularReferencia2);
        appendIfValue('parentescoReferencia2', formData.parentescoReferencia2);

        // --- Co-deudor ---
        appendIfValue('nombreCodeudor', formData.nombreCodeudor);
        appendIfValue('duiCodeudor', formData.duiCodeudor);
        appendIfValue('direccionCodeudor', formData.direccionCodeudor);
        appendIfValue('ingresosMensualesCodeudor', formData.ingresosMensualesCodeudor);

        // --- Antecedentes ---
        data.append('solicitadoAnteriormente', formData.solicitadoAnteriormente);
        appendIfValue('solicitadoEntidad', formData.solicitadoEntidad);
        appendIfValue('frecuenciaPagoCreditoAnterior', formData.frecuenciaPagoCreditoAnterior);
        appendIfValue('solicitadoMonto', formData.solicitadoMonto);
        appendIfValue('solicitadoEstado', formData.solicitadoEstado);
        data.append('atrasosAnteriormente', formData.atrasosAnteriormente);
        data.append('reportadoAnteriormente', formData.reportadoAnteriormente);
        data.append('cobrosAnteriormente', formData.cobrosAnteriormente);
        data.append('empleo', formData.empleo);
        data.append('deudasActualmente', formData.deudasActualmente);
        appendIfValue('otrasDeudasEntidad', formData.otrasDeudasEntidad);
        appendIfValue('otrasDeudasMonto', formData.otrasDeudasMonto);

        // --- Archivos (File objects o strings de preview) ---
        if (formData.duiDelanteCodeudor instanceof File)
            data.append('duiDelanteCodeudor', formData.duiDelanteCodeudor);
        else if (formData.duiDelanteCodeudor && typeof formData.duiDelanteCodeudor === 'string')
            data.append('duiDelanteCodeudorPreview', formData.duiDelanteCodeudor);

        if (formData.duiAtrasCodeudor instanceof File)
            data.append('duiAtrasCodeudor', formData.duiAtrasCodeudor);
        else if (formData.duiAtrasCodeudor && typeof formData.duiAtrasCodeudor === 'string')
            data.append('duiAtrasCodeudorPreview', formData.duiAtrasCodeudor);

        if (formData.fotoRecibo instanceof File)
            data.append('fotoRecibo', formData.fotoRecibo);
        else if (formData.fotoRecibo && typeof formData.fotoRecibo === 'string')
            data.append('fotoReciboPreview', formData.fotoRecibo);
        
        let res = null;
        
        if(isUser){
            res = await axiosData("/usuarioText/solicitar", { method: "POST", data: data, headers: { 'Content-Type': 'multipart/form-data'}});
        }else{
            res = await axiosData("/creditoTest/crear", { method: "POST", data: data, headers: { 'Content-Type': 'multipart/form-data'}});
        }

        set({ isSubmittingCredito: false });

        get().resetArrays();
        get().getCreditos(null, isUser);
        return res
    },

    editCredito: async (creditoId, formData) =>{
        set({ isSubmittingCredito: true });        
        const data = new FormData();

        // Helper function to conditionally append values
        const appendIfValue = (key, value) => {
            if (value !== null && value !== undefined && value !== '') {
                data.append(key, value);
            }
        };

        // --- Info del crédito ---
        data.append('id', formData.id);

        data.append('monto', formData.monto);
        data.append('frecuenciaPago', formData.frecuenciaPago);
        data.append('finalidadCredito', formData.finalidadCredito);
        data.append('formaPago', formData.formaPago);
        data.append('propiedadANombre', formData.propiedadANombre);
        data.append('vehiculoANombre', formData.vehiculoANombre);
        if (formData.fechaAceptado)
            data.append('fechaAceptado', formData.fechaAceptado);

        // --- Info personal ---
        data.append('dui', formData.dui);
        data.append('nombres', formData.nombres);
        data.append('apellidos', formData.apellidos);
        data.append('email', formData.email);
        data.append('celular', formData.celular);
        data.append('direccion', formData.direccion);
        data.append('tiempoResidencia', formData.tiempoResidencia);
        data.append('estadoCivil', formData.estadoCivil);
        data.append('fechaNacimiento', formData.fechaNacimiento);
        data.append('gastosMensuales', formData.gastosMensuales);
        data.append('comoConocio', formData.comoConocio);
        data.append('conoceAlguien', formData.conoceAlguien);
        appendIfValue('nombrePersonaConocida', formData.nombrePersonaConocida);
        appendIfValue('telefonoPersonaConocida', formData.telefonoPersonaConocida);
        data.append('enlaceRedSocial', formData.enlaceRedSocial);

        // --- Info laboral ---
        data.append('ocupacion', formData.ocupacion);
        // --- Campos Empleado ---
        appendIfValue('empresaTrabajo', formData.empresaTrabajo);
        appendIfValue('direccionEmpresa', formData.direccionEmpresa);
        appendIfValue('telefonoEmpresa', formData.telefonoEmpresa);
        appendIfValue('antiguedadLaboral', formData.antiguedadLaboral);
        appendIfValue('ingresoMensualEmpleado', formData.ingresoMensualEmpleado);
        // --- Campos Emprendedor ---
        appendIfValue('actividadEmprendedor', formData.actividadEmprendedor);
        appendIfValue('ingresoMensualEmprendedor', formData.ingresoMensualEmprendedor);
        appendIfValue('otrosIngresos', formData.otrosIngresos);
        appendIfValue('telefonoNegocio', formData.telefonoNegocio);
        appendIfValue('direccionNegocio', formData.direccionNegocio);
        appendIfValue('antiguedadNegocio', formData.antiguedadNegocio);

        // --- Referencias ---
        appendIfValue('nombreReferencia1', formData.nombreReferencia1);
        appendIfValue('celularReferencia1', formData.celularReferencia1);
        appendIfValue('parentescoReferencia1', formData.parentescoReferencia1);
        appendIfValue('nombreReferencia2', formData.nombreReferencia2);
        appendIfValue('celularReferencia2', formData.celularReferencia2);
        appendIfValue('parentescoReferencia2', formData.parentescoReferencia2);

        // --- Co-deudor ---
        appendIfValue('nombreCodeudor', formData.nombreCodeudor);
        appendIfValue('duiCodeudor', formData.duiCodeudor);
        appendIfValue('direccionCodeudor', formData.direccionCodeudor);
        appendIfValue('ingresosMensualesCodeudor', formData.ingresosMensualesCodeudor);

        // --- Antecedentes ---
        data.append('solicitadoAnteriormente', formData.solicitadoAnteriormente);
        appendIfValue('solicitadoEntidad', formData.solicitadoEntidad);
        appendIfValue('frecuenciaPagoCreditoAnterior', formData.frecuenciaPagoCreditoAnterior);
        appendIfValue('solicitadoMonto', formData.solicitadoMonto);
        appendIfValue('solicitadoEstado', formData.solicitadoEstado);
        data.append('atrasosAnteriormente', formData.atrasosAnteriormente);
        data.append('reportadoAnteriormente', formData.reportadoAnteriormente);
        data.append('cobrosAnteriormente', formData.cobrosAnteriormente);
        data.append('empleo', formData.empleo);
        data.append('deudasActualmente', formData.deudasActualmente);
        appendIfValue('otrasDeudasEntidad', formData.otrasDeudasEntidad);
        appendIfValue('otrasDeudasMonto', formData.otrasDeudasMonto);

        // --- Archivos (File objects o strings de preview) ---
        if (formData.duiDelanteCodeudor instanceof File)
            data.append('duiDelanteCodeudor', formData.duiDelanteCodeudor);
        else if (formData.duiDelanteCodeudor && typeof formData.duiDelanteCodeudor === 'string')
            data.append('duiDelanteCodeudorPreview', formData.duiDelanteCodeudor);

        if (formData.duiAtrasCodeudor instanceof File)
            data.append('duiAtrasCodeudor', formData.duiAtrasCodeudor);
        else if (formData.duiAtrasCodeudor && typeof formData.duiAtrasCodeudor === 'string')
            data.append('duiAtrasCodeudorPreview', formData.duiAtrasCodeudor);

        if (formData.fotoRecibo instanceof File)
            data.append('fotoRecibo', formData.fotoRecibo);
        else if (formData.fotoRecibo && typeof formData.fotoRecibo === 'string')
            data.append('fotoReciboPreview', formData.fotoRecibo);
        
        const res = await axiosData(`/creditoTest/${creditoId}`, { method: "PUT", data: data, headers: { 'Content-Type': 'multipart/form-data'}});

        set({ isSubmittingCredito: false });

        get().resetArrays();
        get().getCreditos(null);

        if (!res) return false;
        return true;
    },

    aceptarCredito: async (id, formData) => {
        set({isAceptandoCredito: true})
        const toastId = toast.loading("Aceptando Crédito...");
        
        // Check if we need to send as FormData (if document file is present)
        const hasFile = formData.document instanceof File;
        
        let data;
        let headers = {};
        
        if (hasFile) {
            // Use FormData for file upload
            data = new FormData();
            data.append('montoAprobado', formData.montoAprobado || '');
            data.append('cuotaMensual', formData.cuotaMensual || '');
            data.append('mora', formData.mora || '');
            data.append('frecuencia', formData.frecuencia || '');
            data.append('cuotaCantidad', formData.cuotaCantidad || '');
            
            if (formData.selectedCreditoId) {
                data.append('selectedCreditoId', formData.selectedCreditoId);
            }
            
            if (formData.selectedCuotas) {
                data.append('selectedCuotas', JSON.stringify(formData.selectedCuotas));
            }
            
            // Append document file
            if (formData.document instanceof File) {
                data.append('document', formData.document);
            }
            
            headers = { 'Content-Type': 'multipart/form-data' };
        } else {
            // Use regular JSON for non-file requests
            data = formData;
        }
        
        const res = await axiosData(`/creditoTest/aceptar/${id}`, { 
            method: "POST", 
            data: data,
            headers: headers
        });

        if (get().wasGlobalFetch === true){
            get().resetArrays();
            
            get().getCreditos();
        }
        else{
            get().getCreditos(get().wasGlobalFetch)
        }

        toast.dismiss(toastId);
        set({isAceptandoCredito: false})
    },

    rechazarCredito: async (id, originalEstado) => {
        set({isRechazandoCredito: true})
        const toastId = toast.loading("Rechazando Crédito...");
        
        const res = await axiosData(`/creditoTest/rechazar/${id}`, { method: "POST"});
        // Update optimistica
        get().updateEstado(id, 'Rechazado');
        
        // En caso de error
        if (res === null) {
            get().updateEstado(id, originalEstado);
        }

        toast.dismiss(toastId);
        set({isRechazandoCredito: false})
    },

    setCreditoDesembolsado: async (id, desembolso, formData) => {
        set({isDesembolsandoCredito: true})
        get().updateKey(id, 'desembolsado', !desembolso);
        get().updateKey(id, 'fechaDesembolsado', formData.fechaDesembolso ?? null);

        const res = await axiosData(`/creditoTest/desembolsar/${id}`, {
            method: "POST",
            data: { desembolsar: !desembolso, ...formData }
        });

        // En caso de error
        if (res === null) {
            get().updateKey(id, 'desembolsado', desembolso);
        }

        set({isDesembolsandoCredito: false})
    },

    toggleCreditoEditable: async (id, editable) => {
        set({isSettingCreditoEditable: true})
        get().updateKey(id, 'editable', !editable)

        const res = await axiosData(`/creditoTest/editable/${id}`, {
            method: 'POST',
            data: { editable: !editable}
        }) 

        // Error
        if (res === null){
            get().updateKey(id, 'editable', editable)
        }

        set({isSettingCreditoEditable: false})
    },

    toggleCreditoDescargable: async (id, descargable) => {
        set({isSettingCreditoDescargable: true})
        get().updateKey(id, 'descargable', !descargable)

        const res = await axiosData(`/creditoTest/descargable/${id}`, {
            method: 'POST',
            data: { descargable: !descargable}
        }) 

        // Error
        if (res === null){
            get().updateKey(id, 'descargable', descargable)
        }

        set({isSettingCreditoDescargable: false})
    },

    toggleCreditoDesembolsable: async (id, desembolsable) => {
        get().updateKey(id, 'desembolsable', !desembolsable)

        const res = await axiosData(`/creditoTest/desembolsable/${id}`, {
            method: 'POST',
            data: { desembolsable: !desembolsable}
        }) 

        // Error
        if (res === null){
            get().updateKey(id, 'desembolsable', desembolsable)
        }
    },

    descargarCreditoPDF: async (id, tipo) => {
        try {
            set({isDescargandoPDF: true})
            toast.loading('Generando PDF...', { id: 'pdf-toast' });

            const res = await axiosData(`/creditoTest/pdf/${id}/${tipo}`, {
                method: "POST",
                responseType: "blob",
            });

            await descargarPDFConPrint(res);
            
            set({isDescargandoPDF: false})
            toast.success('PDF listo para imprimir', { id: 'pdf-toast' });
        } catch (err) {
            console.error("Error descargando PDF:", err);
            toast.error('Error al generar el PDF del crédito', { id: 'pdf-toast' });
        }
    },

    descargarDocumentoCredito: async (documentoPath, nombres, apellidos, creditoId) => {
        try {
            toast.loading('Descargando documento...', { id: 'documento-toast' });

            const res = await axiosData(documentoPath, {
                method: "GET",
                responseType: "blob",
            });

            // Get file extension from original document path
            const pathParts = documentoPath.split('/');
            const originalFilename = pathParts[pathParts.length - 1] || '';
            const extension = originalFilename.includes('.') 
                ? '.' + originalFilename.split('.').pop() 
                : '';
            
            // Get user names and sanitize them (remove special characters, normalize spaces)
            const nombresSanitized = (nombres || '').trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
            const apellidosSanitized = (apellidos || '').trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
            
            // Construct filename: documento_de_[nombre]_[apellido].[extension]
            const filename = `documento_de_${nombresSanitized}_${apellidosSanitized}${extension}`.toLowerCase();
            
            // Create download link
            const url = window.URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.dismiss('documento-toast');
            toast.success('Documento descargado', { id: 'documento-toast' });
        } catch (err) {
            console.error("Error descargando documento:", err);
            toast.error('Error al descargar el documento', { id: 'documento-toast' });
        }
    },

    resetArrays: () => {
        set({
            creditos: [],
            creditosPendientes: [],
            creditosAceptados: [],
            creditosRechazados: [],
            creditosFinalizados: [],

            filteredCreditos: {
                creditos: [],
                creditosPendientes: [],
                creditosAceptados: [],
                creditosRechazados: [],
                creditosFinalizados: [],
                totalRapicash: null,
                totalPrendarios: null,
                totalHipotecarios: null,
            },

            creditosForDate: {
                creditos: [],
                creditosPendientes: [],
                creditosAceptados: [],
                creditosRechazados: [],
                creditosFinalizados: [],
                totalRapicash: null,
                totalPrendarios: null,
                totalHipotecarios: null,
            },
        })
    },

    filterByTipo: (objects, tipo) => {
        if (!Array.isArray(objects)) return;

        const filteredObjects = objects.filter((object) => {
            if (object.tipo == tipo){
                return object;
            }
        })

        return filteredObjects;
    },
    getTotalesTipos: (objects, tipo) => {
        if (!Array.isArray(objects)) return;

        return objects.reduce((sum, object) => {
            if (object.tipo == tipo){
                return sum + 1;
            }

            return sum;
        }, 0)
    },

    setSelectedDate: (date) => {
        set({ selectedDate: date });
        get().getCreditosForDate();
    },

    // --- Totales Calculations ---
    getCreditosForDate: () => {
        const { filtrarPorFecha, selectedDate, creditos, creditosPendientes, creditosAceptados, creditosRechazados, creditosFinalizados } = get();

        const creditosForDate = filtrarPorFecha(creditos, selectedDate);
        const creditosPendientesForDate = filtrarPorFecha(creditosPendientes, selectedDate);
        const creditosAceptadosForDate = filtrarPorFecha(creditosAceptados, selectedDate);
        const creditosRechazadosForDate = filtrarPorFecha(creditosRechazados, selectedDate);
        const creditosFinalizadosForDate = filtrarPorFecha(creditosFinalizados, selectedDate);

        set((state) => ({
            creditosForDate: {
                creditos: creditosForDate || [],
                creditosPendientes: creditosPendientesForDate || [],
                creditosAceptados: creditosAceptadosForDate || [],
                creditosRechazados: creditosRechazadosForDate || [],
                creditosFinalizados: creditosFinalizadosForDate || [],
                totalRapicash: state.getTotalesTipos(creditosForDate || [], 'rapi-cash'),
                totalPrendarios: state.getTotalesTipos(creditosForDate || [], 'prendario'),
                totalHipotecarios: state.getTotalesTipos(creditosForDate || [], 'hipotecario'),
            },
        }))
    },

    filtrarPorFecha: (objects, selectedDate) => {
        if (!Array.isArray(objects)) return [];

        const filteredObjects = objects.filter((object) => {
            if (object?.fecha) {
                return object.fecha.startsWith(selectedDate)
            }
            else if (object?.fechaCreacion) {
                return object.fechaCreacion.startsWith(selectedDate)
            }
            else if (object?.fechaAceptado) {
                return object.fechaAceptado.startsWith(selectedDate)
            }
            else if (object?.fechaRechazado) {
                return object.fechaRechazado.startsWith(selectedDate)
            }
            else if (object?.fechaDesembolsado) {
                return object.fechaDesembolsado.startsWith(selectedDate);
            }

            return false;
        })

        return filteredObjects;
    },
}))