export interface AreaConocimientoDto {
    id: number;
    nombre: string;
    descripcion: string;
    idCarrera: number;
    subAreas?: SubAreaConocimientoDto[];
}

export interface SubAreaConocimientoDto {
    id: number;
    nombre: string;
    areaConocimiento: {
        id: number;
    };
}
