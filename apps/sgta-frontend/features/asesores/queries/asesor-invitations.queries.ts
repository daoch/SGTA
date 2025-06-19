// src/features/asesores/queries/asesor-invitations.queries.ts

import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
  keepPreviousData, // <<--- IMPORTAR ESTO
} from "@tanstack/react-query";

// Importar los servicios API relevantes
import {
  getMisInvitacionesDeAsesoria,
  acceptInvitacionAsesoria,
  rejectInvitacionAsesoria,
} from "../services/advisor-service"; // Ajusta la ruta a tu archivo de servicios del asesor

// Importar los tipos relevantes desde el archivo de tipos de invitaciones
import {
  IInvitacionesAsesoriaListProcessed,
  IInvitacionesAsesoriaSearchCriteria,
  IRechazarPropuestaPayload,
  // IAccionInvitacionResponse, // Si tus mutaciones devolvieran un DTO de respuesta específico
} from "../types/asesor-invitations.types"; // Ajusta la ruta

// --- Claves de Query para Invitaciones de Asesoría ---
export const asesorInvitationsQueryKeys = {
  all: ["asesorReceivedInvitations"] as const, // Clave más específica para este dominio
  lists: () => [...asesorInvitationsQueryKeys.all, "list"] as const,
  list: (criteria: IInvitacionesAsesoriaSearchCriteria) =>
    [...asesorInvitationsQueryKeys.lists(), criteria] as const,
  // Podrías añadir claves para detalles si fuera necesario, aunque aquí parece que no
  // detail: (invitationId: number) => [...asesorInvitationsQueryKeys.all, "detail", invitationId] as const,
};


// --- Hooks de Query ---

/**
 * Hook para obtener la lista paginada de invitaciones de asesoría
 * pendientes para el asesor autenticado.
 */
export const useGetMisInvitacionesDeAsesoria = (
  searchCriteria: IInvitacionesAsesoriaSearchCriteria
): UseQueryResult<IInvitacionesAsesoriaListProcessed, Error> => {
  return useQuery<IInvitacionesAsesoriaListProcessed, Error, IInvitacionesAsesoriaListProcessed, readonly unknown[]>({
    queryKey: asesorInvitationsQueryKeys.list(searchCriteria),
    queryFn: () => getMisInvitacionesDeAsesoria(searchCriteria.page, searchCriteria.size),
    placeholderData: keepPreviousData, 
    // staleTime: 5 * 60 * 1000,
  });
};


// --- Hooks de Mutación ---

/**
 * Hook para la mutación de ACEPTAR una invitación de asesoría.
 * @param solicitudOriginalId El ID de la Solicitud de cese original que generó esta propuesta.
 */
export const useAcceptInvitacionAsesoria = (): UseMutationResult<
  void,           // El servicio API devuelve Promise<void>
  Error,          // Tipo del error
  number,         // Variables de la mutación: solicitudOriginalId (number)
  unknown         // Contexto
> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (solicitudOriginalId) => acceptInvitacionAsesoria(solicitudOriginalId),
    onSuccess: (data, solicitudOriginalId) => {
      // Invalidar la lista de invitaciones para que se actualice
      queryClient.invalidateQueries({ queryKey: asesorInvitationsQueryKeys.lists() });
      // También podrías querer invalidar la lista de temas activos del asesor,
      // ya que ahora tendrá un nuevo tema.
      // queryClient.invalidateQueries({ queryKey: asesorActiveTopicsKeys.all }); // Si tienes esta clave definida en otro lado
      console.log(`Invitación ID ${solicitudOriginalId} aceptada exitosamente.`);
      // toast.success("Asesoría aceptada con éxito.");
    },
    onError: (error, solicitudOriginalId) => {
      console.error(`Error al aceptar invitación ID ${solicitudOriginalId}:`, error);
      // toast.error(`Error al aceptar la asesoría: ${error.message}`);
    },
  });
};

/**
 * Hook para la mutación de RECHAZAR una invitación de asesoría.
 * @param solicitudOriginalId El ID de la Solicitud de cese original.
 * @param payload Contiene el motivo del rechazo.
 */
export const useRejectInvitacionAsesoria = (): UseMutationResult<
  void,                                // El servicio API devuelve Promise<void>
  Error,                               // Tipo del error
  { solicitudOriginalId: number; payload: IRechazarPropuestaPayload }, // Variables
  unknown                              // Contexto
> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { solicitudOriginalId: number; payload: IRechazarPropuestaPayload }>({
    mutationFn: ({ solicitudOriginalId, payload }) => rejectInvitacionAsesoria(solicitudOriginalId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: asesorInvitationsQueryKeys.lists() });
      console.log(`Invitación ID ${variables.solicitudOriginalId} rechazada exitosamente.`);
      // toast.info("Invitación de asesoría rechazada.");
    },
    onError: (error, variables) => {
      console.error(`Error al rechazar invitación ID ${variables.solicitudOriginalId}:`, error);
      // toast.error(`Error al rechazar la asesoría: ${error.message}`);
    },
  });
};