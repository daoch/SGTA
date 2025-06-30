import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    getAllByCarreraId,
    getAllByCarreraIdAndEtapaFormativa,
    updateCarreraXParametroConfiguracion
} from "../services/configuracion-service";
import { BackStore } from "../types/configuracion.types";

export const useBackStore = create<BackStore>()(
    persist(
        (set, get) => ({
            // Estado inicial
            parametros: [],
            parametrosOriginales: [],
            cargando: false,
            error: null,
            etapaFormativaSeleccionada: null,

            // Acciones para modificar el estado
            setParametros: (parametros) => set({
                parametros,
                parametrosOriginales: JSON.parse(JSON.stringify(parametros)) // Guardamos una copia profunda
            }),

            actualizarParametro: (id, valor) =>
                set((state) => ({
                    parametros: state.parametros.map((param) =>
                        param.id === id ? { ...param, valor } : param
                    ),
                })),

            setEtapaFormativaSeleccionada: (etapaFormativaId) => set({
                etapaFormativaSeleccionada: etapaFormativaId
            }),

            // Funciones para llamadas al backend
            cargarParametros: async (carreraId) => {
                set({ cargando: true, error: null });
                try {
                    const response = await getAllByCarreraId();
                    if (!response) {
                        throw new Error("No se encontraron parámetros para esta carrera");
                    }
                    set({
                        parametros: response,
                        parametrosOriginales: JSON.parse(JSON.stringify(response)), // Guardamos una copia profunda
                        cargando: false
                    });
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false });
                    console.error("Error al cargar parámetros:", error);
                }
            },

            cargarParametrosPorEtapaFormativa: async (etapaFormativaId) => {
                set({ cargando: true, error: null });
                try {
                    const response = await getAllByCarreraIdAndEtapaFormativa(etapaFormativaId || undefined);
                    if (!response) {
                        throw new Error("No se encontraron parámetros para esta etapa formativa");
                    }
                    set({
                        parametros: response,
                        parametrosOriginales: JSON.parse(JSON.stringify(response)), // Guardamos una copia profunda
                        cargando: false
                    });
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false });
                    console.error("Error al cargar parámetros por etapa formativa:", error);
                }
            },

            guardarParametros: async () => {
                set({ cargando: true, error: null });
                try {
                    const parametros = get().parametros;
                    await Promise.all(parametros.map(param => updateCarreraXParametroConfiguracion(param)));
                    // Actualizar los parámetros originales después de guardar
                    set({
                        parametrosOriginales: JSON.parse(JSON.stringify(parametros)),
                        cargando: false
                    });
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false });
                    console.error("Error al guardar parámetros:", error);
                }
            },
        }),
        {
            name: "configuracion-store",
            partialize: (state) => ({
                parametros: state.parametros,
                parametrosOriginales: state.parametrosOriginales,
                etapaFormativaSeleccionada: state.etapaFormativaSeleccionada
            }),
        }
    )
);

