import { create } from "zustand";
import { distribuirBloquesExposicion } from "../services/data";
import { Tema } from "../types/jurado.types";
import { PlanificacionState } from "../types/planificacion-state.types";

export const usePlanificationStore = create<PlanificacionState>((set, get) => ({
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

  desasignarTodosLosTemas: () => {
    set((state) => {
      if (Object.keys(state.temasAsignados).length === 0) {
        return {};
      }

      // Mueve todos los temas a temasSinAsignar (evita duplicados)
      const nuevosTemasSinAsignar = [...state.temas];

      // Limpia los temas asignados
      const temasAsignados = {};

      // Actualiza todos los bloques para remover el tema asignado
      const bloques = state.bloques.map((bloque) => ({
        ...bloque,
        //expo: undefined,
        expo: {
          id: null,
          codigo: null,
          titulo: null,
          usuarios: null,
          areasConocimiento: undefined,
        },
      }));

      return {
        temasSinAsignar: nuevosTemasSinAsignar,
        temasAsignados,
        bloques,
      };
    });
  },

  generarDistribucionAutomatica: async () => {
    const { temasSinAsignar, bloques } = get();
    try {
      const nuevosBloques = await distribuirBloquesExposicion(
        temasSinAsignar,
        bloques,
      );

      const nuevosTemasAsignados: Record<string, Tema> = {};
      const asignadosSet = new Set<number>();

      nuevosBloques.forEach((bloque) => {
        if (bloque.expo && bloque.expo.id != null) {
          nuevosTemasAsignados[bloque.key] = bloque.expo;
          asignadosSet.add(bloque.expo.id);
        }
      });

      set({
        bloques: nuevosBloques,
        temasSinAsignar: [],
        temasAsignados: nuevosTemasAsignados,
      });
      console.log("Nuevos bloques generados:", nuevosBloques);
    } catch (error) {
      set({
        bloques: bloques,
        temasSinAsignar: temasSinAsignar,
        temasAsignados: {},
      })
      if (error instanceof Error) {
        console.error(error.message); // ✅ Muestra el mensaje del backend
      } else {
        console.error("Ocurrió un error en el microservicio.");
      }
      //console.error("Error al generar la distribución automática:", error);
    }
  },
}));
