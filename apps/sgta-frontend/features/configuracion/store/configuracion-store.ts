// import { create } from "zustand";
// import { ParametrosState, Parametro } from "../types/configuracion.types";
// import { getAllByCarreraId } from "../services/configuracion-service";

// const initialState: ParametrosState = {
//     parametros: [],
//     isLoading: false,
//     error: null,
//     fetchParametros: async () => { },
//     updateParametro: () => { }, // Inicialmente no hace nada
//     clearError: () => { },
// };

// export const useParametrosStore = create<ParametrosState>((set, get) => ({
//     ...initialState,

//     fetchParametros: async () => {
//         set({ isLoading: true, error: null });
//         try {
//             const data = await getAllByCarreraId(1);
//             set({ parametros: data, isLoading: false });
//         } catch (error) {
//             set({ error: "Error al obtener los parámetros.", isLoading: false });
//         }
//     },

//     updateParametro: async (id: string, nuevoValor: string) => {
//         try {
//             // 1. Actualiza en backend
//             const response = await fetch(`/api/parametros/${id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ valor: nuevoValor }),
//             });

//             if (!response.ok) {
//                 throw new Error("Error al actualizar el parámetro en el backend");
//             }

//             // 2. Si todo sale bien, actualiza el estado local
//             set((state) => ({
//                 parametros: state.parametros.map((parametro) =>
//                     parametro.id === id ? { ...parametro, valor: nuevoValor } : parametro
//                 ),
//             }));
//         } catch (error) {
//             set({ error: "No se pudo actualizar el parámetro." });
//         }
//     },

//     clearError: () => {
//         set({ error: null });
//     },
// }));