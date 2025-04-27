// src/features/academic-staff-search/types/index.ts

// Podrías reutilizar el tipo AreaTematica de la otra feature si está centralizado
export interface AreaTematica {
    id: string;
    nombre: string;
    descripcion?: string;
}

// Información PÚBLICA del asesor para el directorio
export interface AsesorInfo {
  id: string; // ID del profesor/usuario
  nombre: string;
  email: string; // Opcional, quizás solo mostrarlo si el usuario es Asesor?
  avatar?: string;
  departamento?: string; // Opcional
  rolAcademico?: string; // Ej: TPC, TPA, Asociado
  biografiaBreve?: string; // Primeras líneas o resumen
  areasExpertise: AreaTematica[]; // Lista de áreas principales
  temasInteres?: string[]; // Temas específicos (opcional)
  cargaActual: number; // Visible solo para Coordinador/Admin? O un indicador general?
  disponibleNuevos?: boolean; // Indicador simple de disponibilidad
  linkPerfilCompleto: string; // Enlace a una vista de perfil más detallada
  // Podría incluir link a Google Scholar, ResearchGate si el asesor los configuró
}

// Para los filtros
export interface AdvisorFilters {
    searchTerm: string;
    areaTematicaId: string | null; // Filtrar por una o varias áreas
    // Podrían añadirse más filtros: departamento, disponibilidad, etc.
}