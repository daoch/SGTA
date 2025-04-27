// src/features/advisor-dashboard/hooks/useMyTesistas.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TesistaInfo, CessationRequestPayload } from '../types';
import * as advisorService from '../services/advisorService';
import { useDebounce } from '@/hooks/useDebounce'; // Reutilizar debounce
import { SortConfig } from '@/types';

export const useMyTesistas = () => {
  const [tesistas, setTesistas] = useState<TesistaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<TesistaInfo>>({ key: 'nombreEstudiante', direction: 'asc' }); 
  const [isSubmittingCese, setIsSubmittingCese] = useState(false); // Loading para modal de cese

  // Debounce para búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Carga inicial
  const loadTesistas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await advisorService.fetchMyTesistas();
      setTesistas(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar tesistas."); } 
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadTesistas(); }, [loadTesistas]);

  // Filtrado y Ordenamiento
  const processedTesistas = useMemo(() => {
    let filtered = [...tesistas];
    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.nombreEstudiante.toLowerCase().includes(lowerSearch) ||
        t.codigoEstudiante.toLowerCase().includes(lowerSearch) ||
        t.tituloProyecto.toLowerCase().includes(lowerSearch)
      );
    }
    // Ordenamiento
    if (sortConfig.key) {
        const { key, direction } = sortConfig;
        filtered.sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];
             // Lógica de comparación similar a la tabla de habilitación...
             if (aValue === undefined || bValue === undefined || aValue === null || bValue === null) return 0; 
             if (typeof aValue === 'number' && typeof bValue === 'number') return direction === 'asc' ? aValue - bValue : bValue - aValue;
             if (typeof aValue === 'string' && typeof bValue === 'string') return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
             // Añadir comparación para fechas si es necesario
             // if (aValue instanceof Date && bValue instanceof Date) return ... ;
             return 0;
        });
    }
    return filtered;
  }, [tesistas, debouncedSearchTerm, sortConfig]);

   // Solicitar ordenamiento
   const requestSort = useCallback((key: keyof TesistaInfo) => {
     setSortConfig(prevConfig => {
         let direction: 'asc' | 'desc' = 'asc';
         if (prevConfig.key === key && prevConfig.direction === 'asc') {
             direction = 'desc';
         }
         return { key, direction };
     });
   }, []);

  // Acción: Solicitar Cese
  const requestCessation = useCallback(async (payload: CessationRequestPayload): Promise<boolean> => {
    setIsSubmittingCese(true);
    setError(null);
    try {
      const success = await advisorService.requestCessation(payload);
      if (success) {
        // Actualizar estado local de los tesistas afectados (marcar ceseSolicitado = true)
        // O simplemente recargar la lista para obtener el estado actualizado
         await loadTesistas(); // Recargar es más simple
         return true;
      } else { throw new Error("Fallo en el servicio al solicitar cese."); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al solicitar cese.");
      return false;
    } finally {
      setIsSubmittingCese(false);
    }
  }, [loadTesistas]); // Dependencia de loadTesistas

  return {
    tesistas: processedTesistas, // Lista filtrada/ordenada
    isLoading,
    error,
    setError, // Para limpiar errores desde UI
    searchTerm,
    setSearchTerm,
    sortConfig,
    requestSort,
    requestCessation, // Función para el modal
    isSubmittingCese, // Estado de carga del modal
    refreshTesistas: loadTesistas, // Para botón de recarga
  };
};