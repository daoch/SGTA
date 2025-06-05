import { Carrera } from "./carrera";
import { Tesista } from "./tesista";

export interface TemaPorAsociar {
  id?: number;
  codigo: string;
  titulo: string;
  estadoTemaNombre: string;
  carrera: Carrera;
  tesistas: Tesista[];
};