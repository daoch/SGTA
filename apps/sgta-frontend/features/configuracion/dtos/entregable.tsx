export interface Entregable {
  id?: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string; //ISO 8601 string
  fechaFin: string;    //ISO 8601 string
  esEvaluable: boolean;
  maximoDocumentos: number | null;
  extensionesPermitidas: string | null;
  pesoMaximoDocumento: number | null;
};
