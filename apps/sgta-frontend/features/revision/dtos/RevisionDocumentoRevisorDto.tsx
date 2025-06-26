export interface RevisionDocumentoRevisorDto {
  id: number;
  titulo: string;
  entregable: string;
  estudiante: string;
  codigo: string;
  curso: string;
  fechaEntrega: string;
  fechaLimiteEntrega: string;
  fechaRevision: string;
  fechaLimiteRevision: string;
  ultimoCiclo: string;
  estado: 'pendiente' | 'en_proceso' | 'completada';
  urlDescarga: string;
}
