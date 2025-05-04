// features/asesores/services/data/profesores.ts
import { Profesor } from '../types';

export const profesoresMock: Profesor[] = [
  {
    id: '1', nombre: 'Manuel Vázquez', correo: 'mvazquez@pucp.edu.pe', codigo: '20150734', avatarUrl: 'https://i.pravatar.cc/150?u=P001', rolesAsignados: ['asesor', 'jurado'], tesisActivas: 3, estado: 'activo',
  },
  {
    id: '2', nombre: 'Laura Martínez', correo: 'lmartinez@pucp.edu.pe', codigo: '19980452', avatarUrl: 'https://i.pravatar.cc/150?u=P002', rolesAsignados: ['asesor'], tesisActivas: 2, estado: 'inactivo',
  },
  {
    id: '3', nombre: 'Ana González', correo: 'agonzalez@pucp.edu.pe', codigo: '20050326', avatarUrl: 'https://i.pravatar.cc/150?u=P003', rolesAsignados: ['jurado'], tesisActivas: 0, estado: 'activo',
  },
  {
    id: '4', nombre: 'Carlos Pérez', correo: 'cperez@pucp.edu.pe', codigo: '20060444', avatarUrl: 'https://i.pravatar.cc/150?u=P004', rolesAsignados: ['asesor'], tesisActivas: 1, estado: 'activo',
  },
  {
    id: '5', nombre: 'Elena Torres', correo: 'etorres@pucp.edu.pe', codigo: '20070455', avatarUrl: 'https://i.pravatar.cc/150?u=P005', rolesAsignados: ['asesor', 'jurado'], tesisActivas: 2, estado: 'inactivo',
  },
  {
    id: '6', nombre: 'Gabriel Díaz', correo: 'gdiaz@pucp.edu.pe', codigo: '20080466', avatarUrl: 'https://i.pravatar.cc/150?u=P006', rolesAsignados: ['jurado'], tesisActivas: 0, estado: 'activo',
  },
  {
    id: '7', nombre: 'Rosa Gutiérrez', correo: 'rgutierrez@pucp.edu.pe', codigo: '20090477', avatarUrl: 'https://i.pravatar.cc/150?u=P007', rolesAsignados: ['asesor'], tesisActivas: 4, estado: 'inactivo',
  },
  {
    id: '8', nombre: 'Luis Mendoza', correo: 'lmendoza@pucp.edu.pe', codigo: '20100488', avatarUrl: 'https://i.pravatar.cc/150?u=P008', rolesAsignados: ['asesor', 'jurado'], tesisActivas: 1, estado: 'activo',
  },
  {
    id: '9', nombre: 'Valeria Ramírez', correo: 'vramirez@pucp.edu.pe', codigo: '20110499', avatarUrl: 'https://i.pravatar.cc/150?u=P009', rolesAsignados: ['asesor'], tesisActivas: 3, estado: 'activo',
  },
  {
    id: '10', nombre: 'Jorge Salazar', correo: 'jsalazar@pucp.edu.pe', codigo: '20120500', avatarUrl: 'https://i.pravatar.cc/150?u=P010', rolesAsignados: ['jurado'], tesisActivas: 0, estado: 'inactivo',
  },
  {
    id: '11', nombre: 'Patricia Silva', correo: 'psilva@pucp.edu.pe', codigo: '20130511', avatarUrl: 'https://i.pravatar.cc/150?u=P011', rolesAsignados: ['asesor'], tesisActivas: 2, estado: 'activo',
  },
  {
    id: '12', nombre: 'Mario López', correo: 'mlopez@pucp.edu.pe', codigo: '20140522', avatarUrl: 'https://i.pravatar.cc/150?u=P012', rolesAsignados: ['asesor', 'jurado'], tesisActivas: 1, estado: 'activo',
  },
  {
    id: '13', nombre: 'Carmen Castro', correo: 'ccastro@pucp.edu.pe', codigo: '20150533', avatarUrl: 'https://i.pravatar.cc/150?u=P013', rolesAsignados: ['jurado'], tesisActivas: 0, estado: 'inactivo',
  },
];
