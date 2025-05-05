export interface TemaForm {
  tipoRegistro: string;
  titulo: string;
  areaInvestigacion: string;
  descripcion: string;
  coasesores: string[];
  asesorPrincipal: string;
  estudiantes: string[];
  requisitos?: string;
  fechaLimite?: string;
}
