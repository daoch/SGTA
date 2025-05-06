import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
    getAllByCarreraId, 
    updateCarreraXParametroConfiguracion
} from "../services/configuracion-service"
import { CarreraXParametroConfiguracionDto } from "../dtos/CarreraXParametroConfiguracionDto"

// Definimos la interfaz del store
interface BackStore {
    // Parámetros de back
    parametros: CarreraXParametroConfiguracionDto[]
    cargando: boolean
    error: string | null

    // Acciones
    setParametros: (parametros: CarreraXParametroConfiguracionDto[]) => void
    actualizarParametro: (id: number, valor: any) => void
    actualizarParametroBackend: (id: number, valor: any) => Promise<void>
    
    // Funciones para llamadas al backend
    cargarParametros: (carreraId: number) => Promise<void>
    guardarParametros: () => Promise<void>
}

export const useBackStore = create<BackStore>()(
    persist(
        (set, get) => ({
            // Estado inicial
            parametros: [],
            cargando: false,
            error: null,

            // Acciones para modificar el estado
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

            // Funciones para llamadas al backend
            cargarParametros: async (carreraId) => {
                set({ cargando: true, error: null })
                try {
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
        }),
        {
            name: "sistema-tesis-storage",
            partialize: (state) => ({
                parametros: state.parametros
            }),
        }
    )
)

