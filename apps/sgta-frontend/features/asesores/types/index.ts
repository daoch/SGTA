export type Profesor = {
  id: string;
  nombre: string;
  correo: string;
  codigo: string;
  avatarUrl?: string;
  rolesAsignados: ('asesor' | 'jurado')[];
  tesisActivas: number;
  estado: 'activo' | 'inactivo';
};

export type FiltrosProfesores = {
  search: string;
  rolAsignado: 'todos' | 'asesor' | 'jurado';
  estado: 'todos' | 'activo' | 'inactivo';
};