// src/features/academic-staff-search/hooks/useAdvisorDirectory.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AsesorInfo, AreaTematica, AdvisorFilters } from '../types';
import * as advisorDirectoryService from '../services/advisorDirectoryService';
import { useDebounce } from '@/hooks/useDebounce'; // Asumiendo un hook de debounce global

export const useAdvisorDirectory = () => {
  const [advisors, setAdvisors] = useState<AsesorInfo[]>([]);
  const [areas, setAreas] = useState<AreaTematica[]>([]);
  const [filters, setFilters] = useState<AdvisorFilters>({ searchTerm: '', areaTematicaId: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce para la búsqueda
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 400); // 400ms delay

  // Cargar áreas para el filtro una vez
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const areasData = await advisorDirectoryService.fetchFilterAreas();
        setAreas(areasData);
      } catch (err) {
        console.error("Error loading filter areas:", err);
        // Podrías setear un error específico para las áreas si es necesario
      }
    };
    loadAreas();
  }, []);

  // Cargar asesores basado en filtros (con debounce en searchTerm)
  const loadAdvisors = useCallback(async (currentFilters: AdvisorFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      // Pasar solo los filtros necesarios al servicio
      const apiFilters = {
          searchTerm: currentFilters.searchTerm || undefined, // Enviar undefined si está vacío
          areaId: currentFilters.areaTematicaId || undefined,
      }
      const advisorsData = await advisorDirectoryService.fetchAdvisorsDirectory(apiFilters);
      setAdvisors(advisorsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar asesores.");
      setAdvisors([]); // Limpiar resultados en caso de error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto que reacciona a los cambios en los filtros (con debounce)
  useEffect(() => {
      // Creamos un objeto de filtros efectivo para la llamada API
      const effectiveFilters = { ...filters, searchTerm: debouncedSearchTerm };
      loadAdvisors(effectiveFilters);
  }, [debouncedSearchTerm, filters.areaTematicaId, loadAdvisors]); // Dependencias: término debounced y filtro de área

  // Funciones para actualizar filtros desde la UI
  const handleSearchChange = useCallback((term: string) => {
      setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const handleAreaChange = useCallback((areaId: string | null) => {
      setFilters(prev => ({ ...prev, areaTematicaId: areaId }));
  }, []);

  return {
    advisors,
    areas, // Para el filtro
    filters,
    handleSearchChange,
    handleAreaChange,
    isLoading,
    error,
    refreshAdvisors: () => loadAdvisors(filters), // Función para recarga manual
  };
};