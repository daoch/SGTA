// src/features/configuracion-academica/services/cronogramaConfigService.ts
//import apiClient from '@/lib/api';
import { Hito, CronogramaPlantilla, CursoType, EstadoCronograma } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- DATOS MOCK COMPLETOS ---

// ESTADOS POR CICLO Y CURSO
export const MOCK_ESTADOS: { [cicloId: string]: { [curso in CursoType]?: EstadoCronograma } } = {
  '2023-1': { PFC1: { estado: 'ARCHIVADO', fechaPublicacion: '2022-12-15T10:00:00Z' }, PFC2: { estado: 'ARCHIVADO', fechaPublicacion: '2022-12-15T10:00:00Z' } },
  '2023-2': { PFC1: { estado: 'ARCHIVADO', fechaPublicacion: '2023-06-20T10:00:00Z' }, PFC2: { estado: 'ARCHIVADO', fechaPublicacion: '2023-06-20T10:00:00Z' } },
  '2024-1': { PFC1: { estado: 'ARCHIVADO', fechaPublicacion: '2023-12-18T10:00:00Z' }, PFC2: { estado: 'ARCHIVADO', fechaPublicacion: '2023-12-18T10:00:00Z' } },
  '2024-2': { PFC1: { estado: 'PUBLICADO', fechaPublicacion: '2024-06-10T10:00:00Z' }, PFC2: { estado: 'PUBLICADO', fechaPublicacion: '2024-06-10T10:00:00Z' } },
  '2025-1': { PFC1: { estado: 'BORRADOR', fechaPublicacion: null }, PFC2: { estado: 'NO_CREADO', fechaPublicacion: null } },
  // 2025-2 no existe aún, simulará NO_CREADO
};

