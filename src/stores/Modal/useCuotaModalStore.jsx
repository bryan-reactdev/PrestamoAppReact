import { create } from 'zustand';

const estadoInicial = {
    openMarcarPagado: false,
    row: []
}

// --- Definición de Store --- //
export const useCuotaModalStore = create((set, get) => ({
    ...estadoInicial,

    // --- Helper de Marcar Pagado ---
    setMarcarPagadoModal: ({ open, row = null }) => {
        set({ openMarcarPagado: open, row: row });
    },

    openMarcarPagadoModal: (row) => {
        get().setMarcarPagadoModal({ open: true, row });
    },

    closeMarcarPagadoModal: () => {
        get().setMarcarPagadoModal({ open: false, row: null });
    },
}))