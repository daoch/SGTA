// src/features/configuracion-academica/services/areasTematicasService.ts
//import apiClient from '@/lib/api';
import { AreaTematica, AreaTematicaFormValues } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATA ---
let MOCK_AREAS: AreaTematica[] = [
    { id: 'area-001', nombre: 'Inteligencia Artificial', descripcion: 'Algoritmos, modelos y aplicaciones de IA.', proyectosAsociados: 15, asesoresAsociados: 8, fechaCreacion: '2022-01-10T10:00:00Z', fechaModificacion: '2024-03-15T14:30:00Z' },
    { id: 'area-002', nombre: 'Desarrollo Web Full-Stack', descripcion: 'Tecnologías frontend y backend para aplicaciones web modernas.', proyectosAsociados: 12, asesoresAsociados: 6, fechaCreacion: '2022-01-10T10:05:00Z', fechaModificacion: '2023-11-20T09:00:00Z' },
    { id: 'area-003', nombre: 'Seguridad Informática y Ciberseguridad', descripcion: 'Protección de sistemas, redes y datos contra amenazas.', proyectosAsociados: 8, asesoresAsociados: 4, fechaCreacion: '2022-05-20T11:00:00Z', fechaModificacion: '2024-01-10T16:00:00Z' },
    { id: 'area-004', nombre: 'Bases de Datos y Big Data', descripcion: 'Gestión, almacenamiento y análisis de grandes volúmenes de datos.', proyectosAsociados: 10, asesoresAsociados: 5, fechaCreacion: '2022-08-15T09:30:00Z', fechaModificacion: '2022-08-15T09:30:00Z' },
    { id: 'area-005', nombre: 'Interacción Humano-Computador (HCI)', descripcion: 'Diseño y evaluación de interfaces de usuario y experiencia de usuario.', proyectosAsociados: 6, asesoresAsociados: 3, fechaCreacion: '2023-02-01T15:00:00Z', fechaModificacion: '2024-02-28T11:45:00Z' },
    { id: 'area-006', nombre: 'Redes y Comunicaciones', descripcion: 'Infraestructura, protocolos y tecnologías de redes.', proyectosAsociados: 4, asesoresAsociados: 2, fechaCreacion: '2023-05-10T08:00:00Z', fechaModificacion: '2023-05-10T08:00:00Z' },
];
// ---------------

/**
 * Obtiene todas las áreas temáticas del área académica.
 */
export const fetchAreasTematicas = async (): Promise<AreaTematica[]> => {
  console.log("SERVICE: Fetching areas tematicas...");
  await apiDelay(600);
  // try {
  //    const response = await apiClient.get<AreaTematica[]>('/api/configuracion/areas-tematicas');
  //    return response.data;
  // } catch (error) {
  //    console.error("Error fetching areas tematicas:", error);
  //    throw new Error("No se pudieron cargar las áreas temáticas.");
  // }
  return [...MOCK_AREAS]; // Devolver copia para evitar mutación directa
};

/**
 * Crea una nueva área temática.
 */
export const createAreaTematica = async (areaData: AreaTematicaFormValues): Promise<AreaTematica> => {
  console.log("SERVICE: Creating area tematica:", areaData);
  await apiDelay(700);
  // Validar unicidad del nombre (simulado)
  if (MOCK_AREAS.some(a => a.nombre.toLowerCase() === areaData.nombre.toLowerCase())) {
       throw new Error(`El área temática "${areaData.nombre}" ya existe.`);
   }
  // --- Simulación Creación ---
  const newId = `area-${Date.now()}`;
  const newArea: AreaTematica = {
    ...areaData,
    id: newId,
    proyectosAsociados: 0,
    asesoresAsociados: 0,
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
  };
  MOCK_AREAS.push(newArea);
  // --- Fin Simulación ---
  // try {
  //     // La API debería devolver el área creada con su ID
  //     const response = await apiClient.post<AreaTematica>('/api/configuracion/areas-tematicas', areaData);
  //     return response.data;
  // } catch (error) {
  //     console.error("Error creating area tematica:", error);
  //     // Podrías manejar errores específicos de validación del backend aquí
  //     throw new Error("No se pudo crear el área temática.");
  // }
  return newArea; // Devolver área simulada
};

/**
 * Actualiza un área temática existente.
 */
export const updateAreaTematica = async (areaId: string, areaData: AreaTematicaFormValues): Promise<AreaTematica> => {
  console.log(`SERVICE: Updating area tematica ${areaId}:`, areaData);
  await apiDelay(700);
   // Validar unicidad del nombre (excluyendo el área actual)
   if (MOCK_AREAS.some(a => a.id !== areaId && a.nombre.toLowerCase() === areaData.nombre.toLowerCase())) {
       throw new Error(`El nombre de área temática "${areaData.nombre}" ya está en uso.`);
   }
  // --- Simulación Actualización ---
  let updatedArea: AreaTematica | null = null;
  MOCK_AREAS = MOCK_AREAS.map(area => {
    if (area.id === areaId) {
      updatedArea = {
        ...area,
        ...areaData,
        fechaModificacion: new Date().toISOString(),
      };
      return updatedArea;
    }
    return area;
  });
  if (!updatedArea) throw new Error("Área temática no encontrada para actualizar.");
  // --- Fin Simulación ---
  // try {
  //     const response = await apiClient.put<AreaTematica>(`/api/configuracion/areas-tematicas/${areaId}`, areaData);
  //     return response.data;
  // } catch (error) {
  //     console.error(`Error updating area tematica ${areaId}:`, error);
  //     throw new Error("No se pudo actualizar el área temática.");
  // }
   return updatedArea; // Devolver área simulada
};

/**
 * Elimina un área temática.
 * Debería fallar si tiene proyectos o asesores asociados.
 */
export const deleteAreaTematica = async (areaId: string): Promise<boolean> => {
  console.log(`SERVICE: Deleting area tematica ${areaId}`);
  await apiDelay(800);
  // --- Simulación Eliminación ---
  const areaIndex = MOCK_AREAS.findIndex(a => a.id === areaId);
  if (areaIndex === -1) {
    throw new Error("Área temática no encontrada.");
  }
  // Validar si está en uso (simulado)
  const area = MOCK_AREAS[areaIndex];
  if ((area.proyectosAsociados ?? 0) > 0 || (area.asesoresAsociados ?? 0) > 0) {
      throw new Error("No se puede eliminar el área temática porque está siendo utilizada por proyectos o asesores.");
  }
  MOCK_AREAS.splice(areaIndex, 1);
  // --- Fin Simulación ---
  // try {
  //     // La API debería validar si se puede eliminar antes de proceder
  //     await apiClient.delete(`/api/configuracion/areas-tematicas/${areaId}`);
  //     return true;
  // } catch (error: any) {
  //     console.error(`Error deleting area tematica ${areaId}:`, error);
  //     // Devolver mensaje de error específico del backend si es posible
  //     const message = error.response?.data?.message || "No se pudo eliminar el área temática.";
  //     throw new Error(message);
  // }
   return true; // Simular éxito
};