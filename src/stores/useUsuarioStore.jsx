import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import { descargarPDFConPrint } from '../utils/generalUtil';
import toast from 'react-hot-toast';

const estadoInicial = {
    currentUsuario: {rol: 'ROLE_ADMIN'},
    isAuthenticating: false,

    usuario: null,
    isFetchingUsuario: false,

    usuarios: [],
    isFetchingUsuarios: false,
}

// --- Definición de Store --- //
export const useUsuarioStore = create((set, get) => ({
    ...estadoInicial,

    getUsuario: async (id) =>{
        set({isFetchingUsuario: true});
      
        const res = await axiosData(`/usuarioTest/${id}`, { method: "GET" });

        set({ usuario: res?.data ?? null });
        set({ isFetchingUsuario: false });
    },

    getUsuarios: async () =>{
        set({isFetchingUsuarios: true});
      
        const res = await axiosData("/usuarioTest/", { method: "GET" });

        set({ usuarios: res?.data ?? [] });
        set({ isFetchingUsuarios: false });
    },

    descargarPDFInforme: async (id) => {
        try {
            toast.loading('Generando PDF...', { id: 'pdf-toast' });

            const res = await axiosData(`/usuarioTest/${id}/pdf`, {
                method: "POST",
                responseType: "blob",
            });

            await descargarPDFConPrint(res);
            
            toast.success('PDF listo para imprimir', { id: 'pdf-toast' });
        } catch (err) {
            console.error("Error descargando PDF:", err);
            toast.error('Error al generar el PDF de informe', { id: 'pdf-toast' });
        }
    },
}))