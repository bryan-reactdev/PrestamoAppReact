import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import toast from 'react-hot-toast';
import { descargarPDFConPrint } from '../utils/generalUtil';
import { getCurrentDate } from '../utils/dateUtils';

const estadoInicial = {
    cuota: null,
    isFetchingCuota: false,
    
    cuotas: [],
    cuotasPendientes: [],
    cuotasPagadas: [],
    cuotasVencidas: [],
    cuotasEnRevision: [],
    cuotasPendientesForMapeo: [],
    cuotasPendientesForMapeoUnfiltered: [],
    isFetchingCuotas: false,

    selectedDate: getCurrentDate(),

    isUpdatingCuota: false,
    isPagandoCuota: false,
    isGuardandoNotas: false,
    
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
            cuotasPendientesForMapeo: state.cuotasPendientesForMapeo.map((cuota) =>
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

    updateCuotaOptimistic: (id, updatedFields) => {
        set((state) => ({
            cuotas: state.cuotas.map((c) => c.id === id ? { ...c, ...updatedFields } : c),
            cuotasPendientes: state.cuotasPendientes.map((c) => c.id === id ? { ...c, ...updatedFields } : c),
            cuotasPendientesForMapeo: state.cuotasPendientesForMapeo.map((c) => c.id === id ? { ...c, ...updatedFields } : c),
            cuotasPagadas: state.cuotasPagadas.map((c) => c.id === id ? { ...c, ...updatedFields } : c),
            cuotasVencidas: state.cuotasVencidas.map((c) => c.id === id ? { ...c, ...updatedFields } : c),
            cuotasEnRevision: state.cuotasEnRevision.map((c) => c.id === id ? { ...c, ...updatedFields } : c),
        }));
    },

    getCuota: async (cuotaId) => {
        set({isFetchingCuota: true})

        set({cuota: null})
        const res = await axiosData(`/cuotaTest/${cuotaId}`, {method:"GET"});
        
        set({cuota: res?.data ?? null})

        set({isFetchingCuota: false})
    },

    getCuotas: async (creditoId = null, isUsuario = false) =>{
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
            cuotasPendientesForMapeo: [],
            cuotasPendientesForMapeoUnfiltered: [],
        })
        let res = null;
        
        if (isCurrentGlobal){
            res = await axiosData("/cuotaTest/", { method: "GET" });
            set({wasGlobalFetch: true})
        }
        else if (!isCurrentGlobal){
            if (isUsuario){
                res = await axiosData(`/usuarioText/${creditoId}/cuotas`, { method: "GET" });
            }
            else{
                res = await axiosData(`/creditoTest/${creditoId}/cuotas`, { method: "GET" });
            }
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

        // Fetch cuotas pendientes for mapeo with new DTO
        const resMapeo = await axiosData("/cuotaTest/pendientes-mapeo", { method: "GET" });
        const mapeoData = resMapeo?.data ?? [];
        set({ cuotasPendientesForMapeoUnfiltered: mapeoData });
        get().filterCuotasPendientesForMapeo(get().selectedDate);
    },

    getUsuarioCuotas: async (usuarioId) => {
        set({isFetchingCuotas: true})

        const res = await axiosData(`/cuotaTest/usuario/${usuarioId}`, {method: "GET"})

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

        // Fetch cuotas pendientes for mapeo with new DTO
        const resMapeo = await axiosData("/cuotaTest/pendientes-mapeo", { method: "GET" });
        const mapeoData = resMapeo?.data ?? [];
        set({ cuotasPendientesForMapeoUnfiltered: mapeoData });
        get().filterCuotasPendientesForMapeo(get().selectedDate);

        set({isFetchingCuotas: false})
    },

    updateCuota: async (id, formData) => {
        set({ isUpdatingCuota: true });

        // Save previous state for rollback
        const { cuotas, cuotasPendientes, cuotasPagadas, cuotasVencidas, cuotasEnRevision } = get();
        const previousData = {
            cuotas: [...cuotas],
            cuotasPendientes: [...cuotasPendientes],
            cuotasPagadas: [...cuotasPagadas],
            cuotasVencidas: [...cuotasVencidas],
            cuotasEnRevision: [...cuotasEnRevision],
        };

        // Optimistically update all arrays
        // Work around to get the total calculated
        formData.total =
            (Number(formData.monto) + Number(formData.mora)) - Number(formData.abono);

        get().updateCuotaOptimistic(id, formData);

        // Make request
        const res = await axiosData(`/cuotaTest/${id}`, { method: "PUT", data: formData });

        // Rollback if failed
        if (!res) {
            set({ ...previousData });
        }

        set({ isUpdatingCuota: false });

        return res != null;
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
    },

    guardarNotas: async (id, formData) => {
        set ({isGuardandoNotas: true})

        const res = await axiosData(`/cuotaTest/notas/${id}`, {method: "POST", data: formData})

        set ({isGuardandoNotas: false})

        return (res != null)
    },

    descargarPDFCuotas: async (id) => {
        try {
            toast.loading('Generando PDF...', { id: 'pdf-toast' });

            const res = await axiosData(`/cuotaTest/pdf/${id}`, {
                method: "POST",
                responseType: "blob",
            });

            await descargarPDFConPrint(res);
            
            toast.success('PDF de cuotas listo para imprimir', { id: 'pdf-toast' });
        } catch (err) {
            console.error("Error descargando PDF:", err);
            toast.error('Error al generar el PDF de cuotas', { id: 'pdf-toast' });
        }
    },

    filterCuotasPendientesForMapeo: async (date) => {
        const {cuotasPendientesForMapeoUnfiltered} = get();
        if (date == null || !cuotasPendientesForMapeoUnfiltered?.length) {
            // No filtering needed, use all data
            set({ cuotasPendientesForMapeo: cuotasPendientesForMapeoUnfiltered ?? [] });
            return;
        }

        // Filter by cuotaVencimiento (from new DTO structure)
        const filtered = cuotasPendientesForMapeoUnfiltered.filter((cuota) => {
            if (!cuota.cuotaVencimiento) return false;
            // Handle both string and Date formats
            const fechaStr = typeof cuota.cuotaVencimiento === 'string' 
                ? cuota.cuotaVencimiento 
                : cuota.cuotaVencimiento.split('T')[0];
            return fechaStr.startsWith(date);
        });
        set({cuotasPendientesForMapeo: filtered});
    },

    setSelectedDate: (date) => {
        const {filterCuotasPendientesForMapeo} = get();
        set({selectedDate: date});
        filterCuotasPendientesForMapeo(date);
    }
}))