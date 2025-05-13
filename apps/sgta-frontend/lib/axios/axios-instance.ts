import { getAuthToken, useAuthStore } from "@/features/auth";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Interceptor para manejo global de peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Zustand store instead of localStorage directly
    const token = getAuthToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para manejo global de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status;      if (status === 401) {
        // Handle unauthorized - logout the user and redirect
        const { logout } = useAuthStore.getState();
        if (typeof logout === "function") {
          logout(); // This will also clean up tokens
        }
        window.location.href = "/login";
      } else if (status === 403) {
        // Manejo de no autorizado
      } else if (status === 404) {
        // Manejo de recurso no encontrado
      } else if (status >= 500) {
        // Manejo de error del servidor
      }
    } else if (error.request) {
      // Error de red - no hubo respuesta
      console.error("Error de red:", error.request);
    } else {
      // Error en la configuración de la petición
      console.error("Error de configuración:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
