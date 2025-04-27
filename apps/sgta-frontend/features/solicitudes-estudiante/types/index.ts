// src/features/student-applications/types/index.ts

export type ApplicationStatus = 'enviada' | 'en_revision' | 'aceptada' | 'rechazada' | 'inscrito'; // Inscrito si ya se formalizó

// Resumen de una propuesta directa enviada por el estudiante
export interface ProposalSummary {
  id: string; // ID de la propuesta
  tituloPropuesto: string;
  asesorDestino: {
    id: string;
    nombre: string;
    avatar?: string;
  };
  fechaEnvio: string | Date;
  estado: ApplicationStatus;
  ultimoComentarioAsesor?: string; // Último feedback o motivo de rechazo
  linkToProposal?: string; // Enlace para ver/editar la propuesta si aún es posible
}

// Resumen de una postulación a un tema libre de un asesor
export interface PostulationSummary {
    id: string; // ID de la postulación
    temaLibre: {
        id: string;
        titulo: string;
    };
    asesorTema: {
      id: string;
      nombre: string;
      avatar?: string;
    };
    fechaPostulacion: string | Date;
    estado: ApplicationStatus;
    motivacionEnviada?: string; // Recordatorio de lo que envió
    ultimoComentarioAsesor?: string;
    linkToTheme?: string; // Enlace al tema libre original
}

// Datos combinados para el hook
export interface StudentApplicationsData {
    propuestasEnviadas: ProposalSummary[];
    postulacionesRealizadas: PostulationSummary[];
}