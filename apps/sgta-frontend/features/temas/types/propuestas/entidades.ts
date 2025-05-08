export type Proyecto = {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
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
};
