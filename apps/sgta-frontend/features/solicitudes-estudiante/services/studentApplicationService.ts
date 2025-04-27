// src/features/student-applications/services/studentApplicationService.ts
//import apiClient from '@/lib/api';
import { StudentApplicationsData, ProposalSummary, PostulationSummary } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene el resumen de propuestas y postulaciones del estudiante actual.
 */
export const fetchMyApplications = async (): Promise<StudentApplicationsData> => {
  console.log("SERVICE: Fetching student applications...");
  await apiDelay(900); 

  // --- INICIO SIMULACIÓN API ---
  const mockData: StudentApplicationsData = {
    propuestasEnviadas: [
        { id: 'PROP001', tituloPropuesto: "Análisis de Sentimiento en Redes Sociales (Propuesta)", 
          asesorDestino: { id: 'P001', nombre: 'Manuel Vázquez', avatar:'https://i.pravatar.cc/150?u=P001'}, 
          fechaEnvio: '2025-04-10T09:00:00Z', estado: 'en_revision', 
          ultimoComentarioAsesor: "Interesante propuesta, necesito revisar el alcance.", 
          linkToProposal: '/gestion-temas/mis-propuestas/PROP001' // O ruta similar
        },
        { id: 'PROP002', tituloPropuesto: "Optimización de Rutas Logísticas con Algoritmos Genéticos", 
          asesorDestino: { id: 'P006', nombre: 'Carmen Ortiz', avatar:'https://i.pravatar.cc/150?u=P006'}, 
          fechaEnvio: '2025-04-05T15:30:00Z', estado: 'rechazada', 
          ultimoComentarioAsesor: "El enfoque propuesto requiere recursos que no tenemos disponibles actualmente en el laboratorio.", 
          linkToProposal: '/gestion-temas/mis-propuestas/PROP002'
        },
         { id: 'PROP003', tituloPropuesto: "Sistema de Gestión Académica Simplificado", 
          asesorDestino: { id: 'P007', nombre: 'Roberto Gómez', avatar:'https://i.pravatar.cc/150?u=P007'}, 
          fechaEnvio: '2025-03-20T11:00:00Z', estado: 'aceptada', // Podría pasar a 'inscrito' después
          ultimoComentarioAsesor: "Propuesta aceptada. Coordinemos una reunión para definir el plan.", 
          linkToProposal: '/gestion-temas/mis-propuestas/PROP003'
        },
    ],
    postulacionesRealizadas: [
        { id: 'POST001', temaLibre: { id: 'TL005', titulo: 'IA para análisis de imágenes médicas' },
          asesorTema: { id: 'P005', nombre: 'Javier Paredes', avatar: 'https://i.pravatar.cc/150?u=P005'},
          fechaPostulacion: '2025-04-12T16:00:00Z', estado: 'enviada',
          motivacionEnviada: "Tengo experiencia previa con Python y Tensorflow...",
          linkToTheme: '/explorar-propuestas/TL005'
        },
        { id: 'POST002', temaLibre: { id: 'TL008', titulo: 'Ciberseguridad en Dispositivos IoT' },
          asesorTema: { id: 'P008', nombre: 'Lucía Mendoza', avatar: 'https://i.pravatar.cc/150?u=P008'},
          fechaPostulacion: '2025-04-08T08:45:00Z', estado: 'rechazada',
          ultimoComentarioAsesor: "Ya se completó el cupo para este tema. Gracias por tu interés.",
          linkToTheme: '/explorar-propuestas/TL008'
        },
    ]
  };
  // --- FIN SIMULACIÓN API ---
  
  // try {
  //     // La API debería devolver los datos filtrados para el estudiante autenticado
  //     const response = await apiClient.get<StudentApplicationsData>('/api/estudiante/mis-aplicaciones');
  //     return response.data;
  // } catch (error) {
  //     console.error("Error fetching student applications:", error);
  //     throw new Error("No se pudieron cargar tus postulaciones y propuestas.");
  // }
   return mockData;
};

/**
 * Retira una propuesta de tema enviada por el estudiante.
 */
// !! AÑADIR export !!
export const withdrawProposal = async (proposalId: string): Promise<boolean> => { 
    console.log(`SERVICE: Withdrawing proposal ${proposalId}`);
    await apiDelay(600); 
    // ... (resto de la lógica) ...
    return true; 
  };
  
  /**
   * Retira una postulación a un tema libre realizada por el estudiante.
   */
  // !! AÑADIR export !!
  export const withdrawPostulation = async (postulationId: string): Promise<boolean> => { 
    console.log(`SERVICE: Withdrawing postulation ${postulationId}`);
    await apiDelay(600); 
    // ... (resto de la lógica) ...
     return true; 
  };

// Podrían existir otras funciones como:
// - withdrawProposal(proposalId): para retirar una propuesta
// - withdrawPostulation(postulationId): para retirar una postulación