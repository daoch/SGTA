// features/asesores/services/data.ts
import { Asesor } from '../types';

export const asesoresMock: Asesor[] = [
  {
    id: '1',
    nombre: 'Dra. Carla Soto',
    correo: 'carla.soto@uni.edu.pe',
    especialidad: 'Inteligencia Artificial',
    tesisActivas: 2,
    habilitado: true
  },
  {
    id: '2',
    nombre: 'Dr. Luis Mendez',
    correo: 'luis.mendez@uni.edu.pe',
    especialidad: 'Bases de Datos',
    tesisActivas: 0,
    habilitado: false
  }
];
