export interface RevisionDocumentoRevisorDto {
  revisionId: number;
  tema: string;
  entregable: string;
  estudiante: string;
  codigo: string;
  curso: string;
  fechaCarga: string;
  estadoRevision: "pendiente" | "en_proceso" | "completada";
  entregaATiempo: boolean;
  fechaLimite: string;
  fechaRevision: string;
  linkArchivo: string;
  fechaEnvio: string;
  fechaFin: string;
  numeroObservaciones: number;
}
