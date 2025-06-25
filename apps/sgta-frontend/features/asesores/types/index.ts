export type Profesor = {
  id: number; 
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correo: string;
  codigo: string;
  rolesAsignados: ("asesor" | "jurado")[]; 
  tesisAsesor: number;
  tesisJurado: number;
  estado: "activo"; 
};
