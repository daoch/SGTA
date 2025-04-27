// src/features/academic-cycle-settings/services/cycleSettingsService.ts
//import apiClient from '@/lib/api';
import { CicloAcademico, HitoPFC, FechaLimiteCiclo, DeadlineItem } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Data ---
const MOCK_CICLOS: CicloAcademico[] = [
  { id: "2025-2", nombre: "Ciclo 2025-2", estado: 'activo', fechaInicio: '2025-08-18', fechaFin: '2025-12-15' },
  { id: "2026-1", nombre: "Ciclo 2026-1", estado: 'proximo', fechaInicio: '2026-03-16', fechaFin: '2026-07-17' },
  { id: "2025-1", nombre: "Ciclo 2025-1", estado: 'cerrado', fechaInicio: '2025-03-17', fechaFin: '2025-07-18' },
];

const MOCK_HITOS: HitoPFC[] = [
  { id: "insc_tema", nombre: "Inscripción de Tema Límite", etapa: 'General' },
  { id: "plan_t1", nombre: "Entrega Plan Tesis 1", etapa: 'Tesis 1' },
  { id: "avance1_t1", nombre: "Entrega Avance 1 (T1)", etapa: 'Tesis 1' },
  { id: "avance2_t1", nombre: "Entrega Avance 2 (T1)", etapa: 'Tesis 1' },
  { id: "entrega_final_t1", nombre: "Entrega Final Tesis 1", etapa: 'Tesis 1' },
  { id: "avance1_t2", nombre: "Entrega Avance 1 (T2)", etapa: 'Tesis 2' },
  { id: "avance2_t2", nombre: "Entrega Avance 2 (T2)", etapa: 'Tesis 2' },
  { id: "sol_defensa", nombre: "Solicitud de Defensa Límite", etapa: 'Tesis 2' },
  { id: "entrega_final_t2", nombre: "Entrega Final (Versión Sustentación)", etapa: 'Tesis 2' },
];

// Simula las fechas guardadas para cada ciclo y hito
const MOCK_FECHAS: FechaLimiteCiclo[] = [
    { cicloId: "2025-2", hitoId: "insc_tema", fechaLimite: "2025-09-05" },
    { cicloId: "2025-2", hitoId: "plan_t1", fechaLimite: "2025-09-19" },
    { cicloId: "2025-2", hitoId: "avance1_t1", fechaLimite: "2025-10-10" },
    { cicloId: "2025-2", hitoId: "avance2_t1", fechaLimite: null }, // Fecha aún no definida
    { cicloId: "2025-1", hitoId: "insc_tema", fechaLimite: "2025-04-07" }, // Ciclo cerrado
    // ... (más fechas para otros hitos y ciclos)
];
// -------------

/**
 * Obtiene los ciclos académicos disponibles para configuración (Activo y Próximo).
 */
export const fetchAvailableCyclesForConfig = async (): Promise<CicloAcademico[]> => {
  console.log("SERVICE: Fetching available cycles...");
  await apiDelay(300);
  // Lógica real: filtrar desde una lista completa o pedir al backend solo activos/próximos
  // return MOCK_CICLOS.filter(c => c.estado === 'activo' || c.estado === 'proximo');
  // const response = await apiClient.get<CicloAcademico[]>('/api/configuracion/ciclos-configurables');
  // return response.data;
   return MOCK_CICLOS.filter(c => c.estado === 'activo' || c.estado === 'proximo'); // Simulado
};

/**
 * Obtiene los hitos definidos y las fechas límite guardadas para un ciclo específico.
 */
export const fetchDeadlinesForCycle = async (cycleId: string): Promise<DeadlineItem[]> => {
  console.log(`SERVICE: Fetching deadlines for cycle ${cycleId}...`);
  await apiDelay(500);
  // Lógica real:
  // 1. Obtener la lista de hitos definidos (MOCK_HITOS o desde API)
  // 2. Obtener las fechas guardadas para el cycleId (MOCK_FECHAS o desde API)
  // 3. Combinar la información
  // const hitoDefinitions = await fetchHitoDefinitions(); // O usar MOCK_HITOS
  // const savedDates = await apiClient.get<FechaLimiteCiclo[]>(`/api/configuracion/ciclos/${cycleId}/fechas`);
  
  const deadlines: DeadlineItem[] = MOCK_HITOS.map(hito => {
    const fechaGuardada = MOCK_FECHAS.find(f => f.cicloId === cycleId && f.hitoId === hito.id);
    return {
      hitoId: hito.id,
      nombreHito: hito.nombre,
      etapa: hito.etapa,
      fechaLimiteActual: fechaGuardada?.fechaLimite ? new Date(fechaGuardada.fechaLimite + 'T00:00:00') : null, // Asegurar que sea Date object o null
    };
  });

  return deadlines;
};

/**
 * Guarda las fechas límite modificadas para un ciclo.
 * Espera un array de objetos con hitoId y la nueva fechaLimite (puede ser null).
 */
export const saveDeadlinesForCycle = async (
    cycleId: string, 
    updatedDeadlines: Array<{ hitoId: string; fechaLimite: Date | null }>
): Promise<boolean> => {
  console.log(`SERVICE: Saving ${updatedDeadlines.length} deadlines for cycle ${cycleId}...`);
  await apiDelay(1000);
  
  // Formatear fechas a ISO string (YYYY-MM-DD) antes de enviar si es necesario por el backend
  const payload = updatedDeadlines.map(d => ({
      hitoId: d.hitoId,
      // Formato YYYY-MM-DD o null
      fechaLimite: d.fechaLimite ? d.fechaLimite.toISOString().split('T')[0] : null 
  }));
  console.log("Payload to send:", payload);

  // try {
  //     await apiClient.put(`/api/configuracion/ciclos/${cycleId}/fechas`, payload);
  //     return true;
  // } catch (error) {
  //     console.error("Error saving deadlines:", error);
  //     throw new Error("No se pudieron guardar las fechas límite.");
  // }
  return true; // Simular éxito
};

// (Opcional) Función para obtener los detalles (inicio/fin) de un ciclo específico
export const fetchCycleDetails = async (cycleId: string): Promise<CicloAcademico | null> => {
    console.log(`SERVICE: Fetching details for cycle ${cycleId}...`);
    await apiDelay(100);
    // const response = await apiClient.get<CicloAcademico>(`/api/ciclos/${cycleId}`);
    // return response.data;
    return MOCK_CICLOS.find(c => c.id === cycleId) || null; // Simulado
}