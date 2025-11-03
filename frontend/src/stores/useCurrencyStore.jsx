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

    historialBalance: null,

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
        balance: null,

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
    isUpdatingHistorial: false,

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
        get().resetArrays();

        const res = await axiosData("/currency/balance", { method: "GET" });

        set({
            saldo: res?.data.saldo ?? 0,

            historialBalance: res?.data.historialBalance,

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

        // Recalculate filtered arrays for selected date
        get().getCurrencyForDate();
    },

    realizarIngreso: async (formData, images = []) => {
        set({ isRealizandoIngreso: true });
        toast.loading('Realizando Ingreso...', { id: 'realizar-ingreso' });

        // Create FormData for file upload
        const data = new FormData();
        data.append('monto', formData.monto);
        data.append('motivo', formData.motivo);
        data.append('tipo', formData.tipo);
        data.append('fecha', formData.fecha);
        
        // Append images
        images.forEach((image) => {
            data.append('images', image);
        });

        const res = await axiosData("/currency/ingreso", {
            method: "POST",
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast.dismiss('realizar-ingreso');

        if (res?.data) {
            get().getBalance();
        }

        set({ isRealizandoIngreso: false });
    },

    realizarEgreso: async (formData, images = []) => {
        set({ isRealizandoEgreso: true });
        toast.loading('Realizando Egreso...', { id: 'realizar-egreso' });

        // Create FormData for file upload
        const data = new FormData();
        data.append('monto', formData.monto);
        data.append('motivo', formData.motivo);
        data.append('tipo', formData.tipo);
        data.append('fecha', formData.fecha);
        
        // Append images
        images.forEach((image) => {
            data.append('images', image);
        });

        const res = await axiosData("/currency/egreso", {
            method: "POST",
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' }
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
        const { filtrarPorFecha, selectedDate, ingresosCapitales, ingresosVarios, cuotasAbonos, cuotasPagadas, gastosEmpresa, egresosVarios, egresosCuotasRetiros, creditosDesembolsados, historialBalance, saldo } = get();

        const isCurrentDate = selectedDate === getCurrentDate();

        const ingresosCapitalesForDate = filtrarPorFecha(ingresosCapitales, selectedDate);
        const ingresosVariosForDate = filtrarPorFecha(ingresosVarios, selectedDate);
        const cuotasAbonosForDate = filtrarPorFecha(cuotasAbonos, selectedDate);
        const cuotasPagadasForDate = filtrarPorFecha(cuotasPagadas, selectedDate);

        const gastosEmpresaForDate = filtrarPorFecha(gastosEmpresa, selectedDate);
        const egresosVariosForDate = filtrarPorFecha(egresosVarios, selectedDate);
        const egresosCuotasRetirosForDate = filtrarPorFecha(egresosCuotasRetiros, selectedDate);
        const creditosDesembolsadosForDate = filtrarPorFecha(creditosDesembolsados, selectedDate);

        const historialBalanceForDate = filtrarPorFecha(historialBalance, selectedDate);

        // Calculate totals from filtered data
        const calculatedTotalIngresos = 
            ingresosCapitalesForDate?.total +
            ingresosVariosForDate?.total +
            cuotasAbonosForDate?.total +
            cuotasPagadasForDate?.total;

        const calculatedTotalEgresos = 
            gastosEmpresaForDate?.total +
            egresosVariosForDate?.total +
            egresosCuotasRetirosForDate?.total +
            creditosDesembolsadosForDate?.total;

        // Create balance object with consistent structure
        const balance = isCurrentDate 
            ? {
                saldo: saldo,
                fecha: selectedDate
              }
            : (historialBalanceForDate?.data?.[0] ? {
                saldo: historialBalanceForDate.data[0].monto,
                fecha: historialBalanceForDate.data[0].fecha
              } : {
                saldo: 0,
                fecha: selectedDate
              });

        set({
            currencyForDate: {
                balance: balance,

                ingresosCapitales: ingresosCapitalesForDate,
                ingresosVarios: ingresosVariosForDate,
                cuotasAbonos: cuotasAbonosForDate,
                cuotasPagadas: cuotasPagadasForDate,
                totalIngresos: calculatedTotalIngresos,

                gastosEmpresa: gastosEmpresaForDate,
                egresosVarios: egresosVariosForDate,
                egresosCuotasRetiros: egresosCuotasRetirosForDate,
                creditosDesembolsados: creditosDesembolsadosForDate,
                totalEgresos: calculatedTotalEgresos,
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

    // --- Week Data Generation ---
    getWeekData: (weekOffset = 0) => {
        const { filtrarPorFecha, ingresosCapitales, ingresosVarios, cuotasAbonos, cuotasPagadas, gastosEmpresa, egresosVarios, egresosCuotasRetiros, creditosDesembolsados, historialBalance } = get();
        
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + (weekOffset * 7));
        const weekData = [];
        
        // Get the start of the target week (Monday)
        const startOfWeek = new Date(targetDate);
        const day = targetDate.getDay();
        const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);
        
        // Generate 7 days of data
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            
            // Calculate totals for this specific date
            const ingresosCapitalesForDate = filtrarPorFecha(ingresosCapitales, dateString);
            const ingresosVariosForDate = filtrarPorFecha(ingresosVarios, dateString);
            const cuotasAbonosForDate = filtrarPorFecha(cuotasAbonos, dateString);
            const cuotasPagadasForDate = filtrarPorFecha(cuotasPagadas, dateString);
            
            const gastosEmpresaForDate = filtrarPorFecha(gastosEmpresa, dateString);
            const egresosVariosForDate = filtrarPorFecha(egresosVarios, dateString);
            const egresosCuotasRetirosForDate = filtrarPorFecha(egresosCuotasRetiros, dateString);
            const creditosDesembolsadosForDate = filtrarPorFecha(creditosDesembolsados, dateString);
            const historialBalanceForDate = filtrarPorFecha(historialBalance, dateString);
            
            const totalIngresos = 
                (ingresosCapitalesForDate?.total || 0) +
                (ingresosVariosForDate?.total || 0) +
                (cuotasAbonosForDate?.total || 0) +
                (cuotasPagadasForDate?.total || 0);
            
            const totalEgresos = 
                (gastosEmpresaForDate?.total || 0) +
                (egresosVariosForDate?.total || 0) +
                (egresosCuotasRetirosForDate?.total || 0) +
                (creditosDesembolsadosForDate?.total || 0);
            
            weekData.push({
                date: dateString,
                dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
                // Detailed breakdown for tooltips
                ingresosCapitales: ingresosCapitalesForDate?.total || 0,
                ingresosVarios: ingresosVariosForDate?.total || 0,
                cuotasAbonos: cuotasAbonosForDate?.total || 0,
                cuotasPagadas: cuotasPagadasForDate?.total || 0,
                gastosEmpresa: gastosEmpresaForDate?.total || 0,
                egresosVarios: egresosVariosForDate?.total || 0,
                egresosCuotasRetiros: egresosCuotasRetirosForDate?.total || 0,
                creditosDesembolsados: creditosDesembolsadosForDate?.total || 0,
                historialBalance: historialBalanceForDate?.data?.[0]?.monto || 0,
                // Totals
                totalIngresos: totalIngresos,
                totalEgresos: totalEgresos,
                balance: totalIngresos - totalEgresos
            });
        }
        
        return weekData;
    },

    // --- Month Data Generation ---
    getMonthData: (monthOffset = 0) => {
        const { filtrarPorFecha, ingresosCapitales, ingresosVarios, cuotasAbonos, cuotasPagadas, gastosEmpresa, egresosVarios, egresosCuotasRetiros, creditosDesembolsados, historialBalance } = get();
        
        const today = new Date();
        const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
        const monthData = [];
        
        // Get the start of the target month
        const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        
        // Generate days for the month
        for (let i = 0; i < endOfMonth.getDate(); i++) {
            const date = new Date(startOfMonth);
            date.setDate(startOfMonth.getDate() + i);
            
            // Skip if date is in the future (for current month)
            if (monthOffset === 0 && date > today) break;
            
            const dateString = date.toISOString().split('T')[0];
            
            // Calculate totals for this specific date
            const ingresosCapitalesForDate = filtrarPorFecha(ingresosCapitales, dateString);
            const ingresosVariosForDate = filtrarPorFecha(ingresosVarios, dateString);
            const cuotasAbonosForDate = filtrarPorFecha(cuotasAbonos, dateString);
            const cuotasPagadasForDate = filtrarPorFecha(cuotasPagadas, dateString);
            
            const gastosEmpresaForDate = filtrarPorFecha(gastosEmpresa, dateString);
            const egresosVariosForDate = filtrarPorFecha(egresosVarios, dateString);
            const egresosCuotasRetirosForDate = filtrarPorFecha(egresosCuotasRetiros, dateString);
            const creditosDesembolsadosForDate = filtrarPorFecha(creditosDesembolsados, dateString);
            const historialBalanceForDate = filtrarPorFecha(historialBalance, dateString);
            
            const totalIngresos = 
                (ingresosCapitalesForDate?.total || 0) +
                (ingresosVariosForDate?.total || 0) +
                (cuotasAbonosForDate?.total || 0) +
                (cuotasPagadasForDate?.total || 0);
            
            const totalEgresos = 
                (gastosEmpresaForDate?.total || 0) +
                (egresosVariosForDate?.total || 0) +
                (egresosCuotasRetirosForDate?.total || 0) +
                (creditosDesembolsadosForDate?.total || 0);
            
            monthData.push({
                date: dateString,
                dayNumber: date.getDate(),
                // Detailed breakdown for tooltips
                ingresosCapitales: ingresosCapitalesForDate?.total || 0,
                ingresosVarios: ingresosVariosForDate?.total || 0,
                cuotasAbonos: cuotasAbonosForDate?.total || 0,
                cuotasPagadas: cuotasPagadasForDate?.total || 0,
                gastosEmpresa: gastosEmpresaForDate?.total || 0,
                egresosVarios: egresosVariosForDate?.total || 0,
                egresosCuotasRetiros: egresosCuotasRetirosForDate?.total || 0,
                creditosDesembolsados: creditosDesembolsadosForDate?.total || 0,
                historialBalance: historialBalanceForDate?.data?.[0]?.monto || 0,
                // Totals
                totalIngresos: totalIngresos,
                totalEgresos: totalEgresos,
                balance: totalIngresos - totalEgresos
            });
        }
        
        return monthData;
    },

    editHistorial: async (id, formData, existingImages = [], newImages = []) => {
        set({ isUpdatingHistorial: true });
        toast.loading('Editando registro...', { id: 'editar-historial' });

        // Create FormData for file upload
        const data = new FormData();
        data.append('monto', formData.monto);
        data.append('motivo', formData.motivo);
        data.append('tipo', formData.tipo);
        data.append('fecha', formData.fecha);
        
        // Append existing images (paths to keep)
        existingImages.forEach((filePath) => {
            data.append('existingImages', filePath);
        });
        
        // Append new images only if they are File objects
        newImages.forEach((image) => {
            if (image instanceof File) {
                data.append('images', image);
            }
        });

        const res = await axiosData(`/currency/historial/${id}`, {
            method: "PUT",
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast.dismiss('editar-historial');

        if (res != null) {
            toast.dismiss('editar-historial');
            get().getBalance();
        } else {
            toast.error('Error al editar el registro');
        }

        set({ isUpdatingHistorial: false });
        return res != null;
    },

    // --- Helpers ---
    calcularTotal: (objects) => {
        if (!Array.isArray(objects)) return;

        return objects.reduce((sum, item) => {
            if (item?.total) {
                return sum + item.total;
            }
            else if (item?.montoDesembolsar && item.montoDesembolsar !== 0) {
                return sum + item.montoDesembolsar;
            }
            else if (item?.monto) {
                return sum + item.monto;
            }

            return console.warn(`This item doesn't contain a valid value`, item);
        }, 0);
    },

    resetArrays: () => {
        set({
            saldo: null,
            historialBalance: null,

            // Ingresos
            ingresosCapitales: null,
            ingresosVarios: null,
            cuotasAbonos: null,
            cuotasPagadas: null,

            // Egresos
            gastosEmpresa: null,
            egresosVarios: null,
            egresosCuotasRetiros: null,
            creditosDesembolsados: null,

            currencyForDate: {
                balance: null,

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
        });
    },
}))