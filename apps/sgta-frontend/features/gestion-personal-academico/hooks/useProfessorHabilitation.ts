// src/features/academic-staff-management/hooks/useProfessorHabilitation.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Profesor, SortConfig } from '../types';
import * as academicStaffService from '../services/academicStaffService'; // Importar el servicio

export const useProfessorHabilitation = () => {
  // Estados
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ asesor: 'todos', jurado: 'todos' });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nombre', direction: 'asc' });
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({}); // Loading por profesor/acción

  // Carga inicial de profesores activos
  const loadProfessors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await academicStaffService.fetchActiveProfessorsForManagement();
      setProfesores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar profesores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfessors();
  }, [loadProfessors]);

  // Filtrado y Ordenamiento
  const filteredAndSortedProfessors = useMemo(() => {
    let filtered = [...profesores];
    // Filtros y búsqueda (igual que en el componente de página anterior)
    if (searchTerm) { /* ... lógica de búsqueda ... */ }
    filtered = filtered.filter(p => {
      const asesorMatch = filters.asesor === 'todos' || (filters.asesor === 'si' && p.habilitadoAsesor) || (filters.asesor === 'no' && !p.habilitadoAsesor);
      const juradoMatch = filters.jurado === 'todos' || (filters.jurado === 'si' && p.habilitadoJurado) || (filters.jurado === 'no' && !p.habilitadoJurado);
      return asesorMatch && juradoMatch;
    });
    // Ordenamiento (igual que antes)
    if (sortConfig.key) { /* ... lógica de ordenamiento ... */ }
    return filtered;
  }, [profesores, searchTerm, filters, sortConfig]);

  // Toggle Habilitación Académica
  const toggleHabilitation = useCallback(async (profesorId: string, tipo: 'asesor' | 'jurado', newState: boolean) => {
    setActionLoading(prev => ({ ...prev, [`${profesorId}-${tipo}`]: true })); // Iniciar loading específico
    setError(null);
    try {
      const success = await academicStaffService.updateAcademicHabilitation(profesorId, tipo, newState);
      if (success) {
        // Actualizar estado local si la API tuvo éxito
        setProfesores(prev =>
          prev.map(p =>
            p.id === profesorId
            ? { ...p, [tipo === 'asesor' ? 'habilitadoAsesor' : 'habilitadoJurado']: newState }
            : p
          )
        );
      } else { throw new Error("Fallo en la API de actualización"); }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al actualizar ${tipo}.`);
      // No revertir el toggle visualmente aquí, permitir reintento o mostrar error persistente
    } finally {
      setActionLoading(prev => ({ ...prev, [`${profesorId}-${tipo}`]: false })); // Finalizar loading específico
    }
  }, []); // Sin dependencias que cambien frecuentemente

  // Iniciar Proceso de Cese Académico
  const initiateCessation = useCallback(async (profesorId: string): Promise<boolean> => {
    setActionLoading(prev => ({ ...prev, [`${profesorId}-cese`]: true }));
    setError(null);
    try {
      const success = await academicStaffService.initiateCessationProcess(profesorId);
      if (success) {
        // Actualizar estado local para reflejar inicio de cese
        setProfesores(prev =>
          prev.map(p =>
            p.id === profesorId
            ? { ...p, academicStatus: 'cessation_in_progress', habilitadoAsesor: true } // Marcar y mantener habilitado visualmente hasta reasignar
            : p
          )
        );
        return true; // Indicar éxito para cerrar modal
      } else { throw new Error("Fallo en la API de inicio de cese"); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar proceso de cese.");
      return false; // Indicar fallo
    } finally {
       setActionLoading(prev => ({ ...prev, [`${profesorId}-cese`]: false }));
    }
  }, []);

  // Solicitar ordenamiento
  const requestSort = useCallback((key: keyof Profesor) => {
    setSortConfig(prevConfig => {
        let direction: 'asc' | 'desc' = 'asc';
        if (prevConfig.key === key && prevConfig.direction === 'asc') {
            direction = 'desc';
        }
        return { key, direction };
    });
   }, []);

   
   const executeBulkAction = useCallback(async (
    profesorIds: string[],
    action: 'habilitar_asesor' | 'deshabilitar_asesor' | 'habilitar_jurado' | 'deshabilitar_jurado'
  ) => {
    if (profesorIds.length === 0) return false;
    
    setError(null);
    
    try {
      // Determinar el tipo y nuevo estado basado en la acción
      const tipo = action.includes('asesor') ? 'asesor' : 'jurado';
      const newState = action.includes('habilitar');
      
      // En un entorno real, esta llamada iría a la API
      const success = await academicStaffService.bulkUpdateHabilitation(profesorIds, tipo, newState);
      
      if (success) {
        // Actualizar estado local
        setProfesores(prev => prev.map(p => {
          if (profesorIds.includes(p.id)) {
            // Para deshabilitar asesor con tesis, iniciamos proceso de cese
            if (
              tipo === 'asesor' && 
              !newState && 
              p.habilitadoAsesor && 
              p.numTesis > 0 &&
              p.academicStatus !== 'cessation_in_progress'
            ) {
              return { ...p, academicStatus: 'cessation_in_progress' };
            }
            
            // Para otros casos, simplemente actualizamos el estado
            if (tipo === 'asesor') {
              return { ...p, habilitadoAsesor: newState };
            } else {
              return { ...p, habilitadoJurado: newState };
            }
          }
          return p;
        }));
        
        return true;
      } else {
        setError(`Error al actualizar habilitaciones masivas. Intente nuevamente.`);
        return false;
      }
    } catch (err) {
      setError(`Error inesperado en acción masiva. Intente nuevamente.`);
      console.error("Error executing bulk action:", err);
      return false;
    }
  }, []);

  return {
    profesores: filteredAndSortedProfessors, // Exponer la lista procesada
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    requestSort,
    toggleHabilitation,
    initiateCessation,
    executeBulkAction,
    actionLoading, // Objeto de loading por acción
    originalProfessorCount: profesores.length // Para mostrar total vs filtrado
  };
};