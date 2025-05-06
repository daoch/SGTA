export interface SubAreaConocimiento {
    id: number;
    nombre: string;
    areaConocimientoId: number;
}

export interface Area {
    id: number;
    nombre: string;
    descripcion: string;
    subAreas?: SubAreaConocimiento[];
}