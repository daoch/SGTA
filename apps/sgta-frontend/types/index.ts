/**
 * Interfaz genérica para describir la configuración de ordenamiento de una tabla.
 * @template T El tipo de objeto que contienen las filas de la tabla.
 */
export interface SortConfig<T> {
    /** La clave (propiedad) del objeto T por la cual se está ordenando, o null si no hay ordenamiento. */
    key: keyof T | null;
    /** La dirección del ordenamiento ('asc' o 'desc'). */
    direction: 'asc' | 'desc';
  }
  
  // Otros tipos globales que puedas necesitar...
  export type UserRole = 'coordinador' | 'asesor' | 'jurado' | 'administrador' | 'estudiante';