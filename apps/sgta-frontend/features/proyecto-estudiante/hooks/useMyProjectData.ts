'use client'

// src/features/student-project/hooks/useMyProjectData.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { MyProjectData } from '../types';
import * as studentProjectService from '../services/studentProjectService'; // Asegúrate de que el servicio esté bien definido

// Definir tipo para el payload de la solicitud de cambio
interface RequestChangePayload {
    motivo: string;
    asesorSugeridoId?: string | null;
}


export const useMyProjectData = () => {
  const [projectData, setProjectData] = useState<MyProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingChange, setIsSubmittingChange] = useState(false); // Para modal de cambio asesor

  // Cargar datos del proyecto
  const loadProjectData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentProjectService.fetchMyActiveProject();
      setProjectData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proyecto.");
      setProjectData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Solicitar cambio de asesor
  const requestAdvisorChange = useCallback(async (payload: RequestChangePayload): Promise<boolean> => {
    if (!projectData?.projectId) {
        setError("No hay un proyecto activo para solicitar el cambio.");
        return false;
    }
    setIsSubmittingChange(true);
    setError(null);
    try {
      const success = await studentProjectService.requestAdvisorChange(
          projectData.projectId, 
          payload.motivo, 
          payload.asesorSugeridoId
      );
      if (success) {
        // Recargar datos para ver el estado actualizado de la solicitud
        await loadProjectData(); 
        return true;
      } else { throw new Error("Fallo en el servicio al solicitar cambio."); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al solicitar cambio de asesor.");
      return false;
    } finally {
      setIsSubmittingChange(false);
    }
  }, [projectData?.projectId, loadProjectData]); // Depender de projectId y loadProjectData

  // Próximos 2-3 hitos/entregables
  const upcomingMilestones = useMemo(() => {
      if (!projectData?.cronograma) return [];
      const today = new Date();
      today.setHours(0,0,0,0);
      return projectData.cronograma
          .filter((m: { estadoEntrega: string; fechaLimite: string | number | Date; }) => m.estadoEntrega === 'pendiente' && new Date(m.fechaLimite) >= today)
          .sort((a: { fechaLimite: string | number | Date; }, b: { fechaLimite: string | number | Date; }) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime())
          .slice(0, 3); // Tomar los próximos 3
  }, [projectData?.cronograma]);


  return {
    projectData,
    isLoading,
    error,
    refreshProjectData: loadProjectData,
    requestAdvisorChange,
    isSubmittingChange,
    upcomingMilestones, // Exponer próximos hitos
  };
};