// HITOS PARA PFC 1
export const MOCK_HITOS_PFC1: { [cicloId: string]: Hito[] } = {
  '2023-1': [ /* Podrías tener datos históricos aquí si son diferentes */ ],
  '2023-2': [ /* ... */ ],
  '2024-1': [
    { id: 'p1-241-1', orden: 1, tipo: 'Entregable', nombre: 'Cronograma de trabajo del curso', descripcion: 'Definición del cronograma de trabajo con el asesor', semana: 1, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-241-2', orden: 2, tipo: 'Exposición', nombre: 'Exposición de tema, cronograma y estado de avance', descripcion: 'Presentación inicial', semana: 2, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-241-3', orden: 3, tipo: 'Entregable', nombre: 'E1: Problemática, estado del arte, objetivos y resultados esperados', descripcion: 'Primer entregable formal del curso', semana: 4, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-241-4', orden: 4, tipo: 'Exposición', nombre: 'Exposición de avance 1', descripcion: 'Primera exposición de avance del proyecto', semana: 5, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-241-5', orden: 5, tipo: 'Exposición', nombre: 'Exposición de avance 2', descripcion: 'Segunda exposición de avance del proyecto', semana: 6, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-241-6', orden: 6, tipo: 'Exposición', nombre: 'Exposición de avance 3', descripcion: 'Tercera exposición de avance del proyecto', semana: 7, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-241-7', orden: 7, tipo: 'Entregable', nombre: 'E2: Levantamiento de observaciones del E1, marco conceptual/teórico/legal', descripcion: 'Segundo entregable formal del curso', semana: 8, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-241-8', orden: 8, tipo: 'Exposición', nombre: 'Exposición de avance 4', descripcion: 'Cuarta exposición de avance del proyecto', semana: 10, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-241-9', orden: 9, tipo: 'Exposición', nombre: 'Exposición de avance 5', descripcion: 'Quinta exposición de avance del proyecto', semana: 12, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-241-10', orden: 10, tipo: 'Entregable', nombre: 'E3: Proyecto de fin de carrera completo', descripcion: 'Entregable final con todas las correcciones y el Anexo de Plan de Proyectos', semana: 13, requiereAsesor: true, requiereJurado: true },
    { id: 'p1-241-11', orden: 11, tipo: 'Exposición', nombre: 'Exposición final', descripcion: 'Presentación final ante el jurado', semana: 15, requiereAsesor: true, requiereJurado: true },
  ],
  // Datos para ciclo publicado y base para copia
  '2024-2': [
    { id: 'p1-242-1', orden: 1, tipo: 'Entregable', nombre: 'Plan de Trabajo Detallado', descripcion: 'Cronograma validado por el asesor.', semana: 2, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-242-2', orden: 2, tipo: 'Exposición', nombre: 'EXPO 1: Presentación Tema y Plan', descripcion: 'Exposición inicial ante compañeros y potencialmente profesores.', semana: 3, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-242-3', orden: 3, tipo: 'Entregable', nombre: 'E1: Problema, Objetivos, Estado del Arte', descripcion: 'Capítulos iniciales del documento.', semana: 5, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-242-4', orden: 4, tipo: 'Exposición', nombre: 'EXPO 2: Avance y Feedback', descripcion: 'Presentación de avances y recepción de comentarios.', semana: 7, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-242-5', orden: 5, tipo: 'Entregable', nombre: 'E2: Marco Teórico/Conceptual y Metodología', descripcion: 'Sección metodológica y fundamentos.', semana: 9, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-242-6', orden: 6, tipo: 'Exposición', nombre: 'EXPO 3: Avance Final T1', descripcion: 'Presentación del estado final del trabajo en Tesis 1.', semana: 13, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-242-7', orden: 7, tipo: 'Entregable', nombre: 'E3: Documento Final Tesis 1', descripcion: 'Versión completa integrando correcciones. Incluye Plan para Tesis 2.', semana: 15, requiereAsesor: true, requiereJurado: true }, // Jurado revisa para nota final T1
  ],
  // Datos para ciclo en borrador (podrían ser iguales a 2024-2 inicialmente)
  '2025-1': [
    { id: 'p1-251-1', orden: 1, tipo: 'Entregable', nombre: 'Plan de Trabajo Detallado', descripcion: 'Cronograma validado por el asesor.', semana: 2, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-251-2', orden: 2, tipo: 'Exposición', nombre: 'EXPO 1: Presentación Tema y Plan', descripcion: 'Exposición inicial.', semana: 3, requiereAsesor: false, requiereJurado: false },
    { id: 'p1-251-3', orden: 3, tipo: 'Entregable', nombre: 'E1: Problema, Objetivos, Estado del Arte', descripcion: 'Capítulos iniciales.', semana: 5, requiereAsesor: true, requiereJurado: false },
    // ... potencialmente añadir o quitar hitos en el borrador ...
    { id: 'p1-251-5', orden: 4, tipo: 'Entregable', nombre: 'E2: Marco Teórico/Conceptual y Metodología', descripcion: 'Sección metodológica.', semana: 9, requiereAsesor: true, requiereJurado: false },
    { id: 'p1-251-7', orden: 5, tipo: 'Entregable', nombre: 'E3: Documento Final Tesis 1', descripcion: 'Versión completa.', semana: 15, requiereAsesor: true, requiereJurado: true },
  ],
};

// HITOS PARA PFC 2
export const MOCK_HITOS_PFC2: { [cicloId: string]: Hito[] } = {
    '2023-1': [ /* ... */ ],
    '2023-2': [ /* ... */ ],
    '2024-1': [ /* ... */ ],
    // Datos para ciclo publicado y base para copia
    '2024-2': [
        { id: 'p2-242-1', orden: 1, tipo: 'Entregable', nombre: 'E0: Documento T1 y Plan T2 Actualizado', descripcion: 'Documento base con plan detallado para Tesis 2.', semana: 1, requiereAsesor: true, requiereJurado: false },
        { id: 'p2-242-2', orden: 2, tipo: 'Exposición', nombre: 'EXPO Avance Inicial T2', descripcion: 'Presentación del plan y primeros avances.', semana: 2, requiereAsesor: false, requiereJurado: false },
        { id: 'p2-242-3', orden: 3, tipo: 'Entregable', nombre: 'E1: Desarrollo/Resultados Parciales', descripcion: 'Primeros resultados o desarrollo significativo.', semana: 6, requiereAsesor: true, requiereJurado: false },
        { id: 'p2-242-4', orden: 4, tipo: 'Exposición', nombre: 'EXPO Avance Intermedio T2', descripcion: 'Presentación con foco en resultados.', semana: 8, requiereAsesor: false, requiereJurado: false },
        { id: 'p2-242-5', orden: 5, tipo: 'Entregable', nombre: 'E2: Borrador Completo (Resultados y Discusión)', descripcion: 'Documento casi final incluyendo análisis.', semana: 12, requiereAsesor: true, requiereJurado: true }, // Revisión jurado pre-sustentación
        { id: 'p2-242-6', orden: 6, tipo: 'Entregable', nombre: 'E3: Versión Final (Sustentación)', descripcion: 'Documento final listo para la defensa.', semana: 15, requiereAsesor: true, requiereJurado: true },
        { id: 'p2-242-7', orden: 7, tipo: 'Exposición', nombre: 'Sustentación Final', descripcion: 'Defensa del Proyecto de Fin de Carrera.', semana: 16, requiereAsesor: true, requiereJurado: true },
    ],
    // Datos para ciclo en borrador
    '2025-1': [
        { id: 'p2-251-1', orden: 1, tipo: 'Entregable', nombre: 'E0: Documento T1 y Plan T2 Actualizado', descripcion: 'Documento base.', semana: 1, requiereAsesor: true, requiereJurado: false },
        { id: 'p2-251-3', orden: 2, tipo: 'Entregable', nombre: 'E1: Desarrollo/Resultados Parciales', descripcion: 'Primeros resultados.', semana: 6, requiereAsesor: true, requiereJurado: false },
        { id: 'p2-251-5', orden: 3, tipo: 'Entregable', nombre: 'E2: Borrador Completo (Resultados y Discusión)', descripcion: 'Documento casi final.', semana: 12, requiereAsesor: true, requiereJurado: true },
        { id: 'p2-251-6', orden: 4, tipo: 'Entregable', nombre: 'E3: Versión Final (Sustentación)', descripcion: 'Documento final.', semana: 15, requiereAsesor: true, requiereJurado: true },
        { id: 'p2-251-7', orden: 5, tipo: 'Exposición', nombre: 'Sustentación Final', descripcion: 'Defensa del Proyecto.', semana: 16, requiereAsesor: true, requiereJurado: true },
    ],
};

// Nota: Asegúrate que los IDs sean únicos globalmente o al menos dentro de su contexto (ciclo-curso).
// La estructura de MOCK_ESTADOS y MOCKS_HITOS debe coincidir con lo que tu servicio real devolvería.
// -----------------------------------------------------

export const fetchScheduleTemplate = async (cicloId: string, curso: CursoType): Promise<CronogramaPlantilla | null> => {
  console.log(`SERVICE: Fetching schedule template for ${cicloId} - ${curso}`);
  await apiDelay(500);
  // --- Lógica Simulación (Igual que antes) ---
  const fuenteHitos = curso === 'PFC1' ? MOCK_HITOS_PFC1 : MOCK_HITOS_PFC2;
  const fuenteEstados = MOCK_ESTADOS[cicloId];
  if (!fuenteEstados) return { ciclo: cicloId, curso, estadoInfo: { estado: 'NO_CREADO', fechaPublicacion: null }, hitos: [] };
  const estadoInfo = fuenteEstados[curso];
  const hitos = fuenteHitos[cicloId] || [];
  if (!estadoInfo) return { ciclo: cicloId, curso, estadoInfo: { estado: 'NO_CREADO', fechaPublicacion: null }, hitos: [] };
  return { ciclo: cicloId, curso, estadoInfo, hitos };
  // --- Fin Simulación ---
  // Llamada Real API:
  // try { ... await apiClient.get(...) ... } catch { ... }
};

export const saveScheduleTemplate = async (cicloId: string, curso: CursoType, hitos: Hito[], estado: 'BORRADOR'): Promise<boolean> => {
  console.log(`SERVICE: Saving schedule template for ${cicloId} - ${curso} as ${estado}`);
  await apiDelay(1000);
  const payload = { estado, hitos }; 
  console.log("Payload:", payload);
  // --- Lógica Simulación (Actualizar Mocks - Igual que antes) ---
  if (curso === 'PFC1') MOCK_HITOS_PFC1[cicloId] = hitos; else MOCK_HITOS_PFC2[cicloId] = hitos;
  if (!MOCK_ESTADOS[cicloId]) MOCK_ESTADOS[cicloId] = { PFC1: { estado: 'NO_CREADO', fechaPublicacion: null }, PFC2: { estado: 'NO_CREADO', fechaPublicacion: null } };
  MOCK_ESTADOS[cicloId][curso] = { estado, fechaPublicacion: null };
  // --- Fin Simulación ---
  // Llamada Real API:
  // try { ... await apiClient.put(...) ... } catch { ... }
  return true; 
};

export const publishScheduleTemplate = async (cicloId: string, curso: CursoType): Promise<boolean> => {
  console.log(`SERVICE: Publishing schedule template for ${cicloId} - ${curso}`);
  await apiDelay(700);
  // --- Lógica Simulación (Actualizar Mocks - Igual que antes) ---
  if (MOCK_ESTADOS[cicloId]?.[curso]) MOCK_ESTADOS[cicloId][curso] = { estado: 'PUBLICADO', fechaPublicacion: new Date().toISOString() };
  else return false; 
  // --- Fin Simulación ---
  // Llamada Real API:
  // try { ... await apiClient.post(...) ... } catch { ... }
   return true; 
};

export const fetchValidSourceCycles = async (targetCiclo: string): Promise<string[]> => {
    console.log("SERVICE: Fetching valid source cycles...");
    await apiDelay(200);
    // --- Lógica Simulación (Igual que antes) ---
    return Object.keys(MOCK_ESTADOS).filter(
        c =>
            c < targetCiclo &&
            (
                (MOCK_ESTADOS[c]?.PFC1?.estado === 'PUBLICADO' || MOCK_ESTADOS[c]?.PFC1?.estado === 'ARCHIVADO') ||
                (MOCK_ESTADOS[c]?.PFC2?.estado === 'PUBLICADO' || MOCK_ESTADOS[c]?.PFC2?.estado === 'ARCHIVADO')
            )
    );
    // --- Fin Simulación ---
    // Llamada Real API:
    // try { ... await apiClient.get(...) ... } catch { ... }
};