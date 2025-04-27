// src/features/academic-staff-management/services/cessationService.ts
//import apiClient from '@/lib/api'; // Asumiendo que tienes un cliente API configurado en lib
import { SolicitudCese } from '../types'; // Importar tipos

// Simulación de retardo para pruebas locales
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene todas las solicitudes de cese (o filtradas por backend si aplica).
 */
export const fetchCessationRequests = async (): Promise<SolicitudCese[]> => {
  console.log("SERVICE: Fetching cessation requests...");
  await apiDelay(800); // Simular llamada a API
  // --- INICIO SIMULACIÓN API ---
  const mockSolicitudes: SolicitudCese[] = [
    {
      id: 'SOL001',
      profesorId: 'P001',
      profesorNombre: 'Manuel Vázquez',
      profesorEmail: 'mvazquez@pucp.edu.pe',
      profesorAvatar: 'https://i.pravatar.cc/150?u=mvazquez',
      fechaSolicitud: '2025-04-15T10:30:00',
      motivo: 'Debido a compromisos académicos internacionales que me impedirán realizar un seguimiento adecuado de los proyectos de tesis durante al menos los próximos 6 meses. Estaré participando en un programa de investigación en la Universidad de California que requiere mi presencia física y completa dedicación.',
      estado: 'pendiente',
      tesistasAfectados: [
        {
          id: 'T001', nombre: 'Ana López', titulo: 'Implementación de algoritmos de Machine Learning para predicción de rendimiento académico', fechaInicio: '2024-09-01',
          codigo: ''
        },
        {
          id: 'T002', nombre: 'Carlos Mendoza', titulo: 'Análisis comparativo de frameworks de desarrollo web', fechaInicio: '2024-10-15',
          codigo: ''
        },
        {
          id: 'T003', nombre: 'María Rodríguez', titulo: 'Estudio de usabilidad en aplicaciones móviles educativas', fechaInicio: '2024-11-05',
          codigo: ''
        }
      ]
    },
    {
      id: 'SOL002',
      profesorId: 'P002',
      profesorNombre: 'Laura Martínez',
      profesorEmail: 'lmartinez@pucp.edu.pe',
      profesorAvatar: 'https://i.pravatar.cc/150?u=lmartinez',
      fechaSolicitud: '2025-04-10T14:15:00',
      motivo: 'Solicito el cese de mis funciones como asesora debido a problemas de salud que me impedirán dar la atención adecuada a los tesistas. Adjunto certificado médico en el sistema.',
      estado: 'pendiente',
      tesistasAfectados: [
        {
          id: 'T004', nombre: 'Roberto Sánchez', titulo: 'Diseño e implementación de una arquitectura de microservicios para sistemas académicos', fechaInicio: '2024-08-20',
          codigo: ''
        },
        {
          id: 'T005', nombre: 'Diana Torres', titulo: 'Evaluación de herramientas de seguridad informática en entornos universitarios', fechaInicio: '2024-09-12',
          codigo: ''
        }
      ]
    },
    {
      id: 'SOL003',
      profesorId: 'P003',
      profesorNombre: 'Carlos González',
      profesorEmail: 'cgonzalez@pucp.edu.pe',
      profesorAvatar: 'https://i.pravatar.cc/150?u=cgonzalez',
      fechaSolicitud: '2025-04-05T09:45:00',
      motivo: 'Solicito cese debido a mi próxima jubilación programada para el 30 de mayo de 2025.',
      estado: 'aprobada',
      fechaDecision: '2025-04-08T11:20:00',
      coordinadorDecision: 'Dra. Ana Velasco',
      tesistasAfectados: [
        {
          id: 'T006', nombre: 'Fernando Díaz', titulo: 'Desarrollo de un sistema de gestión de laboratorios universitarios', fechaInicio: '2024-07-15',
          codigo: ''
        }
      ]
    },
    {
      id: 'SOL004',
      profesorId: 'P004',
      profesorNombre: 'Patricia Romero',
      profesorEmail: 'promero@pucp.edu.pe',
      profesorAvatar: 'https://i.pravatar.cc/150?u=promero',
      fechaSolicitud: '2025-04-02T16:30:00',
      motivo: 'Solicito cesar mi rol como asesora para dedicarme a nuevas responsabilidades administrativas como Jefa del Departamento.',
      estado: 'rechazada',
      fechaDecision: '2025-04-04T10:15:00',
      motivoRechazo: 'Las responsabilidades administrativas no son incompatibles con la asesoría de tesis. Se sugiere reducir la carga si es necesario, pero no un cese completo.',
      coordinadorDecision: 'Dr. Miguel Sánchez',
      tesistasAfectados: [
        {
          id: 'T007', nombre: 'Gabriela Vargas', titulo: 'Implementación de metodologías ágiles en proyectos universitarios', fechaInicio: '2024-10-05',
          codigo: ''
        },
        {
          id: 'T008', nombre: 'Héctor Morales', titulo: 'Análisis de sistemas de recomendación para bibliotecas digitales', fechaInicio: '2024-11-10',
          codigo: ''
        }
      ]
    },
    {
      id: 'SOL005',
      profesorId: 'P005',
      profesorNombre: 'Javier Paredes',
      profesorEmail: 'jparedes@pucp.edu.pe',
      profesorAvatar: 'https://i.pravatar.cc/150?u=jparedes',
      fechaSolicitud: '2025-04-18T11:00:00',
      motivo: 'Solicito el cese debido a un traslado temporal a otra universidad por un año como parte de un programa de intercambio docente.',
      estado: 'pendiente',
      tesistasAfectados: [
        {
          id: 'T009', nombre: 'Isabel Castro', titulo: 'Desarrollo de aplicaciones IoT para Smart Campus', fechaInicio: '2024-09-20',
          codigo: ''
        }
      ]
    }
  ];
  // --- FIN SIMULACIÓN API ---
  // const response = await apiClient.get<SolicitudCese[]>('/api/coordinador/solicitudes-cese'); // Llamada Real
  // return response.data;
  return mockSolicitudes; 
};

/**
 * Aprueba una solicitud de cese.
 */
export const approveCessationRequest = async (solicitudId: string): Promise<boolean> => {
  console.log(`SERVICE: Approving request ${solicitudId}`);
  await apiDelay(800); // Simular llamada a API
  // try {
  //   await apiClient.post(`/api/coordinador/solicitudes-cese/${solicitudId}/approve`);
  //   return true;
  // } catch (error) {
  //   console.error("Error approving request:", error);
  //   return false;
  // }
  return true; // Simular éxito
};

/**
 * Rechaza una solicitud de cese con un motivo.
 */
export const rejectCessationRequest = async (solicitudId: string, motivoRechazo: string): Promise<boolean> => {
  console.log(`SERVICE: Rejecting request ${solicitudId} with reason: ${motivoRechazo}`);
  await apiDelay(800); // Simular llamada a API
  // try {
  //   await apiClient.post(`/api/coordinador/solicitudes-cese/${solicitudId}/reject`, { motivoRechazo });
  //   return true;
  // } catch (error) {
  //   console.error("Error rejecting request:", error);
  //   return false;
  // }
   return true; // Simular éxito
};

// Podrían añadirse más funciones si es necesario (ej. obtener detalle de una solicitud)