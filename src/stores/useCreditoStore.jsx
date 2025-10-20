import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import { descargarPDFConPrint } from '../utils/generalUtil';
import toast from 'react-hot-toast';

const estadoInicial = {
    creditos: [],
    creditosPendientes: [],
    creditosAceptados: [],
    creditosRechazados: [],
    creditosFinalizados: [],
    isFetchingCreditos: false,

    isDesembolsandoCredito: false,
    isAceptandoCredito: false,
    isRechazandoCredito: false,

    isSubmittingCredito: false,

    isDescargandoPDF: false,

    isSettingCreditoEditable: false,
    isSettingCreditoDescargable: false,

    wasGlobalFetch: false,
}

// --- Definición de Store --- //
export const useCreditoStore = create((set, get) => ({
    ...estadoInicial,

    // Helper para actualizar valores de manera optimistica
    updateKey: (id, key, value) => {
        set((state) => ({
            creditos: state.creditos.map((credito) =>
                credito.id === id ? { ...credito, [key]: value } : credito
            ),
            creditosPendientes: state.creditosPendientes.map((credito) =>
                credito.id === id ? { ...credito, [key]: value } : credito
            ),
            creditosAceptados: state.creditosAceptados.map((credito) =>
                credito.id === id ? { ...credito, [key]: value } : credito
            ),
            creditosRechazados: state.creditosRechazados.map((credito) =>
                credito.id === id ? { ...credito, [key]: value } : credito
            ),
            creditosFinalizados: state.creditosFinalizados.map((credito) =>
                credito.id === id ? { ...credito, [key]: value } : credito
            ),
        }));
    },

    // Helper para actualizar el estado de manera optimistica
    updateEstado: (id, newEstado) => {
        set((state) => ({
            creditos: state.creditos.map((credito) =>
                credito.id === id ? { ...credito, estado: newEstado } : credito
            ),
            creditosPendientes: state.creditosPendientes.map((credito) =>
                credito.id === id ? { ...credito, estado: newEstado } : credito
            ),
            creditosAceptados: state.creditosAceptados.map((credito) =>
                credito.id === id ? { ...credito, estado: newEstado } : credito
            ),
        }));
    },

    // --- GET ---
    getCreditos: async (usuarioId = null) =>{
        const isCurrentGlobal = (usuarioId == null || usuarioId == 0);
        const {wasGlobalFetch, creditos} = get();

        if (isCurrentGlobal && wasGlobalFetch && creditos.length !== 0) return;
        
        set({isFetchingCreditos: true});

        set({
            creditos: [],
            creditosPendientes: [],
            creditosAceptados: [],
            creditosRechazados: [],
            creditosFinalizados: [],
        })
        let res = null;

        if (isCurrentGlobal){
            res = await axiosData("/creditoTest/", { method: "GET" });
            set({wasGlobalFetch: true})
        }
        else{
            res = await axiosData(`/usuarioTest/${usuarioId}/creditos`, { method: "GET" });
            set({wasGlobalFetch: false})
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

        set({ isFetchingCreditos: false });
    },

    // --- Acciones ---

    submitCredito: async (formData) =>{
        set({ isSubmittingCredito: true });

        const res = await axiosData("/creditoTest/crear", { method: "POST", data: formData});

        set({ isSubmittingCredito: false });

        get().getCreditos();
        return res
    },

    aceptarCredito: async (id, formData) => {
        set({isAceptandoCredito: true})
        const toastId = toast.loading("Aceptando Crédito...");
        
        const res = await axiosData(`/creditoTest/aceptar/${id}`, { method: "POST", data: formData});
        // Update optimistica
        get().updateEstado(id, 'Aceptado');
        
        // En caso de error
        if (res === null) {
            get().updateEstado(id, 'Pendiente');
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
}))