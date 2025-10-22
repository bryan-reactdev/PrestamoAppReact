import { create } from 'zustand';
import { axiosData } from "../utils/axiosWrapper";
import { descargarPDFConPrint } from '../utils/generalUtil';
import toast from 'react-hot-toast';

const estadoInicial = {
    currentUsuario: null,
    isAuthenticating: true,

    usuario: null,
    isFetchingUsuario: false,

    usuarios: [],
    isFetchingUsuarios: false,

    usuariosConCuotas: [],
    isFetchingUsuariosConCuotas: false,
    usuariosConVencidas: [],
    isFetchingUsuariosConVencidas: false,

    isUpdatingUsuario: false,
}

// --- Definición de Store --- //
export const useUsuarioStore = create((set, get) => ({
    ...estadoInicial,

    authenticate: async () => {
        set({isAuthenticating: true})
        
        const res = await axiosData("/auth/check", {method: "POST"})

        set({currentUsuario: res?.data ?? null})
        set({isAuthenticating: false})
        
        if (!res) return false; // stop if check failed

        return true;
    },

    login: async (formData) => {
        set({ isAuthenticating: true });

        const res = await axiosData("/auth/login", { method: "POST", data: formData });

        set({ currentUsuario: res?.data ?? null })
        set({ isAuthenticating: false });

        if (!res) return false; // stop if login failed

        return true;
    },

    logout: async () => {
        const res = await axiosData("/auth/logout", { method: "POST" });

        set({currentUsuario: null})

        if (!res) return false; // stop if login failed

        return true;
    },

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

    getUsuariosConCuotas: async () =>{
        set({isFetchingUsuariosConCuotas: true});
      
        const res = await axiosData("/usuarioTest/cuotas", { method: "GET" });

        set({ usuariosConCuotas: res?.data ?? [] });
        set({ isFetchingUsuariosConCuotas: false });
    },

    getUsuariosConVencidas: async () =>{
        set({isFetchingUsuariosConVencidas: true});
      
        const res = await axiosData("/usuarioTest/vencidas", { method: "GET" });

        set({ usuariosConVencidas: res?.data ?? [] });
        set({ isFetchingUsuariosConVencidas: false });
    },

    updateUsuario: async(formData) => {
        set({isUpdatingUsuario: true})
        
        const res = await axiosData('/usuarioTest/', { method: "PUT", data: formData, headers: { 'Content-Type': 'multipart/form-data'}})

        set({isUpdatingUsuario: false})
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