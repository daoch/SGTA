// src/features/academic-cycle-settings/types/index.ts

export interface CicloAcademico {
    id: string; // Ej: "2025-1"
    nombre: string; // Ej: "Ciclo Académico 2025-1"
    estado: 'activo' | 'proximo' | 'cerrado';
    fechaInicio: string | Date; // ISO string o Date object
    fechaFin: string | Date;   // ISO string o Date object
  }
  
  // Representa la definición de un hito clave (independiente del ciclo)
  export interface HitoPFC {
    id: string; // Ej: "inscripcion_tema_limite"
    nombre: string; // Ej: "Inscripción de Tema Límite"
    etapa?: 'Tesis 1' | 'Tesis 2' | 'General'; // Opcional
    descripcion?: string; // Opcional
  }
  
  // Representa la fecha específica para un hito en un ciclo
  export interface FechaLimiteCiclo {
    hitoId: string;
    cicloId: string;
    fechaLimite: string | Date | null; // Puede no estar definida aún
    // horaLimite?: string; // Opcional
  }
  
  // Tipo combinado para usar en la UI (Tabla/Hook)
  export interface DeadlineItem {
    hitoId: string;
    nombreHito: string;
    etapa?: 'Tesis 1' | 'Tesis 2' | 'General';
    fechaLimiteActual: Date | null; // Usamos Date para el DatePicker
    // Podríamos añadir más campos del HitoPFC si son necesarios para mostrar
  }