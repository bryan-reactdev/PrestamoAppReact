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

    isSubmittingCredito: false,

    isDescargandoPDF: false,

    isSettingCreditoEditable: false,
    isSettingCreditoDescargable: false,
}

// --- Definición de Store --- //
export const useCreditoStore = create((set, get) => ({
    ...estadoInicial,

    // Helper para actualizar el desembolso de manera optimistica
    updateBoolean: (id, key, newBoolean) => {
        set((state) => ({
            creditos: state.creditos.map((credito) =>
                credito.id === id ? { ...credito, [key]: newBoolean } : credito
            ),
            creditosPendientes: state.creditosPendientes.map((credito) =>
                credito.id === id ? { ...credito, [key]: newBoolean } : credito
            ),
            creditosAceptados: state.creditosAceptados.map((credito) =>
                credito.id === id ? { ...credito, [key]: newBoolean } : credito
            ),
            creditosRechazados: state.creditosRechazados.map((credito) =>
                credito.id === id ? { ...credito, [key]: newBoolean } : credito
            ),
            creditosFinalizados: state.creditosFinalizados.map((credito) =>
                credito.id === id ? { ...credito, [key]: newBoolean } : credito
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

    getCreditos: async () =>{
      set({isFetchingCreditos: true});
      
        const res = await axiosData("/creditoTest/", { method: "GET" });
        
        const creditoGroups = res?.data;
        const todos = creditoGroups?.find(group => group.estado === "Todos")?.data;
        const aceptados = creditoGroups?.find(group => group.estado === "Aceptados")?.data;
        const pendientes = creditoGroups?.find(group => group.estado === "Pendientes")?.data;
        const rechazados = creditoGroups?.find(group => group.estado === "Rechazados")?.data;
        const finalizados = creditoGroups?.find(group => group.estado === "Finalizados")?.data;

        set({ creditos: todos ?? [] });
        set({ creditosPendientes: pendientes ?? [] });
        set({ creditosAceptados: aceptados ?? [] });
        set({ creditosRechazados: rechazados ?? [] });
        set({ creditosFinalizados: finalizados ?? [] });
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

    setCreditoDesembolsado: async (id, desembolso) => {
        set({isDesembolsandoCredito: true})
        get().updateBoolean(id, 'desembolsado', !desembolso);

        const res = await axiosData(`/creditoTest/desembolsar/${id}`, {
            method: "POST",
            data: { desembolsar: !desembolso }
        });

        // En caso de error
        if (res === null) {
            get().updateBoolean(id, 'desembolsado', desembolso);
        }

        set({isDesembolsandoCredito: false})
    },

    toggleCreditoEditable: async (id, editable) => {
        set({isSettingCreditoEditable: true})
        get().updateBoolean(id, 'editable', !editable)
        
        const res = await axiosData(`/creditoTest/editable/${id}`, {
            method: 'POST',
            data: { editable: !editable}
        }) 

        // Error
        if (res === null){
            get().updateBoolean(id, 'editable', editable)
        }

        set({isSettingCreditoEditable: false})
    },

    toggleCreditoDescargable: async (id, descargable) => {
        set({isSettingCreditoDescargable: true})
        get().updateBoolean(id, 'descargable', !descargable)
        
        const res = await axiosData(`/creditoTest/descargable/${id}`, {
            method: 'POST',
            data: { descargable: !descargable}
        }) 

        // Error
        if (res === null){
            get().updateBoolean(id, 'descargable', descargable)
        }

        set({isSettingCreditoDescargable: false})
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