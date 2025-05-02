import { QueryClient } from "@tanstack/react-query";

// Configuración para entorno de desarrollo
const developmentConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
};

// Configuración para entorno de producción
const productionConfig = {
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 10, // 10 minutos
      gcTime: 1000 * 60 * 15, // 15 minutos
    },
  },
};

// Selecciona configuración basada en el entorno
const config =
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;

export const queryClient = new QueryClient(config);
