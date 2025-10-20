import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import toast from 'react-hot-toast';

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

    // Helper para actualizar valores de manera optimistica
    updateKey: (id, key, value) => {
        set((state) => ({
            cuotas: state.cuotas.map((cuota) =>
                cuota.id === id ? { ...cuota, [key]: value } : cuota
            ),
            cuotasPendientes: state.cuotasPendientes.map((cuota) =>
                cuota.id === id ? { ...cuota, [key]: value } : cuota
            ),
            cuotasPagadas: state.cuotasPagadas.map((cuota) =>
                cuota.id === id ? { ...cuota, [key]: value } : cuota
            ),
            cuotasVencidas: state.cuotasVencidas.map((cuota) =>
                cuota.id === id ? { ...cuota, [key]: value } : cuota
            ),
            cuotasEnRevision: state.cuotasEnRevision.map((cuota) =>
                cuota.id === id ? { ...cuota, [key]: value } : cuota
            ),
        }));
    },

    getCuotas: async (creditoId = null) =>{
        const isCurrentGlobal = (creditoId === null || creditoId === 0)
        const {wasGlobalFetch, cuotas} = get();

        if (isCurrentGlobal && wasGlobalFetch && cuotas.length !== 0){
            return
        }

        set({isFetchingCuotas: true});
        
        set({
            cuotas: [],
            cuotasPendientes: [],
            cuotasPagadas: [],
            cuotasVencidas: [],
            cuotasEnRevision: [],
        })
        let res = null;
        
        if (isCurrentGlobal){
            res = await axiosData("/cuotaTest/", { method: "GET" });
            set({wasGlobalFetch: true})
        }
        else if (!isCurrentGlobal){
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

    pagarCuota: async (id, row) => {
        const previousEstado = row.original.estado;

        set({isPagandoCuota: true});
        get().updateKey(id, 'estado', 'Pagado');

        const res = await axiosData(`/cuotaTest/pagar/${id}`, {method: 'POST'});

        // En caso de error
        if (res === null){
            get().updateKey(id, 'estado', previousEstado); 
        }

        set({isPagandoCuota: false});
    },

    abonarCuota: async (id, row, formData) => {
        const montoOriginal = Number(row.original.abono) || 0
        const nuevoMonto = Number(formData.monto) || 0

        get().updateKey(id, 'abono', Number(row.original.abono) + nuevoMonto)
        get().updateKey(id, 'total', Number(row.original.total) - nuevoMonto)

        const res = await axiosData(`/cuotaTest/abonar/${id}`, {
            method: 'POST',
            data: formData,
        })

        if (res === null) {
            get().updateKey(id, 'abono', montoOriginal)
        }
    }
}))