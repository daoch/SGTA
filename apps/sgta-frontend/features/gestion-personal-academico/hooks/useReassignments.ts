// src/features/academic-staff-management/hooks/useReassignments.ts
import { useState, useEffect, useCallback } from 'react';
import { ProyectoReasignacion, Asesor } from '../types';
import * as reassignmentService from '../services/reassignmentService'; // Importar el servicio

export const useReassignments = () => {
  // --- Estado Interno del Hook ---
  const [pendingProjects, setPendingProjects] = useState<ProyectoReasignacion[]>([]);
  const [availableAdvisors, setAvailableAdvisors] = useState<Asesor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Datos ---
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Cargar proyectos y asesores en paralelo
      const [projectsData, advisorsData] = await Promise.all([
        reassignmentService.fetchPendingReassignments(),
        reassignmentService.fetchAvailableAdvisors()
      ]);
      setPendingProjects(projectsData);
      setAvailableAdvisors(advisorsData);
    } catch (err) {
      console.error("Failed to load reassignment data:", err);
      // Asegúrate de que err sea un Error o tenga una propiedad message
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido al cargar los datos.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias, se llama una vez

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Acción de Reasignación ---
  const reassignProject = useCallback(async (proyectoId: string, nuevoAsesorId: string): Promise<boolean> => {
    setError(null); // Limpiar errores previos
    try {
      const success = await reassignmentService.reassignProjectAdvisor(proyectoId, nuevoAsesorId);
      if (success) {
        // Si la API fue exitosa, actualizar estado local o recargar
        // Opción 1: Recargar todo (más simple si hay efectos secundarios complejos)
        await loadData(); 
        // Opción 2: Actualizar estado local (más rápido, pero más complejo de mantener)
        // setPendingProjects(prev => prev.filter(p => p.id !== proyectoId));
        // setAvailableAdvisors(prev => prev.map(a => a.id === nuevoAsesorId ? {...a, cargaActual: a.cargaActual + 1} : a));
        return true;
      }
      return false; // Si el servicio retorna false explícitamente
    } catch (err) {
      console.error(`Error reassigning project ${proyectoId} in hook:`, err);
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error al intentar reasignar.";
      setError(errorMessage); // Establecer mensaje de error
      return false; // Indicar fallo
    }
    // No necesitamos isSubmitting aquí, se maneja en el componente del modal
  }, [loadData]); // Dependencia de loadData si se usa para recargar

  // --- Devolver Estado y Acciones ---
  return {
    pendingProjects,    // Lista de proyectos pendientes
    availableAdvisors,  // Lista de asesores disponibles para el modal
    isLoading,          // Estado de carga inicial
    error,              // Mensaje de error
    reassignProject,    // Función para ejecutar la reasignación
    refreshData: loadData // Función para recargar datos si es necesario
  };
};