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

    updateKey: (id, key, value) => {
        set((state) => ({
            usuarios: state.usuarios.map((usuario) =>
                usuario.id === id ? { ...usuario, [key]: value } : usuario
            ),
            usuariosConCuotas: state.usuariosConCuotas.map((usuario) =>
                usuario.id === id ? { ...usuario, [key]: value } : usuario
            ),
            usuariosConVencidas: state.usuariosConVencidas.map((usuario) =>
                usuario.id === id ? { ...usuario, [key]: value } : usuario
            ),
        }));
    },

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

        return get().currentUsuario;
    },

    register: async (formData) => {
        set({ isAuthenticating: true });
        const data = new FormData();

        // Append simple fields
        data.append('nombres', formData.nombres);
        data.append('apellidos', formData.apellidos);
        data.append('email', formData.email);
        data.append('celular', formData.celular);
        data.append('dui', formData.dui);
        data.append('password', formData.password);

        // Append files only if they exist and are File objects
        if (formData.duiDelante instanceof File)
        data.append('duiDelante', formData.duiDelante);

        if (formData.duiAtras instanceof File)
        data.append('duiAtras', formData.duiAtras);
        
        const res = await axiosData('/auth/register', { method: "POST", data: data, headers: { 'Content-Type': 'multipart/form-data'}})

        set({ currentUsuario: res?.data ?? null })
        set({ isAuthenticating: false });

        if (!res) return false;

        return get().currentUsuario;
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
        const data = new FormData();

        // Append simple fields
        data.append('usuarioId', formData.usuarioId);
        data.append('nombres', formData.nombres);
        data.append('apellidos', formData.apellidos);
        data.append('email', formData.email);
        data.append('celular', formData.celular);
        data.append('password', formData.password);

        // Append files only if they exist and are File objects
        if (formData.duiDelante instanceof File)
        data.append('duiDelante', formData.duiDelante);

        if (formData.duiAtras instanceof File)
        data.append('duiAtras', formData.duiAtras);
        
        const res = await axiosData('/usuarioTest/', { method: "PUT", data: data, headers: { 'Content-Type': 'multipart/form-data'}})
        
        set({isUpdatingUsuario: false})
        
        if (!res) return false; // stop if failed

        get().authenticate();

        return true;
    },

    bloquearUsuario: async(id) => {
        get().updateKey(id, 'enabled', true);
        
        const res = await axiosData(`/usuarioTest/${id}/bloquear`, {method: "POST"})

        if (res == null){
            get().updateKey(id, 'enabled', false);
        }
    },

    desbloquearUsuario: async(id) => {
        get().updateKey(id, 'enabled', false);
        
        const res = await axiosData(`/usuarioTest/${id}/desbloquear`, {method: "POST"})

        if (res == null){
            get().updateKey(id, 'enabled', true);
        }
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