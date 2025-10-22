import { create } from 'zustand';

const estadoInicial = {
    marcarPagado: false,
    abonar: false,
    row: []
}

// --- Definición de Store --- //
export const useCuotaModalStore = create((set, get) => ({
    ...estadoInicial,

    // --- Setter de modal genérico ---
    setModal: (key, { open, row = null }) => {
        set((state) => ({
        ...state,
        [key]: open,
        row,
        }));
    },

    // --- Helpers genéricos. Uso: openModal('aceptar') ---
    openModal: (key, row) => {
        set((state) => ({
        ...state,
        [key]: true,
        row,
        }));
    },

    closeModal: (key) => {
        set((state) => ({
        ...state,
        [key]: false,
        row: null,
        }));
    },
}))