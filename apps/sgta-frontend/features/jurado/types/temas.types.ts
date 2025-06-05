export interface Profesor {
    id: number;
    nombres: string;
    primerApellido: string;
    segundoApellido: string;
    codigoPucp: string;
    correoElectronico: string;
    tipoDedicacion: string;
    cantTemasAsignados: number;
    areasConocimientoIds: number[];
}