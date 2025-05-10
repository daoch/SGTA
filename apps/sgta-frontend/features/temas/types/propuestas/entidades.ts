export type Proyecto = {
  id: string;
  titulo: string;
  area: string;
  tesistas: { nombre: string; asignado: boolean }[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: string;
  descripcion: string;
  objetivos: string;
  metodologia: string;
  recursos: {
    nombre: string;
    tipo: string;
    fecha: string;
  }[];
  coasesores: string[];
};
