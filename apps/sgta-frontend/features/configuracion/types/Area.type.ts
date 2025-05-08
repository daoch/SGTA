export interface AreaConocimientoDto {
    id: number;
    nombre: string;
    activo?: boolean;
    descripcion: string;
    idCarrera: number;
    subAreas?: SubAreaConocimientoDto[];
}

export interface SubAreaConocimientoDto {
    id: number;
    nombre: string;
    activo?: boolean;
    areaConocimiento: {
        id: number;
    };
}
