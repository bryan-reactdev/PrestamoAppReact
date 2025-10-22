import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";

const estadoInicial = {
    historial: [],
    isFetchingHistorial: false,
}

// --- Definición de Store --- //
export const useHistorialStore = create((set, get) => ({
    ...estadoInicial,

    getHistorial: async () =>{
      set({isFetchingHistorial: true});
      
        const res = await axiosData("/historialTest/", { method: "GET" });
        
        set({ historial: res?.data ?? [] });
        set({ isFetchingHistorial: false });
    },
}))