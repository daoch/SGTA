// src/features/configuracion-academica/hooks/useAreasTematicas.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AreaTematica, AreaTematicaFormValues } from '../types';
import * as areasTematicasService from '../services/areasTematicasService';

export const useAreasTematicas = () => {
  // Estados
  const [areas, setAreas] = useState<AreaTematica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Para modales de C/U/D

  // Carga inicial
  const loadAreas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await areasTematicasService.fetchAreasTematicas();
      setAreas(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar áreas."); } 
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadAreas(); }, [loadAreas]);

  // Filtrado y Ordenamiento
  const filteredAreas = useMemo(() => {
    let filtered = [...areas];
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.nombre.toLowerCase().includes(lowerSearchTerm) ||
        a.descripcion.toLowerCase().includes(lowerSearchTerm)
      );
    }
    // Ordenar alfabéticamente por nombre
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return filtered;
  }, [areas, searchTerm]);

  // Acciones CRUD
  const addArea = useCallback(async (newAreaData: AreaTematicaFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const nuevaArea = await areasTematicasService.createAreaTematica(newAreaData);
      setAreas(prev => [...prev, nuevaArea].sort((a, b) => a.nombre.localeCompare(b.nombre))); // Añadir y reordenar
      return true;
    } catch (err) { setError(err instanceof Error ? err.message : "Error al crear área."); return false; } 
    finally { setIsSubmitting(false); }
  }, []);

  const updateArea = useCallback(async (areaId: string, updatedData: AreaTematicaFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const areaActualizada = await areasTematicasService.updateAreaTematica(areaId, updatedData);
      setAreas(prev => prev.map(a => a.id === areaId ? areaActualizada : a).sort((a, b) => a.nombre.localeCompare(b.nombre)));
      return true;
    } catch (err) { setError(err instanceof Error ? err.message : "Error al actualizar área."); return false; } 
    finally { setIsSubmitting(false); }
  }, []);

  const deleteArea = useCallback(async (areaId: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await areasTematicasService.deleteAreaTematica(areaId);
      setAreas(prev => prev.filter(a => a.id !== areaId)); // Eliminar del estado local
      return true;
    } catch (err) { setError(err instanceof Error ? err.message : "Error al eliminar área."); return false; } 
    finally { setIsSubmitting(false); }
  }, []);

  return {
    areas: filteredAreas, // Exponer lista filtrada/ordenada
    isLoading,
    error,
    setError, // Para limpiar errores desde la UI si es necesario
    searchTerm,
    setSearchTerm,
    isSubmitting, // Para los modales
    addArea,
    updateArea,
    deleteArea,
    refreshAreas: loadAreas, // Función para recargar
  };
};