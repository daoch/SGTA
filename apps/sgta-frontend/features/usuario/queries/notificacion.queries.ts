// src/features/usuario/queries/notificacion.queries.ts
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import {
  getMisNotificaciones,
  getCountMisNotificacionesNoLeidas,
  marcarNotificacionComoLeidaApi,
  marcarTodasMisNotificacionesComoLeidasApi,
} from "../services/notificacion.service";
import {
  INotificacionesListProcessed,
  INotificacionesCount,
  INotificacionTransformed,
} from "../types/notificacion.types";

export const notificacionesQueryKeys = {
  all: ["notificaciones"] as const,
  lists: () => [...notificacionesQueryKeys.all, "list"] as const,
  list: (page: number, size: number, soloNoLeidas: boolean) => [...notificacionesQueryKeys.lists(), { page, size, soloNoLeidas }] as const,
  countNoLeidas: () => [...notificacionesQueryKeys.all, "countNoLeidas"] as const,
};

// -----------------------------
// Hook para la LISTA de notificaciones
// -----------------------------
export const useGetMisNotificaciones = (
  page: number,
  size: number,
  soloNoLeidas: boolean = false,
  options?: Omit<
    UseQueryOptions<INotificacionesListProcessed, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<INotificacionesListProcessed, Error> => {
  return useQuery<INotificacionesListProcessed, Error>({
    queryKey: notificacionesQueryKeys.list(page, size, soloNoLeidas),
    queryFn: () => getMisNotificaciones(page, size, soloNoLeidas),
    ...options,
  });
};

// -----------------------------
// Hook para el CONTEO de notificaciones no leídas
// -----------------------------
export const useGetCountMisNotificacionesNoLeidas = (
  options?: Omit<UseQueryOptions<INotificacionesCount, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<INotificacionesCount, Error> => {
  return useQuery<INotificacionesCount, Error>({
    queryKey: notificacionesQueryKeys.countNoLeidas(),
    queryFn: getCountMisNotificacionesNoLeidas,
    refetchInterval: 60_000, // refrescar cada minuto por defecto
    ...options,
  });
};

export const useMarcarNotificacionLeida = (): UseMutationResult<INotificacionTransformed, Error, number> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificacionId: number) => marcarNotificacionComoLeidaApi(notificacionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificacionesQueryKeys.countNoLeidas() });
            queryClient.invalidateQueries({ queryKey: notificacionesQueryKeys.lists() }); // O invalidar la lista específica
        }
    });
};

export const useMarcarTodasLeidas = (): UseMutationResult<{ count: number }, Error, void> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => marcarTodasMisNotificacionesComoLeidasApi(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificacionesQueryKeys.countNoLeidas() });
            queryClient.invalidateQueries({ queryKey: notificacionesQueryKeys.lists() });
        }
    });
};