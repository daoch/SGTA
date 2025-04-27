// src/features/dashboard/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '../types'; // Importar la interfaz principal
import * as dashboardService from '../services/dashboardService'; // Importar el servicio

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({}); // Estado para almacenar todos los datos del dashboard
  const [isLoading, setIsLoading] = useState(true); // Estado inicial de carga
  const [error, setError] = useState<string | null>(null); // Estado para errores

  // Función para cargar/recargar los datos del dashboard
  const loadDashboardData = useCallback(async () => {
    console.log("HOOK: Iniciando carga de datos del dashboard..."); // Log para debugging
    setIsLoading(true);
    setError(null); // Limpiar errores previos
    try {
      // Llamar al servicio para obtener los datos
      // El backend debe filtrar y devolver solo los datos relevantes para el usuario autenticado
      const dashboardData = await dashboardService.fetchDashboardData(); 
      setData(dashboardData); // Actualizar estado con los datos recibidos
      console.log("HOOK: Datos del dashboard cargados:", dashboardData); 
    } catch (err) {
      // Manejar errores de la llamada API
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar datos del dashboard.";
      console.error("HOOK: Error cargando datos del dashboard:", err); 
      setError(errorMessage); // Establecer mensaje de error
      setData({}); // Resetear datos en caso de error para evitar mostrar data vieja
    } finally {
      setIsLoading(false); // Finalizar estado de carga
      console.log("HOOK: Carga de datos del dashboard finalizada.");
    }
  }, []); // useCallback sin dependencias externas, la función en sí no cambia

  // Efecto para cargar los datos cuando el hook se monta por primera vez
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]); // La dependencia es la función memoizada loadDashboardData

  // Devolver el estado y la función para recargar manualmente si es necesario
  return {
    dashboardData: data,      // Los datos completos del dashboard
    isLoading,              // Booleano indicando si está cargando
    error,                  // Mensaje de error (string o null)
    refreshDashboard: loadDashboardData, // Función para volver a cargar los datos
  };
};

// No olvides exportar el hook si no lo haces por defecto en tu configuración
// export default useDashboardData; 