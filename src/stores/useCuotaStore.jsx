import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";

const estadoInicial = {
    cuotas: [],
    cuotasPendientes: [],
    cuotasPagadas: [],
    cuotasVencidas: [],
    cuotasEnRevision: [],
    isFetchingCuotas: false,

    isPagandoCuota: false,
    
    wasGlobalFetch: false,
}

// --- Definición de Store --- //
export const useCuotaStore = create((set, get) => ({
    ...estadoInicial,

    // Helper para actualizar el estado de manera optimistica
    updateEstado: (id, newEstado) => {
        set((state) => ({
            cuotas: state.cuotas.map((cuota) =>
                cuota.id === id ? { ...cuota, estado: newEstado } : cuota
            ),
            cuotasPendientes: state.cuotasPendientes.map((cuota) =>
                cuota.id === id ? { ...cuota, estado: newEstado } : cuota
            ),
        }));
    },
    
    getCuotas: async (creditoId = null) =>{
        const isCurrentGlobal = (creditoId === null || creditoId === 0)

        if (isCurrentGlobal && get().wasGlobalFetch && get().cuotas.length !== 0){
            return
        }

        set({isFetchingCuotas: true});
        
        let res = null;
        
        if (isCurrentGlobal){
            set({
                cuotas: [],
                cuotasPendientes: [],
                cuotasPagadas: [],
                cuotasVencidas: [],
                cuotasEnRevision: [],
            })
            
            res = await axiosData("/cuotaTest/", { method: "GET" });
            set({wasGlobalFetch: true})
        }
        else if (!isCurrentGlobal){
            set({
                cuotas: [],
                cuotasPendientes: [],
                cuotasPagadas: [],
                cuotasVencidas: [],
                cuotasEnRevision: [],
            })
            
            res = await axiosData(`/creditoTest/${creditoId}/cuotas`, { method: "GET" });
            set({wasGlobalFetch: false})
        }

        const cuotaGroups = res?.data;
        const todas = cuotaGroups?.find(group => group.estado === "Todos")?.data
        const pendientes = cuotaGroups?.find(group => group.estado === "Pendientes")?.data
        const pagadas = cuotaGroups?.find(group => group.estado === "Pagadas")?.data
        const vencidas = cuotaGroups?.find(group => group.estado === "Vencidas")?.data
        const enRevision = cuotaGroups?.find(group => group.estado === "EnRevision")?.data

        set({ cuotas: todas ?? [] });
        set({ cuotasPendientes: pendientes ?? [] });
        set({ cuotasPagadas: pagadas ?? [] });
        set({ cuotasVencidas: vencidas ?? [] });
        set({ cuotasEnRevision: enRevision ?? [] });
        set({ isFetchingCuotas: false });
    },

    pagarCuota: async (id, currentEstado) => {
        set({isPagandoCuota: true});
        get().updateEstado(id, 'Pagado');

        const res = await axiosData(`/cuotaTest/pagar/${id}`, {method: 'POST'});

        // En caso de error
        if (res === null){
            get().updateDesembolsado(id, currentEstado); 
        }

        set({isPagandoCuota: false});
    }
}))