import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getAllByCarreraId, updateCarreraXParametroConfiguracion } from "../services/configuracion-service"
import { CarreraXParametroConfiguracionDto } from "../dtos/CarreraXParametroConfiguracionDto"

// Definimos los tipos para nuestros parámetros de back
export interface AreaType {
    id: number
    nombre: string
    subAreas: string[]
}

// Definimos la interfaz del store
interface BackStore {
    // Parámetros de back
    areas: AreaType[]
    parametros: CarreraXParametroConfiguracionDto[]
    cargando: boolean
    error: string | null

    // Acciones
    setAreas: (areas: AreaType[]) => void
    setParametros: (parametros: CarreraXParametroConfiguracionDto[]) => void
    actualizarParametro: (id: number, valor: any) => void
    actualizarParametroBackend: (id: number, valor: any) => Promise<void>
    agregarArea: (area: AreaType) => void
    eliminarArea: (id: number) => void
    agregarSubArea: (areaId: number, subArea: string) => void
    eliminarSubArea: (areaId: number, subAreaIndex: number) => void

    // Funciones para llamadas al backend
    cargarAreas: () => Promise<void>
    cargarParametros: (carreraId: number) => Promise<void>
    guardarAreas: () => Promise<void>
    guardarParametros: () => Promise<void>
}


export const useBackStore = create<BackStore>()(
    persist(
        (set, get) => ({
            // Estado inicial
            areas: [],
            parametros: [],
            cargando: false,
            error: null,

            // Acciones para modificar el estado
            setAreas: (areas) => set({ areas }),
            setParametros: (parametros) => set({ parametros }),
            actualizarParametro: (id, valor) =>
                set((state) => ({
                    parametros: state.parametros.map((param) => (param.id === id ? { ...param, valor } : param)),
                })),

            actualizarParametroBackend: async (id: number, valor: any) => {
                set({ cargando: true, error: null });
                try {
                    // Obtener el parámetro actual del estado
                    const parametro = get().parametros.find((p) => p.id === id);
                    if (!parametro) {
                        throw new Error("Parámetro no encontrado");
                    }

                    // Crear el DTO para enviar al backend
                    const dto: CarreraXParametroConfiguracionDto = {
                        ...parametro,
                        valor, // Actualizamos el valor
                    };

                    // Llamar al servicio para actualizar el parámetro
                    await updateCarreraXParametroConfiguracion(dto);

                    // Actualizar el estado local
                    set((state) => ({
                        parametros: state.parametros.map((param) =>
                            param.id === id ? { ...param, valor } : param
                        ),
                        cargando: false,
                    }));
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : "Error desconocido",
                        cargando: false,
                    });
                    console.error("Error al actualizar el parámetro:", error);
                }
            },

            agregarArea: (area) =>
                set((state) => ({
                    areas: [...state.areas, area],
                })),
            eliminarArea: (id) =>
                set((state) => ({
                    areas: state.areas.filter((area) => area.id !== id),
                })),
            agregarSubArea: (areaId, subArea) =>
                set((state) => ({
                    areas: state.areas.map((area) =>
                        area.id === areaId ? { ...area, subAreas: [...area.subAreas, subArea] } : area,
                    ),
                })),
            eliminarSubArea: (areaId, subAreaIndex) =>
                set((state) => ({
                    areas: state.areas.map((area) =>
                        area.id === areaId
                            ? { ...area, subAreas: area.subAreas.filter((_, index) => index !== subAreaIndex) }
                            : area,
                    ),
                })),

            // Funciones para llamadas al backend
            cargarAreas: async () => {
                set({ cargando: true, error: null })
                try {
                    // Simulamos una llamada al backend
                    // En un caso real, aquí harías un fetch a tu API
                    const response = await fetch("/api/areas")

                    if (!response.ok) {
                        throw new Error("Error al cargar áreas")
                    }

                    const data = await response.json()

                    // Guardamos los parámetros de back en el store
                    set({ areas: data, cargando: false })
                    return data
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false })
                    console.error("Error al cargar áreas:", error)
                }
            },

            cargarParametros: async (carreraId) => {
                set({ cargando: true, error: null })
                try {
                    //console.log("Cargando parámetros para la carrera:", carreraId)
                    const response = await getAllByCarreraId(carreraId)
                    if (!response) {
                        throw new Error("No se encontraron parámetros para esta carrera")
                    }
                    set({ parametros: response, cargando: false })

                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false })
                    console.error("Error al cargar parámetros:", error)
                }
            },

            guardarAreas: async () => {
                set({ cargando: true, error: null })
                try {
                    const areas = get().areas

                    // Simulamos una llamada al backend
                    const response = await fetch("/api/areas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(areas),
                    })

                    if (!response.ok) {
                        throw new Error("Error al guardar áreas")
                    }

                    set({ cargando: false })

                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false })
                    console.error("Error al guardar áreas:", error)

                }
            },

            guardarParametros: async () => {
                set({ cargando: true, error: null })
                try {
                    const parametros = get().parametros
                    await Promise.all(parametros.map(param => updateCarreraXParametroConfiguracion(param)));
                    set({ cargando: false })
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : "Error desconocido", cargando: false })
                    console.error("Error al guardar parámetros:", error)
                }
            },
        }
        ),
        {
            name: "sistema-tesis-storage", // nombre para localStorage
            partialize: (state) => ({
                areas: state.areas,
                parametros: state.parametros,

            }), // solo persistimos estos datos
        },

    )
)
