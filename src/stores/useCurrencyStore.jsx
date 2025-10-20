import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import toast from 'react-hot-toast';
import { getCurrentDate } from '../utils/dateUtils';

const estadoInicial = {
    saldo: null,

    // Ingresos
    ingresosCapitales: null,
    ingresosVarios: null,
    cuotasAbonos: null,
    cuotasPagadas: null,

    // Egresos
    gastosEmpresa: null,
    gastosVarios: null,
    egresosCuotasRetiros: null,
    creditosDesembolsados: null,

    currencyForDate: {
        // Ingresos
        ingresosCapitales: null,
        ingresosVarios: null,
        cuotasAbonos: null,
        cuotasPagadas: null,
        totalIngresos: null,
    
        // Egresos
        gastosEmpresa: null,
        egresosVarios: null,
        egresosCuotasRetiros: null,
        creditosDesembolsados: null,
        totalEgresos: null,
    },

    // Fetching
    isFetchingBalance: false,
    isRealizandoIngreso: false,
    isRealizandoEgreso: false,

    // Sorting
    selectedDate: getCurrentDate(),
}

// --- Definición de Store --- //
export const useCurrencyStore = create((set, get) => ({
    ...estadoInicial,

    getBalance: async () =>{
        set({isFetchingBalance: true});
      
        const res = await axiosData("/currency/balance", { method: "GET" });
        
        set({ 
            saldo: res?.data.saldo ?? 0,

            // Ingresos
            ingresosCapitales: res?.data.ingresosCapitales,
            ingresosVarios: res?.data.ingresosVarios,
            cuotasAbonos: res?.data.cuotasAbonos,
            cuotasPagadas: res?.data.cuotasPagadas,

            // Egresos
            gastosEmpresa: res?.data.gastosEmpresa,
            egresosVarios: res?.data.egresosVarios,
            egresosCuotasRetiros: res?.data.egresosCuotasRetiros,
            creditosDesembolsados: res?.data.creditosDesembolsados,
        });

        set({ isFetchingBalance: false });
    },
    
    realizarIngreso: async (formData) => {
        set({isRealizandoIngreso: true});
        toast.loading('Realizando Ingreso...', {id: 'realizar-ingreso'});
      
        const res = await axiosData("/currency/ingreso", { 
            method: "POST",
            data: formData
        });

        toast.dismiss('realizar-ingreso');

        if (res?.data){
            get().getBalance();
        }
                        
        set({ isRealizandoIngreso: false });
    },

    realizarEgreso: async (formData) => {
        set({isRealizandoEgreso: true});
        toast.loading('Realizando Egreso...', {id: 'realizar-egreso'});
      
        const res = await axiosData("/currency/egreso", { 
            method: "POST",
            data: formData
        });

        toast.dismiss('realizar-egreso');

        if (res?.data){
            get().getBalance();
        }
                        
        set({ isRealizandoEgreso: false });
    },

    setSelectedDate: (date) => {
        set({selectedDate: date});
        get().getCurrencyForDate();
    },

    // --- Totales Calculations ---
    getCurrencyForDate: () => {
        const ingresosCapitalesForDate = get().filtrarPorFecha(get().ingresosCapitales, get().selectedDate);
        const ingresosVariosForDate = get().filtrarPorFecha(get().ingresosVarios, get().selectedDate);
        const cuotasAbonosForDate = get().filtrarPorFecha(get().cuotasAbonos, get().selectedDate);
        const cuotasPagadasForDate = get().filtrarPorFecha(get().cuotasPagadas, get().selectedDate);
        
        const gastosEmpresaForDate = get().filtrarPorFecha(get().gastosEmpresa, get().selectedDate);
        const egresosVariosForDate = get().filtrarPorFecha(get().egresosVarios, get().selectedDate);
        const egresosCuotasRetirosForDate = get().filtrarPorFecha(get().egresosCuotasRetiros, get().selectedDate);
        const creditosDesembolsadosForDate = get().filtrarPorFecha(get().creditosDesembolsados, get().selectedDate);

        set({
            currencyForDate: {
                ingresosCapitales: ingresosCapitalesForDate,
                ingresosVarios: ingresosVariosForDate,
                cuotasAbonos: cuotasAbonosForDate,
                cuotasPagadas: cuotasPagadasForDate,
                totalIngresos:
                    ingresosCapitalesForDate?.total +
                    ingresosVariosForDate?.total +
                    cuotasAbonosForDate?.total +
                    cuotasPagadasForDate?.total,

                gastosEmpresa: gastosEmpresaForDate,
                egresosVarios: egresosVariosForDate,
                egresosCuotasRetiros: egresosCuotasRetirosForDate,
                creditosDesembolsados: creditosDesembolsadosForDate,
                totalEgresos:
                    gastosEmpresaForDate?.total +
                    egresosVariosForDate?.total +
                    egresosCuotasRetirosForDate?.total +
                    creditosDesembolsadosForDate?.total,
            },
        })
    },

    filtrarPorFecha: (objects, selectedDate) => {
        if (!Array.isArray(objects)) return;

        const filteredObjects = objects.filter((object) => {
            if (object?.fecha){
                return object.fecha.startsWith(selectedDate)
            }
            else if (object?.fechaPagado){
                return object.fechaPagado.startsWith(selectedDate)
            }
            else if (object?.fechaDesembolsado){
                return object.fechaDesembolsado.startsWith(selectedDate);
            }
            
            return console.warn(`This object doesn't contain a valid date`, object)
        })

        const total = get().calcularTotal(filteredObjects);
        return { data: filteredObjects, total: total}
    },

    // --- Helpers ---
    calcularTotal: (objects) => {
        if (!Array.isArray(objects)) return;

        return objects.reduce((sum, item) => {
            if (item?.total){
                return sum + item.total;
            }
            else if (item?.monto){
                return sum + item.monto;
            }

            return console.warn(`This item doesn't contain a valid value`, item);
        }, 0);
    },
}))