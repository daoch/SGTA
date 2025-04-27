// src/features/academic-staff-profile/types/index.ts

// Reutilizar AreaTematica si está centralizado
import { AreaTematica } from '@/features/configuracion-academica/types'; // Ajustar ruta

// Información para una tesis (simplificada para la lista)
interface ProfileProjectInfo {
    id: string;
    titulo: string;
    estudianteNombre: string;
    cicloFinalizacion?: string; // Para tesis pasadas
    estadoActual?: string;     // Para tesis actuales
    linkToProject?: string;    // Enlace al detalle del proyecto
}

// Datos completos del perfil del asesor
export interface AsesorProfileData {
    id: string;
    nombre: string;
    email: string;
    avatar?: string;
    departamento?: string;
    rolAcademico?: string; // TPC, TPA, etc.
    biografiaCompleta?: string; // Biografía sin truncar
    areasExpertise: AreaTematica[];
    temasInteres?: string[];
    // Disponibilidad y Carga (Datos potencialmente sensibles/variables)
    disponibleNuevos: boolean;
    cargaActual: number;
    // Enlaces profesionales (si los configuró)
    googleScholarLink?: string;
    researchGateLink?: string;
    orcidLink?: string;
    personalWebLink?: string;
    // Listas de proyectos
    proyectosActuales: ProfileProjectInfo[]; // Tesis en curso que asesora
    proyectosPasados: ProfileProjectInfo[];  // Tesis dirigidas y finalizadas
    // Podría haber más info: publicaciones, cursos, etc. pero mantenemos foco PFC
}

// Tipo para el rol del visitante (para mostrar/ocultar info)
export type ProfileViewerRole = 'estudiante' | 'asesor' | 'coordinador' | 'admin' | 'public';