export interface EntregableAlumnoDto {
  entregableId: number;
  entregableNombre: string;
  entregableDescripcion: string;
  entregableFechaInicio: string;
  entregableFechaFin: string;
  entregableEstado: string;
  entregableEsEvaluable: boolean;
  entregableMaximoDocumentos: number;
  entregableExtensionesPermitidas: string;
  entregablePesoMaximoDocumento: number;
  etapaFormativaId: number;
  etapaFormativaNombre: string;
  cicloId: number;
  cicloNombre: string;
  cicloAnio: number;
  cicloSemestre: string;
  temaId: number;
  entregableFechaEnvio: string | null;
  entregableComentario: string | null;
  entregableXTemaId: number;
  corregido: boolean;
}