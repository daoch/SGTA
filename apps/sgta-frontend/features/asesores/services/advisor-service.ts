import { useAuthStore } from "@/features/auth";
import axiosInstance from "@/lib/axios/axios-instance";

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
  getAdvisorStudents: async (): Promise<Student[]> => {
    const { idToken } = useAuthStore.getState();
    const response = await axiosInstance.get("/reports/advisors/tesistas", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      }
    });
    return response.data;
  },

  // Obtener detalles de un tesista específico
  getStudentDetails: async (studentId: number): Promise<StudentDetail> => {
    try {
      const response = await axiosInstance.get(`/reports/tesistas/detalle?tesistaId=${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Error detallado al obtener datos del tesista:", error);
      throw error;
    }
  },

  // Obtener cronograma/timeline del tesista
  getStudentTimeline: async (studentId: number): Promise<TimelineEvent[]> => {
    const response = await axiosInstance.get(`/reports/tesistas/cronograma?tesistaId=${studentId}`);
    return response.data;
  },

  // Obtener reuniones del tesista
  getStudentMeetings: async (studentId: number): Promise<Meeting[]> => {
    const response = await axiosInstance.get(`/reports/tesistas/reuniones?tesistaId=${studentId}`);
    return response.data;
  }
}; 