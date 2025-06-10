interface DetalleSimplificadoEntregable {
  entregableId: number;
  entregableNombre: string;
  entregableDescripcion: string;
  entregableFechaInicio: string | null;
  entregableFechaFin: string | null;
  entregableEstado: string;
  entregableEsEvaluable: boolean;
  entregableMaximoDocumentos: number | null;
  entregableExtensionesPermitidas: string | null;
  entregablePesoMaximoDocumento: number | null;
  etapaFormativaId: number | null;
  etapaFormativaNombre: string | null;
  cicloId: number | null;
  cicloNombre: string | null;
  cicloAnio: number | null;
  cicloSemestre: number | null;
  temaId: number;
  entregableFechaEnvio: string;
  entregableComentario: string | null;
  entregableXTemaId: number | null;
}
