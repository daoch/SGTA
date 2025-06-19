// src/features/asesores/queries/asesorQueries.ts (o donde tengas tus hooks)
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { approveTerminationConsultancyRequest, getAsesorActiveSupervisingTopics, getMyCessationRequests } from "../services/advisor-service"; // Ajusta la ruta al servicio
import { IAsesorTemaActivo, IMyCessationRequestListProcessed, IRequestTerminationConsultancyListSearchCriteria, ISolicitudActualizadaResponse } from "../types/cessation-request"; // Ajusta la ruta a los tipos

// Clave de query para los temas activos del asesor
export const asesorActiveTopicsKeys = {
  all: ["asesorActiveSupervisingTopics"] as const, // 'all' o un nombre más específico si prefieres
};

/**
 * Hook para obtener la lista de temas de tesis activos que el asesor autenticado está supervisando.
 */
export const useAsesorActiveSupervisingTopics = (): UseQueryResult<IAsesorTemaActivo[], Error> => {
  return useQuery<IAsesorTemaActivo[], Error>({
    queryKey: asesorActiveTopicsKeys.all, // Clave de la query
    queryFn: getAsesorActiveSupervisingTopics, // La función que llama al servicio API
    // Opciones adicionales de React Query:
    // staleTime: 5 * 60 * 1000, // 5 minutos, por ejemplo
    // refetchOnWindowFocus: false,
  });
};

export const asesorMyCessationRequestsKeys = {
  all: ["asesorMyCessationRequests"] as const,
  list: (page: number, size: number) => [...asesorMyCessationRequestsKeys.all, { page, size }] as const,
};

export const useMisSolicitudesDeCese = (
  page: number,
  size: number
): UseQueryResult<IMyCessationRequestListProcessed, Error> => {
  return useQuery<IMyCessationRequestListProcessed, Error>({
    queryKey: asesorMyCessationRequestsKeys.list(page, size),
    queryFn: () => getMyCessationRequests(page, size),
    // keepPreviousData: true,
  });
};