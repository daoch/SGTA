// src/features/academic-staff-management/hooks/useAcademicStaffHub.ts
import { useState, useEffect, useCallback } from 'react';
// Importar tipos si son necesarios
// import { ... } from '../types'; 
// Importar servicios si las estadísticas vienen de llamadas separadas
// import * as statsService from '../services/statsService'; 

// Interfaz para los datos del Hub
interface HubData {
  totalProfesores?: number;
  habilitadosAsesorar?: number;
  habilitadosJurado?: number;
  solicitudesPendientes?: number;
  tesisPendientesReasignacion?: number;
}

export const useAcademicStaffHub = () => {
  const [hubData, setHubData] = useState<HubData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHubData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // --- INICIO SIMULACIÓN API ---
      // En una app real, harías una o varias llamadas API aquí
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const mockData: HubData = {
        totalProfesores: 127,
        habilitadosAsesorar: 98,
        habilitadosJurado: 112,
        solicitudesPendientes: 5,
        tesisPendientesReasignacion: 3
      };
      // --- FIN SIMULACIÓN API ---
      // const data = await statsService.getHubStats(); // Llamada real
      setHubData(mockData); 
    } catch (err) {
      console.error("Error fetching Hub data:", err);
      const message = err instanceof Error ? err.message : "Error al cargar datos del panel.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHubData();
  }, [loadHubData]);

  return { 
    hubData, 
    isLoading, 
    error, 
    refreshHubData: loadHubData // Para recargar si es necesario
  };
};