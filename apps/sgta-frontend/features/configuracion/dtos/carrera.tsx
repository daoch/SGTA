export interface Carrera {
  id: string;
  nombre: string;
};

export interface CarreraCreateDto {
  codigo: string;
  nombre: string;
  descripcion: string;
  unidadAcademica: string;
};
