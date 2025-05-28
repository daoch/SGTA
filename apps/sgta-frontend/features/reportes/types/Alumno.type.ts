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