import axiosInstance from "@/lib/axios/axios-instance";
import { IAsesorTemaActivo, IMyCessationRequestListItemTransformed, IMyCessationRequestListProcessed, IMyCessationRequestListResponseFetched, ISolicitudActualizadaResponse } from "@/features/asesores/types/cessation-request"; // El tipo que definimos
import axios from "axios";

// Importar los tipos relevantes desde el nuevo archivo de tipos para invitaciones
import {
  IInvitacionesAsesoriaListResponseFetched,
  IInvitacionesAsesoriaListProcessed,
  IInvitacionAsesoriaFetched,
  IInvitacionAsesoriaTransformed,
  IRechazarPropuestaPayload,
} from "@/features/asesores/types/asesor-invitations.types"; // Ajusta la ruta
import { ELEMENTS_PER_PAGE_DEFAULT } from "@/lib/constants";


export interface Student {
  temaId: number;
  tesistaId: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  tituloTema: string;
  etapaFormativaNombre: string;
  carrera: string;
  entregableActualId: number;
  entregableActualNombre: string;
  entregableActualDescripcion: string;
  entregableActualFechaInicio: string;
  entregableActualFechaFin: string;
  entregableActualEstado: string;
  entregableEnvioEstado: string;
  entregableEnvioFecha: string | null;
}

export interface StudentDetail {
  tesistaId: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
  nivelEstudios: string;
  codigoPucp: string;
  temaId: number;
  tituloTema: string;
  resumenTema: string;
  metodologia: string;
  objetivos: string;
  areaConocimiento: string;
  subAreaConocimiento: string;
  asesorNombre: string;
  asesorCorreo: string;
  coasesorNombre: string | null;
  coasesorCorreo: string | null;
  cicloId: number;
  cicloNombre: string;
  fechaInicioCiclo: string;
  fechaFinCiclo: string;
  etapaFormativaId: number;
  etapaFormativaNombre: string;
  faseActual: string;
  entregableId: number;
  entregableNombre: string;
  entregableActividadEstado: string;
  entregableEnvioEstado: string;
  entregableFechaInicio: string;
  entregableFechaFin: string;
}

export interface TimelineEvent {
  hitoId: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  entregableEnvioEstado: string;
  entregableActividadEstado: string;
  esEvaluable: boolean;
  temaId: number;
  temaTitulo: string;
}

export interface Meeting {
  fecha: string;
  duracion: string;
  notas: string;
}

