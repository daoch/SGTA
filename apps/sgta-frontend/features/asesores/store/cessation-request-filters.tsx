import { create } from "zustand";
import {
  ICessationRequestSearchStore, // Tipo combinado de estado y acciones
  CessationRequestFrontendStatusFilter, // Tipo para el filtro de pestañas de la UI
} from "@/features/asesores/types/cessation-request"; // Ajusta la ruta

export const useCessationRequestSearchCriteriaStore = create<ICessationRequestSearchStore>((set) => ({
  fullNameEmail: "",
  status: "pending", // Pestaña "Pendientes" por defecto
  page: 0,           // Página inicial 0 (primera página)
  setFullNameEmail: (value: string) => set({ fullNameEmail: value }), // No resetea page aquí, setFullNameEmailPage lo hace
  setPage: (value: number) => set({ page: value }),
  setStatusTabFilter: (newStatus: CessationRequestFrontendStatusFilter) =>
    set({ status: newStatus, page: 0, fullNameEmail: "" }), // Resetea page a 0 Y limpia búsqueda de texto al cambiar de tab
  setFullNameEmailPage: (value: string) =>
    set({ page: 0, fullNameEmail: value }), // Resetea page a 0 al buscar
  clear: () =>
    set({ page: 0, fullNameEmail: "", status: "pending" }),
}));