import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";

const estadoInicial = {
    saldo: 0,
    totalIngresos: 0,
    totalEgresos: 0,
    isFetchingBalance: false,

}

// --- Definición de Store --- //
export const useCurrencyStore = create((set, get) => ({
    ...estadoInicial,

    getBalance: async () =>{
        set({isFetchingBalance: true});
      
        const res = await axiosData("/currency/balance", { method: "GET" });
        console.log(res.data.saldo);
        
        set({ 
            saldo: res?.data.saldo ?? 0,
            totalIngresos: res?.data.totalIngresos ?? 0,
            totalEgresos: res?.data.totalEgresos ?? 0,
        });
        set({ isFetchingBalance: false });
    },
}))