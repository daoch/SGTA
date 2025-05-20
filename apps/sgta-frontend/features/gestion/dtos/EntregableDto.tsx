export interface EntregableDto {
  id: number;
  etapaFormativaXCicloId: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string; // o Date
  fechaFin: string;    // o Date
  estado: string;
  esEvaluable: boolean;
  maximoDocumentos: number;
  extensionesPermitidas: string;
  pesoMaximoDocumento: number;
  fechaEnvio: string | null; // o Date
}
