interface ObservacionAlumnoDTO {
  observacionId: number;
  comentario: string;
  contenido: string;
  numeroPaginaInicio: number;
  numeroPaginaFin: number;
  tipoObservacionId: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  revisionId: number;
  usuarioCreacionId: number;
  rolesUsuario: string; // Ejemplo: "1,4"
  roles: number[];      // Nuevo atributo: arreglo de roles como números
  fechaCreacion: string;
  activo: boolean | null;
  corregido: boolean | null;
  estado: string; // Ejemplo: "Pendiente", "Corregido", etc.
  // Agrega otros campos si los necesitas
}