export const advisorService = {
  // Obtener lista de tesistas del asesor
  getAdvisorStudents: async (advisorId: string): Promise<Student[]> => {
    if (!advisorId) throw new Error("El ID del asesor es requerido");
    const response = await axiosInstance.get(`/api/v1/reports/advisors/tesistas?asesorId=${advisorId}`);
    return response.data;
  },

  // Obtener detalles de un tesista específico
  getStudentDetails: async (studentId: string): Promise<StudentDetail> => {
    if (!studentId) throw new Error("El ID del tesista es requerido");
    try {
      const response = await axiosInstance.get(`api/v1/reports/tesistas/detalle?tesistaId=${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Error detallado al obtener datos del tesista:", error);
      throw error;
    }
  },

  // Obtener cronograma/timeline del tesista
  getStudentTimeline: async (studentId: string): Promise<TimelineEvent[]> => {
    if (!studentId) throw new Error("El ID del tesista es requerido");
    const response = await axiosInstance.get(`api/v1/reports/tesistas/cronograma?tesistaId=${studentId}`);
    return response.data;
  },

  // Obtener reuniones del tesista
  getStudentMeetings: async (studentId: string): Promise<Meeting[]> => {
    if (!studentId) throw new Error("El ID del tesista es requerido");
    const response = await axiosInstance.get(`api/v1/reports/tesistas/reuniones?tesistaId=${studentId}`);
    return response.data;
  }
}; 

/**
 * Obtiene la lista de temas de tesis activos que el asesor autenticado está supervisando.
 */
export async function getAsesorActiveSupervisingTopics(): Promise<IAsesorTemaActivo[]> {
  const endpointPath = "asesor/mis-temas-activos"; // Ruta relativa a tu baseURL de axiosInstance
  console.log(`[API_CALL] GET ${endpointPath}`);

  try {
    // Asegúrate que axiosInstance esté configurado para incluir el token de autenticación
    const response = await axiosInstance.get<IAsesorTemaActivo[]>(`${endpointPath}`);
    console.log(`[API_SUCCESS] GET ${endpointPath} - Temas obtenidos:`, response.data.length);
    return response.data || []; // Devolver array vacío si data es null/undefined
  } catch (error) {
    console.error(`[API_ERROR] GET ${endpointPath}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] GET ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    // Podrías lanzar el error o devolver un array vacío para que el hook lo maneje
    // throw error;
    return []; // Devolver array vacío en caso de error para que la UI no se rompa
  }
}

/**
 * Obtiene las solicitudes de cese iniciadas por el asesor autenticado.
 */
export async function getMyCessationRequests(
  page: number,
  size: number
): Promise<IMyCessationRequestListProcessed> {
  const endpointPath = "asesor/mis-solicitudes-cese";
  const apiParams = { page, size, sort: "fechaCreacion,desc" };
  console.log(`[API_CALL] GET ${endpointPath} with params:`, apiParams);

  const response = await axiosInstance.get<IMyCessationRequestListResponseFetched>(
    `${endpointPath}`,
    { params: apiParams }
  );
  console.log(`[API_SUCCESS] GET ${endpointPath} response:`, response.data);

  const data = response.data;
  const transformedRequests: IMyCessationRequestListItemTransformed[] = (data.content || []).map(item => ({
    ...item,
    fechaSolicitud: new Date(item.fechaSolicitud),
    fechaDecision: item.fechaDecision ? new Date(item.fechaDecision) : null,
  }));

  return {
    requests: transformedRequests,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    currentPage: data.number, // ésto viene del Page en 0-index
    pageSize: data.size,
  };
}

export interface IAprobarSolicitudPayload {
  comentarioAprobacion: string;
}

export async function approveTerminationConsultancyRequest(
  requestId: number,
  payload: IAprobarSolicitudPayload
): Promise<ISolicitudActualizadaResponse> { // O Promise<void> si el backend no devuelve un cuerpo significativo
  const endpointPath = `coordinador/solicitudes-cese/${requestId}/aprobar`;
  console.log(`[API_CALL] POST ${endpointPath} with payload:`, payload);
  try {
    const response = await axiosInstance.post<ISolicitudActualizadaResponse>(`${endpointPath}`, payload);
    console.log(`[API_SUCCESS] POST ${endpointPath} response:`, response.data);
    return response.data;
  } catch (error) {
    // ... (manejo de errores)
    throw error;
  }
}

/**
 * Obtiene la lista paginada de invitaciones de asesoría pendientes
 * para el asesor autenticado.
 */
export async function getMisInvitacionesDeAsesoria(
  page: number, // 0-indexed
  size: number = ELEMENTS_PER_PAGE_DEFAULT
): Promise<IInvitacionesAsesoriaListProcessed> {
  const endpointPath = "asesor/invitaciones-asesoria"; // SIN /api/ al inicio
  const apiParams = {
    page,
    size,
    // sort: "fechaPropuesta,desc"
  };

  console.log(`[API_CALL] GET ${endpointPath} with params:`, apiParams);

  try {
    const response = await axiosInstance.get<IInvitacionesAsesoriaListResponseFetched>(
      endpointPath, // SIN /api/ al inicio
      { params: apiParams }
    );

    console.log(`[API_SUCCESS] GET ${endpointPath} raw data:`, JSON.stringify(response.data, null, 2));
    const fetchedData = response.data;

    const transformedInvitations: IInvitacionAsesoriaTransformed[] = (fetchedData.content || []).map(
      (item: IInvitacionAsesoriaFetched) => ({
        ...item,
        fechaPropuesta: new Date(item.fechaPropuesta),
      })
    );

    const processedData: IInvitacionesAsesoriaListProcessed = {
      invitaciones: transformedInvitations,
      totalPages: fetchedData.totalPages,
      totalElements: fetchedData.totalElements,
      currentPage: fetchedData.number,
      pageSize: fetchedData.size,
    };
    console.log(`[API_PROCESSED] GET ${endpointPath} processed data:`, processedData);
    return processedData;

  } catch (error) {
    console.error(`[API_ERROR] GET ${endpointPath}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] GET ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    return {
      invitaciones: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: page,
      pageSize: size,
    };
  }
}

// --- Servicios para Aceptar/Rechazar Propuesta ---

export async function acceptInvitacionAsesoria(solicitudOriginalId: number): Promise<void> {
  const endpointPath = `asesor/invitaciones-asesoria/${solicitudOriginalId}/aceptar`; // SIN /api/
  console.log(`[API_CALL] POST ${endpointPath}`);
  try {
    await axiosInstance.post(endpointPath); // SIN /api/
    console.log(`[API_SUCCESS] POST ${endpointPath} - Invitación ID ${solicitudOriginalId} aceptada.`);
  } catch (error) {
    console.error(`[API_ERROR] POST ${endpointPath} para ID ${solicitudOriginalId}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] POST ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

export async function rejectInvitacionAsesoria(
  solicitudOriginalId: number,
  payload: IRechazarPropuestaPayload
): Promise<void> {
  const endpointPath = `asesor/invitaciones-asesoria/${solicitudOriginalId}/rechazar`; // SIN /api/
  console.log(`[API_CALL] POST ${endpointPath} con payload:`, payload);
  try {
    await axiosInstance.post(endpointPath, payload); // SIN /api/
    console.log(`[API_SUCCESS] POST ${endpointPath} - Invitación ID ${solicitudOriginalId} rechazada.`);
  } catch (error) {
    console.error(`[API_ERROR] POST ${endpointPath} para ID ${solicitudOriginalId}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] POST ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}