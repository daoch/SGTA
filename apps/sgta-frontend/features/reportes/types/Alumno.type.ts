export interface AlumnoTemaDetalle {
    id: number;
    temaNombre: string;
    asesorNombre: string;
    coasesorNombre: string;
    areaNombre: string;
    subAreaNombre: string;
    totalEntregables: number;
    entregablesEnviados: number;
    porcentajeProgreso: number;
    siguienteEntregableFechaFin: string;
    siguienteEntregableNombre: string;
}

export interface AlumnoReviewer {
  usuarioId: number;
  codigoPucp: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  temaTitulo: string;
  asesor: string;
  coasesor?: string;
  etapaFormativaNombre?: string;
  activo?: boolean;
  temaId?: number;
}