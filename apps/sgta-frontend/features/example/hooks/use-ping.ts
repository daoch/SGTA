import { useQuery } from "@tanstack/react-query";
import { pingServer } from "../services/ping.service";

/**
 * Hook simple para consultar el estado del servidor
 * @returns Resultado de la consulta de ping
 */
export const usePing = () => {
  return useQuery({
    queryKey: ["ping"],
    queryFn: pingServer,
    refetchInterval: 30000, // Refresca cada 30 segundos
    retry: 2,
  });
};
