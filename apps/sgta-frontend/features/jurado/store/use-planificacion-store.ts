import { create } from "zustand";
import { PlanificacionState } from "../types/planificacion-state.types";

export const usePlanificationStore = create<PlanificacionState>((set) => ({
  estadoPlanificacion: undefined,
  temas: [],
  temasSinAsignar: [],
  temasAsignados: {},
  bloques: [],

  // Establecer el estado de planificación
  setEstadoPlanificacion: (estado) => set({ estadoPlanificacion: estado }),

  // Establecer la lista completa de temas
  setTemas: (temas) => set({ temas }),

  // Establecer los temas sin asignar
  setTemasSinAsignar: (temas) => set({ temasSinAsignar: temas }),

  // Establecer los temas asignados
  setTemasAsignados: (asignados) => set({ temasAsignados: asignados }),

  // Establecer los bloques
  setBloques: (bloques) => set({ bloques }),

  //Metodo para actualizar un bloque específico
  actualizarBloque: (idBloque, datos) => {
    console.log("Actualizando bloque:", idBloque, datos);
    set((state) => {
      const bloques = state.bloques.map((b) =>
        b.idBloque === idBloque ? { ...b, ...datos } : b,
      );
      return { bloques };
    });
  },

  //Metodo para actualizar un bloque específico
  actualizarBloqueByKey: (key, datos) => {
    console.log("Actualizando bloque por key:", key, datos);
    set((state) => {
      const bloques = state.bloques.map((b) =>
        b.key === key ? { ...b, ...datos } : b,
      );
      return { bloques };
    });
  },

  // Asignar un tema a un bloque usando actualizarBloque
  asignarTemaABloque: (tema, bloqueId) => {
    set((state) => {
      // Eliminar el tema de la lista de temas sin asignar
      const temasSinAsignar = state.temasSinAsignar.filter(
        (t) => t.id !== tema.id,
      );
      // Agregar el tema a los temas asignados
      const temasAsignados = { ...state.temasAsignados, [bloqueId]: tema };

      // Actualizar el bloque con el nuevo tema
      state.actualizarBloque(bloqueId, { expo: tema });

      return { temasSinAsignar, temasAsignados };
    });
  },

  // Desasignar un tema de un bloque usando actualizarBloque
  desasignarTemaDeBloque: (bloqueId) => {
    set((state) => {
      // Volver a agregar el tema a los temas sin asignar
      const tema = state.temasAsignados[bloqueId];
      const temasSinAsignar = [...state.temasSinAsignar, tema];

      // Eliminar el tema de los temas asignados
      const temasAsignados = { ...state.temasAsignados };
      delete temasAsignados[bloqueId];

      // Actualizar el bloque para quitar el tema
      state.actualizarBloque(bloqueId, { expo: undefined });

      return { temasSinAsignar, temasAsignados };
    });
  },
}));
