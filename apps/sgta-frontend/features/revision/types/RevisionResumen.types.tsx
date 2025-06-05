export interface RevisionResumen {
  id: string;
  titulo: string;
  entregable: string;
  estudiante: string;
  codigo: string;
  curso: string;
  fechaEntrega: string | null;
  fechaLimite: string;
  estado: "aprobado" | "rechazado" | "revisado" | "por-aprobar";
  porcentajePlagio: number | null;
  formatoValido: boolean | null;
  entregaATiempo: boolean | null;
  citadoCorrecto: boolean | null;
  observaciones: number;
  ultimoCiclo: string;
}
