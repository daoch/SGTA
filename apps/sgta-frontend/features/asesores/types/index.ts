export type Profesor = {
  id: number; 
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correo: string;
  codigo: string;
  rolesAsignados: ("asesor" | "jurado")[]; 
  tesisActivas: number;
  estado: "activo"; 
};
