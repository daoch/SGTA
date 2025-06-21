// src/features/coordinador/queries/reasignacion.queries.ts

import { useQuery, UseQueryResult, keepPreviousData } from "@tanstack/react-query";

// Importar el servicio API relevante

// Importar los tipos relevantes desde el archivo de tipos de reasignación
import {
  IReasignacionesPendientesListProcessed,
  IReasignacionesPendientesSearchCriteria,
} from "@/features/asesores/types/reasignacion.types";
import { getReasignacionesPendientes } from "./coordinador.service";

// --- Claves de Query para Reasignaciones Pendientes del Coordinador ---
export const coordinadorReasignacionesPendientesQueryKeys = {
  all: ["coordinadorReasignacionesPendientes"] as const,
  lists: () => [...coordinadorReasignacionesPendientesQueryKeys.all, "list"] as const,
  list: (criteria: IReasignacionesPendientesSearchCriteria) =>
    [...coordinadorReasignacionesPendientesQueryKeys.lists(), criteria] as const,
};


// --- Hook de Query ---

/**
 * Hook para obtener la lista paginada de solicitudes de cese aprobadas
 * que están pendientes de reasignación de asesor, para el coordinador autenticado.
 */
export const useGetReasignacionesPendientes = (
  searchCriteria: IReasignacionesPendientesSearchCriteria // Contiene page, size, y opcionalmente searchTerm
): UseQueryResult<IReasignacionesPendientesListProcessed, Error> => {
  return useQuery<
    IReasignacionesPendientesListProcessed, // Tipo de datos que devuelve queryFn
    Error,                                  // Tipo del error
    IReasignacionesPendientesListProcessed, // Tipo de datos en 'data' (usualmente el mismo que el primero)
    readonly unknown[]                     // Tipo de la queryKey
  >({
    queryKey: coordinadorReasignacionesPendientesQueryKeys.list(searchCriteria),
    queryFn: () => getReasignacionesPendientes(searchCriteria), // Llama al servicio con todos los criterios
    placeholderData: keepPreviousData, // Mantiene datos anteriores mientras se carga la nueva página/filtros
    // staleTime: 5 * 60 * 1000, // 5 minutos, opcional
    // gcTime: 10 * (60 * 1000), // 10 minutos, opcional
  });
};

// Aquí podrían ir en el futuro hooks de mutación relacionados con acciones
// que el coordinador tome sobre estas reasignaciones pendientes, si es necesario.
// Por ejemplo, si el coordinador pudiera "cancelar una propuesta a un asesor B"
// para luego proponer a un asesor C.