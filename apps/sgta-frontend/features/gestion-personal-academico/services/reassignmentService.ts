// src/features/academic-staff-management/services/reassignmentService.ts
//import apiClient from '@/lib/api'; // Asumiendo cliente API configurado
import { ProyectoReasignacion, Asesor } from '../types';

// Simulación de retardo
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene la lista de proyectos pendientes de reasignación.
 */
export const fetchPendingReassignments = async (): Promise<ProyectoReasignacion[]> => {
  console.log("SERVICE: Fetching pending reassignments...");
  await apiDelay(800); // Simular llamada API
  // --- INICIO SIMULACIÓN API ---
  const mockProyectos: ProyectoReasignacion[] = [
    { id: 'PROY001', tesista: {
        id: 'T001', nombre: 'Ana López Ramírez', codigo: '2020150123',
        titulo: ''
    }, titulo: 'Implementación de algoritmos de Machine Learning para predicción de rendimiento académico', asesorOriginal: { id: 'P001', nombre: 'Manuel Vázquez', email: 'mvazquez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P001' }, areasTematicas: ['Inteligencia Artificial', 'Análisis de Datos', 'Educación'], fechaCese: '2025-04-16T10:30:00', estado: 'pendiente_reasignacion' },
    { id: 'PROY002', tesista: {
        id: 'T002', nombre: 'Carlos Mendoza García', codigo: '2021150045',
        titulo: ''
    }, titulo: 'Análisis comparativo de frameworks de desarrollo web', asesorOriginal: { id: 'P001', nombre: 'Manuel Vázquez', email: 'mvazquez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P001' }, areasTematicas: ['Desarrollo Web', 'Ingeniería de Software'], fechaCese: '2025-04-16T10:30:00', estado: 'pendiente_reasignacion' },
    { id: 'PROY003', tesista: {
        id: 'T003', nombre: 'María Rodríguez Luna', codigo: '2020140089',
        titulo: ''
    }, titulo: 'Estudio de usabilidad en aplicaciones móviles educativas', asesorOriginal: { id: 'P001', nombre: 'Manuel Vázquez', email: 'mvazquez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P001' }, areasTematicas: ['Interacción Humano-Computador', 'Aplicaciones Móviles', 'Educación'], fechaCese: '2025-04-16T10:30:00', estado: 'pendiente_reasignacion' },
    { id: 'PROY004', tesista: {
        id: 'T004', nombre: 'Roberto Sánchez Huamán', codigo: '2021130078',
        titulo: ''
    }, titulo: 'Diseño e implementación de una arquitectura de microservicios', asesorOriginal: { id: 'P002', nombre: 'Laura Martínez', email: 'lmartinez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P002' }, areasTematicas: ['Arquitectura de Software', 'Microservicios', 'Sistemas Distribuidos'], fechaCese: '2025-04-12T14:15:00', estado: 'pendiente_reasignacion' },
    { id: 'PROY005', tesista: {
        id: 'T005', nombre: 'Diana Torres Vargas', codigo: '2020120056',
        titulo: ''
    }, titulo: 'Evaluación de herramientas de seguridad informática', asesorOriginal: { id: 'P002', nombre: 'Laura Martínez', email: 'lmartinez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P002' }, areasTematicas: ['Seguridad Informática', 'Redes', 'Ciberseguridad'], fechaCese: '2025-04-12T14:15:00', estado: 'pendiente_reasignacion' },
  ];
  // --- FIN SIMULACIÓN API ---
  // try {
  //    const response = await apiClient.get<ProyectoReasignacion[]>('/api/coordinador/reasignaciones/pendientes');
  //    return response.data;
  // } catch (error) {
  //    console.error("Error fetching pending reassignments:", error);
  //    throw new Error("No se pudieron cargar los proyectos pendientes."); // Lanza error para que el hook lo capture
  // }
   return mockProyectos;
};

/**
 * Obtiene la lista de asesores habilitados disponibles para reasignación.
 */
export const fetchAvailableAdvisors = async (): Promise<Asesor[]> => {
  console.log("SERVICE: Fetching available advisors...");
  await apiDelay(600); // Simular llamada API
  // --- INICIO SIMULACIÓN API ---
  const mockAsesores: Asesor[] = [
      { id: 'P005', nombre: 'Javier Paredes', email: 'jparedes@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P005', areasExpertise: ['Inteligencia Artificial', 'Aprendizaje Automático', 'Análisis de Datos'], cargaActual: 3, estado: 'habilitado' },
      { id: 'P006', nombre: 'Carmen Ortiz', email: 'cortiz@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P006', areasExpertise: ['Desarrollo Web', 'Ingeniería de Software', 'Arquitectura de Software'], cargaActual: 2, estado: 'habilitado' },
      { id: 'P007', nombre: 'Roberto Gómez', email: 'rgomez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P007', areasExpertise: ['Interacción Humano-Computador', 'Aplicaciones Móviles', 'UX/UI'], cargaActual: 1, estado: 'habilitado' },
      { id: 'P008', nombre: 'Lucía Mendoza', email: 'lmendoza@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P008', areasExpertise: ['Seguridad Informática', 'Redes', 'Ciberseguridad', 'Sistemas Distribuidos'], cargaActual: 4, estado: 'habilitado' },
      { id: 'P009', nombre: 'Eduardo Santos', email: 'esantos@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P009', areasExpertise: ['Bases de Datos', 'Big Data', 'Cloud Computing'], cargaActual: 2, estado: 'habilitado' },
  ];
  // --- FIN SIMULACIÓN API ---
  // try {
  //     // Asegúrate que esta ruta excluya a los inhabilitados y los que están en cese
  //     const response = await apiClient.get<Asesor[]>('/api/coordinador/asesores?estado=habilitado');
  //     return response.data;
  // } catch (error) {
  //     console.error("Error fetching available advisors:", error);
  //     throw new Error("No se pudieron cargar los asesores disponibles.");
  // }
   return mockAsesores;
};

/**
 * Realiza la reasignación de un proyecto a un nuevo asesor.
 */
export const reassignProjectAdvisor = async (proyectoId: string, nuevoAsesorId: string): Promise<boolean> => {
  console.log(`SERVICE: Reassigning project ${proyectoId} to advisor ${nuevoAsesorId}`);
  await apiDelay(1000); // Simular llamada API
  // try {
  //     await apiClient.post(`/api/coordinador/reasignaciones/${proyectoId}/assign`, { nuevoAsesorId });
  //     // Aquí podrías verificar si era el último proyecto del asesor original y completar su cese si es necesario
  //     // await checkAndCompleteCessation(proyectoId);
  //     return true;
  // } catch (error) {
  //     console.error(`Error reassigning project ${proyectoId}:`, error);
  //     // Podrías lanzar un error más específico si el backend lo devuelve
  //     throw new Error(`No se pudo reasignar el proyecto ${proyectoId}.`);
  // }
  return true; // Simular éxito
};

// (Opcional) Función para verificar y completar el cese del asesor original
// export const checkAndCompleteCessation = async (projectId: string): Promise<void> => {
//    // Lógica para llamar a una API que verifique si era el último proyecto
//    // y actualice el estado del asesor original si corresponde
//    console.log(`SERVICE: Checking if cessation can be completed after reassigning project ${projectId}`);
//    await apiDelay(200);
//    // await apiClient.post(`/api/coordinador/asesores/complete-cessation-check`, { projectId });
// }