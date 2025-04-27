// src/features/academic-cycle-settings/hooks/useCycleDeadlines.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CicloAcademico, DeadlineItem } from '../types';
import * as cycleSettingsService from '../services/cycleSettingsService';

export const useCycleDeadlines = () => {
  const [availableCycles, setAvailableCycles] = useState<CicloAcademico[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [selectedCycleDetails, setSelectedCycleDetails] = useState<CicloAcademico | null>(null);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [initialDeadlines, setInitialDeadlines] = useState<DeadlineItem[]>([]); // Estado inicial para comparación
  const [isLoadingCycles, setIsLoadingCycles] = useState(true);
  const [isLoadingDeadlines, setIsLoadingDeadlines] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ciclos disponibles
  useEffect(() => {
    const loadCycles = async () => {
      setIsLoadingCycles(true);
      setError(null);
      try {
        const cycles = await cycleSettingsService.fetchAvailableCyclesForConfig();
        setAvailableCycles(cycles);
        const activeCycle = cycles.find(c => c.estado === 'activo');
        if (activeCycle) {
          setSelectedCycleId(activeCycle.id);
        } else if (cycles.length > 0) {
          const nextCycle = cycles.find(c => c.estado === 'proximo') || cycles[0];
           setSelectedCycleId(nextCycle.id);
        }
      } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar ciclos."); } 
      finally { setIsLoadingCycles(false); }
    };
    loadCycles();
  }, []); 

  // Cargar deadlines cuando cambia el ciclo
  useEffect(() => {
    if (!selectedCycleId) {
      setDeadlines([]);
      setInitialDeadlines([]);
      setSelectedCycleDetails(null);
      return;
    }
    const loadDeadlines = async () => {
      setIsLoadingDeadlines(true);
      setError(null);
      try {
          const [details, deadlinesData] = await Promise.all([
              cycleSettingsService.fetchCycleDetails(selectedCycleId),
              cycleSettingsService.fetchDeadlinesForCycle(selectedCycleId)
          ]);
          setSelectedCycleDetails(details);
          // --- CORRECCIÓN EN COPIA PROFUNDA ---
          const initialDeadlinesCopy = deadlinesData.map(d => ({
              ...d,
              fechaLimiteActual: d.fechaLimiteActual instanceof Date ? new Date(d.fechaLimiteActual.getTime()) : null 
          }));
          setDeadlines(deadlinesData); // Asegúrate que fetchDeadlinesForCycle devuelve Date | null
          setInitialDeadlines(initialDeadlinesCopy); // Guardar la copia inicial correcta
          // ------------------------------------
      } catch (err) { /* ... manejo de error ... */ setError(err instanceof Error ? err.message : "Error al cargar fechas."); setDeadlines([]); setInitialDeadlines([]); setSelectedCycleDetails(null); } 
      finally { setIsLoadingDeadlines(false); }
    };
    loadDeadlines();
  }, [selectedCycleId]); 

  // Cambiar fecha
  const handleDateChange = useCallback((hitoId: string, newDate: Date | null) => {
    setDeadlines(currentDeadlines =>
      currentDeadlines.map(d =>
        d.hitoId === hitoId ? { ...d, fechaLimiteActual: newDate } : d
      )
    );
  }, []);

  // Guardar cambios
  const saveChanges = useCallback(async (): Promise<boolean> => {
    if (!selectedCycleId) return false;

    // --- CORRECCIÓN EN DETECCIÓN DE CAMBIOS ---
    const changedDeadlines = deadlines.filter((current) => {
        const initial = initialDeadlines.find(init => init.hitoId === current.hitoId);
        if (!initial) return true; // Si no estaba antes, es un cambio (caso raro)
        const currentTime = current.fechaLimiteActual instanceof Date ? current.fechaLimiteActual.getTime() : null;
        const initialTime = initial.fechaLimiteActual instanceof Date ? initial.fechaLimiteActual.getTime() : null;
        return currentTime !== initialTime;
    }).map(d => ({ 
        hitoId: d.hitoId,
        fechaLimite: d.fechaLimiteActual // Pasar Date | null
    }));
    // --------------------------------------

    if (changedDeadlines.length === 0) return true; 

    setIsSaving(true);
    setError(null);
    try {
      const success = await cycleSettingsService.saveDeadlinesForCycle(selectedCycleId, changedDeadlines);
       if (success) {
           // --- CORRECCIÓN TRAS GUARDAR ---
           // Actualizar initialDeadlines para que refleje el estado guardado
           const newInitialDeadlines = deadlines.map(d => ({
               ...d,
               fechaLimiteActual: d.fechaLimiteActual instanceof Date ? new Date(d.fechaLimiteActual.getTime()) : null
           }));
           setInitialDeadlines(newInitialDeadlines);
           // ------------------------------
           return true;
       } else { throw new Error("Fallo al guardar."); }
    } catch (err) { /* ... manejo de error ... */ setError(err instanceof Error ? err.message : "Error al guardar fechas."); return false; } 
    finally { setIsSaving(false); }
  }, [selectedCycleId, deadlines, initialDeadlines]); // Añadir initialDeadlines a dependencias

  // Detectar cambios (Usando la comparación robusta)
  const hasChanges = useMemo(() => {
      if (deadlines.length !== initialDeadlines.length) return true; 
      return deadlines.some((current) => { // Iterar sobre el estado actual
          const initial = initialDeadlines.find(init => init.hitoId === current.hitoId);
          if (!initial) return true; // Si no hay estado inicial correspondiente, es un cambio
          
          const currentTime = current.fechaLimiteActual instanceof Date ? current.fechaLimiteActual.getTime() : null;
          const initialTime = initial.fechaLimiteActual instanceof Date ? initial.fechaLimiteActual.getTime() : null;
          
          return currentTime !== initialTime; 
      });
  }, [deadlines, initialDeadlines]);

  return {
    availableCycles,
    selectedCycleId,
    setSelectedCycleId, 
    selectedCycleDetails, 
    deadlines,          
    handleDateChange,   
    saveChanges,        
    isLoading: isLoadingCycles || isLoadingDeadlines,
    isSaving,           
    error,
    hasChanges          
  };
};