import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import toast from 'react-hot-toast';
import { getCurrentDate } from '../utils/dateUtils';
import { descargarPDFConPrint } from '../utils/generalUtil';

const estadoInicial = {
    cuotasTotales: {
        totalVencidas: null,
        totalPendientes: null,
        totalPagadas: null,
    },

    isFetchingCuotasTotales: false,

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

    getCuotasTotales: async () => {
        set({isFetchingCuotasTotales: true})

        const res = await axiosData("/currency/cuotas", {method: "GET"});

        set({
            cuotasTotales:{
                totalVencidas: res?.data?.totalVencidas,
                totalPendientes: res?.data?.totalPendientes,
                totalPagadas: res?.data?.totalPagadas,
            }
        })

        set({isFetchingCuotasTotales: false})
    },

    getBalance: async () => {
        set({ isFetchingBalance: true });

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
        set({ isRealizandoIngreso: true });
        toast.loading('Realizando Ingreso...', { id: 'realizar-ingreso' });

        const res = await axiosData("/currency/ingreso", {
            method: "POST",
            data: formData
        });

        toast.dismiss('realizar-ingreso');

        if (res?.data) {
            get().getBalance();
        }

        set({ isRealizandoIngreso: false });
    },

    realizarEgreso: async (formData) => {
        set({ isRealizandoEgreso: true });
        toast.loading('Realizando Egreso...', { id: 'realizar-egreso' });

        const res = await axiosData("/currency/egreso", {
            method: "POST",
            data: formData
        });

        toast.dismiss('realizar-egreso');

        if (res?.data) {
            get().getBalance();
        }

        set({ isRealizandoEgreso: false });
    },

    descargarPDF: async (tipo, fecha) => {
        try {
            toast.loading('Generando PDF...', { id: 'pdf-toast' });

            console.log(`/currency/${tipo}/${fecha}/pdf`)
            const res = await axiosData(`/currency/${tipo}/${fecha}/pdf`, {
                method: "POST",
                responseType: "blob",
            });

            await descargarPDFConPrint(res);
            
            toast.success('PDF listo para imprimir', { id: 'pdf-toast' });
        } catch (err) {
            console.error("Error descargando PDF:", err);
            toast.error(`Error al generar el PDF de ${tipo}`, { id: 'pdf-toast' });
        }
    },

    setSelectedDate: (date) => {
        set({ selectedDate: date });
        get().getCurrencyForDate();
    },

    // --- Totales Calculations ---
    getCurrencyForDate: () => {
        const { filtrarPorFecha, selectedDate, ingresosCapitales, ingresosVarios, cuotasAbonos, cuotasPagadas, gastosEmpresa, egresosVarios, egresosCuotasRetiros, creditosDesembolsados } = get();

        const ingresosCapitalesForDate = filtrarPorFecha(ingresosCapitales, selectedDate);
        const ingresosVariosForDate = filtrarPorFecha(ingresosVarios, selectedDate);
        const cuotasAbonosForDate = filtrarPorFecha(cuotasAbonos, selectedDate);
        const cuotasPagadasForDate = filtrarPorFecha(cuotasPagadas, selectedDate);

        const gastosEmpresaForDate = filtrarPorFecha(gastosEmpresa, selectedDate);
        const egresosVariosForDate = filtrarPorFecha(egresosVarios, selectedDate);
        const egresosCuotasRetirosForDate = filtrarPorFecha(egresosCuotasRetiros, selectedDate);
        const creditosDesembolsadosForDate = filtrarPorFecha(creditosDesembolsados, selectedDate);

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
            if (object?.fecha) {
                return object.fecha.startsWith(selectedDate)
            }
            else if (object?.fechaPagado) {
                return object.fechaPagado.startsWith(selectedDate)
            }
            else if (object?.fechaDesembolsado) {
                return object.fechaDesembolsado.startsWith(selectedDate);
            }

            return console.warn(`Object doesn't contain a valid date`, object)
        })

        const total = get().calcularTotal(filteredObjects);
        return { data: filteredObjects, total: total }
    },

    // --- Helpers ---
    calcularTotal: (objects) => {
        if (!Array.isArray(objects)) return;

        return objects.reduce((sum, item) => {
            if (item?.total) {
                return sum + item.total;
            }
            else if (item?.monto) {
                return sum + item.monto;
            }

            return console.warn(`This item doesn't contain a valid value`, item);
        }, 0);
    },
}))