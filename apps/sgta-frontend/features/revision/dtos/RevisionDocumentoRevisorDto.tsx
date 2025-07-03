export interface RevisionDocumentoRevisorDto {
  id: number;
  titulo: string;
  entregable: string;
  estudiante: string;
  codigo: string;
  curso: string;
  porcentajeSimilitud: number | null;
  porcentajeGenIA: number | null;
  fechaEntrega: string;
  fechaLimiteEntrega: string | null;
  fechaRevision: string | null;
  fechaLimiteRevision: string | null;
  ultimoCiclo: string | null;
  estado: string;
  formatoValido: boolean | null;
  citadoCorrecto: boolean | null;
  urlDescarga: string | null;
}
