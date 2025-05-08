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

export interface SubAreaType {
  id: number;
  nombre: string;
}

export interface AreaType {
  id: number;
  nombre: string;
  descripcion: string;
  subAreas: SubAreaType[];
  idCarrera?: number;
}

export interface AreaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  idCarrera: number;
}