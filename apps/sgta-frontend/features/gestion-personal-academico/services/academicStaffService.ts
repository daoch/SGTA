// src/features/academic-staff-management/services/academicStaffService.ts
//import apiClient from '@/lib/api'; // Tu cliente API
import { Profesor } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene la lista de profesores ACTIVOS EN EL SISTEMA para gestión académica.
 * El filtrado por estado de habilitación se hace en el frontend o aquí si la API lo soporta.
 */
export const fetchActiveProfessorsForManagement = async (): Promise<Profesor[]> => {
  console.log("SERVICE: Fetching active professors for management...");
  await apiDelay(1000);
  // --- INICIO SIMULACIÓN API ---
  // Devuelve solo profesores con cuenta ACTIVA (no los inactivos por Admin)
  const mockData: Profesor[] = [
        { id: 'P001', nombre: 'Manuel Vázquez', email: 'mvazquez@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 3, numDefensas: 1, departamento: 'Ingeniería', expertiseAreas: ['IA', 'ML'], academicStatus: 'active', codigoPucp: '20150734', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P001' },
        { id: 'P002', nombre: 'Laura Martínez', email: 'lmartinez@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: false, numTesis: 2, numDefensas: 0, departamento: 'Ciencias', expertiseAreas: ['Química Orgánica'], academicStatus: 'active', codigoPucp: '19980452', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P002' },
        { id: 'P004', nombre: 'Ana González', email: 'agonzalez@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 5, numDefensas: 2, departamento: 'Ciencias Sociales', expertiseAreas: ['Psicología Clínica'], academicStatus: 'active', codigoPucp: '20050326', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P004' },
        { id: 'P005', nombre: 'Roberto Fernández', email: 'rfernandez@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 1, numDefensas: 4, departamento: 'Derecho', expertiseAreas: ['Constitucional'], academicStatus: 'active', codigoPucp: '20120189', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P005' },
        { id: 'P006', nombre: 'Sofía Reyes', email: 'sreyes@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: false, numTesis: 0, numDefensas: 0, departamento: 'Artes', expertiseAreas: ['Historia del Arte'], academicStatus: 'active', codigoPucp: '20180912', rolAcademico: 'Profesor TPA', avatar: 'https://i.pravatar.cc/150?u=P006' },
        { id: 'P007', nombre: 'Jorge Castillo', email: 'jcastillo@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: false, numTesis: 4, numDefensas: 1, departamento: 'Ingeniería', expertiseAreas: ['Robótica'], academicStatus: 'active', codigoPucp: '20101155', rolAcademico: 'Profesor Principal', avatar: 'https://i.pravatar.cc/150?u=P007' },
        { id: 'P008', nombre: 'Elena Paredes', email: 'eparedes@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 0, numDefensas: 5, departamento: 'Ciencias', expertiseAreas: ['Física'], academicStatus: 'active', codigoPucp: '19950789', rolAcademico: 'Profesor Principal (Licencia)', avatar: 'https://i.pravatar.cc/150?u=P008' },
        { id: 'P009', nombre: 'David Flores', email: 'dflores@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: true, numTesis: 0, numDefensas: 2, departamento: 'Humanidades', expertiseAreas: ['Lingüística'], academicStatus: 'active', codigoPucp: '20030214', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P009' },
        { id: 'P010', nombre: 'Patricia Silva', email: 'psilva@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 2, numDefensas: 1, departamento: 'Ciencias Sociales', expertiseAreas: ['Sociología'], academicStatus: 'active', codigoPucp: '20080531', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P010' },
        { id: 'P012', nombre: 'Mónica Luna', email: 'mluna@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: true, numTesis: 0, numDefensas: 3, departamento: 'Artes', expertiseAreas: ['Diseño Gráfico'], academicStatus: 'active', codigoPucp: '20001099', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P012' },
        { id: 'P013', nombre: 'Fernando Morales', email: 'fmorales@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 2, numDefensas: 3, departamento: 'Ingeniería', expertiseAreas: ['Circuitos Eléctricos', 'Sistemas de Potencia'], academicStatus: 'active', codigoPucp: '20091234', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P013' },
        { id: 'P014', nombre: 'Carmen Herrera', email: 'cherrera@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: true, numTesis: 0, numDefensas: 6, departamento: 'Derecho', expertiseAreas: ['Derecho Civil', 'Contratos'], academicStatus: 'active', codigoPucp: '19990112', rolAcademico: 'Profesor Principal', avatar: 'https://i.pravatar.cc/150?u=P014' },
        { id: 'P015', nombre: 'Miguel Ángel Torres', email: 'matorres@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: false, numTesis: 1, numDefensas: 0, departamento: 'Humanidades', expertiseAreas: ['Literatura Peruana', 'Crítica Literaria'], academicStatus: 'active', codigoPucp: '20110567', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P015' },
        { id: 'P016', nombre: 'Isabel Vega', email: 'ivega@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 3, numDefensas: 2, departamento: 'Ciencias Sociales', expertiseAreas: ['Antropología Visual', 'Estudios Culturales'], academicStatus: 'active', codigoPucp: '20070890', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P016' },
        { id: 'P017', nombre: 'Raúl Benavides', email: 'rbenavides@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: false, numTesis: 0, numDefensas: 0, departamento: 'Ciencias', expertiseAreas: ['Biología Molecular'], academicStatus: 'active', codigoPucp: '20190321', rolAcademico: 'Profesor TPA (Reciente)', avatar: 'https://i.pravatar.cc/150?u=P017' },
        { id: 'P018', nombre: 'Gabriela Nuñez', email: 'gnunez@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 0, numDefensas: 4, departamento: 'Artes', expertiseAreas: ['Escultura', 'Arte Contemporáneo'], academicStatus: 'active', codigoPucp: '20041122', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P018' },
        { id: 'P019', nombre: 'Andrés Quispe', email: 'aquispe@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 2, numDefensas: 1, departamento: 'Ingeniería', expertiseAreas: ['Ingeniería de Software', 'Bases de Datos'], academicStatus: 'cessation_in_progress', codigoPucp: '20130456', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P019' },
        { id: 'P020', nombre: 'Valeria Ríos', email: 'vrios@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: true, numTesis: 0, numDefensas: 7, departamento: 'Derecho', expertiseAreas: ['Derecho Laboral', 'Seguridad Social'], academicStatus: 'active', codigoPucp: '20020789', rolAcademico: 'Profesor Principal', avatar: 'https://i.pravatar.cc/150?u=P020' },
        { id: 'P021', nombre: 'Diego Salazar', email: 'dsalazar@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: false, numTesis: 1, numDefensas: 0, departamento: 'Humanidades', expertiseAreas: ['Historia Colonial', 'Archivística'], academicStatus: 'active', codigoPucp: '20160987', rolAcademico: 'Profesor TPA', avatar: 'https://i.pravatar.cc/150?u=P021' },
        { id: 'P022', nombre: 'Jimena Castro', email: 'jcastro@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 4, numDefensas: 3, departamento: 'Ciencias Sociales', expertiseAreas: ['Comunicación Política', 'Opinión Pública'], academicStatus: 'active', codigoPucp: '20060123', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P022' },
        { id: 'P023', nombre: 'Oscar Medina', email: 'omedina@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 0, numDefensas: 1, departamento: 'Ciencias', expertiseAreas: ['Matemática Aplicada', 'Estadística'], academicStatus: 'active', codigoPucp: '20170234', rolAcademico: 'Profesor Asociado', avatar: 'https://i.pravatar.cc/150?u=P023' },
        { id: 'P024', nombre: 'Natalia Rojas', email: 'nrojas@pucp.edu.pe', habilitadoAsesor: false, habilitadoJurado: true, numTesis: 0, numDefensas: 2, departamento: 'Artes', expertiseAreas: ['Diseño Industrial', 'Ergonomía'], academicStatus: 'active', codigoPucp: '20001001', rolAcademico: 'Profesor TPC', avatar: 'https://i.pravatar.cc/150?u=P024' },
        { id: 'P025', nombre: 'Luis Paredes', email: 'lparedes@pucp.edu.pe', habilitadoAsesor: true, habilitadoJurado: true, numTesis: 6, numDefensas: 5, departamento: 'Ingeniería', expertiseAreas: ['Inteligencia Artificial', 'Procesamiento de Lenguaje Natural'], academicStatus: 'active', codigoPucp: '19970555', rolAcademico: 'Profesor Principal', avatar: 'https://i.pravatar.cc/150?u=P025' },
  ];
  // --- FIN SIMULACIÓN API ---
  // try {
  //    // La API debe devolver solo los profesores con cuenta activa
  //    const response = await apiClient.get<Profesor[]>('/api/coordinador/profesores-activos');
  //    return response.data;
  // } catch (error) {
  //    console.error("Error fetching active professors:", error);
  //    throw new Error("No se pudieron cargar los profesores activos.");
  // }
  return mockData;
};

/**
 * Actualiza el estado de habilitación académica (Asesor o Jurado) para un profesor.
 */
export const updateAcademicHabilitation = async (
  profesorId: string,
  tipo: 'asesor' | 'jurado',
  newState: boolean
): Promise<boolean> => {
  console.log(`SERVICE: Updating habilitation (${tipo}) for ${profesorId} to ${newState}`);
  await apiDelay(500);
  const payload = { habilitado: newState };
  // try {
  //     await apiClient.patch(`/api/coordinador/profesores/${profesorId}/habilitacion/${tipo}`, payload);
  //     return true;
  // } catch (error) {
  //     console.error(`Error updating habilitation (${tipo}) for ${profesorId}:`, error);
  //     throw new Error(`No se pudo actualizar la habilitación de ${tipo}.`);
  // }
   return true; // Simular éxito
};

/**
 * Inicia el proceso de cese académico para un asesor (marca para reasignación).
 */
export const initiateCessationProcess = async (profesorId: string): Promise<boolean> => {
  console.log(`SERVICE: Initiating academic cessation process for advisor ${profesorId}`);
  await apiDelay(700);
  // try {
  //     // Esta API marcaría al profesor y sus tesis para reasignación
  //     await apiClient.post(`/api/coordinador/profesores/${profesorId}/iniciar-cese`);
  //     return true;
  // } catch (error) {
  //     console.error(`Error initiating cessation process for ${profesorId}:`, error);
  //     throw new Error("No se pudo iniciar el proceso de cese.");
  // }
  return true; // Simular éxito
};

/**
   * Actualiza la habilitación de múltiples profesores a la vez
   */
export async function bulkUpdateHabilitation(
  profesorIds: string[],
  tipo: 'asesor' | 'jurado',
  newState: boolean
): Promise<boolean> {
  // Simulación de llamada a API con retraso más largo para operaciones masivas
  await new Promise(resolve => setTimeout(resolve, 1000 + profesorIds.length * 100));
  
  console.log(`Bulk update: ${tipo} ${newState ? 'habilitado' : 'deshabilitado'} para ${profesorIds.length} profesores`);
  
  // Simular éxito en la mayoría de casos (en producción, esto retornaría la respuesta de la API)
  return Math.random() > 0.1; // 90% de probabilidad de éxito
}