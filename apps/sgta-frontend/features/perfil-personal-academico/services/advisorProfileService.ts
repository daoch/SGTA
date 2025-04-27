// src/features/academic-staff-profile/services/advisorProfileService.ts
//import apiClient from '@/lib/api';
import { AsesorProfileData } from '../types';
// Importar Mocks si es necesario
import { MOCK_ASESORES, MOCK_AREAS_TEMATICAS } from '@/features/busqueda-personal-academico/services/advisorDirectoryService'; // Reutilizar mocks

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene los datos completos del perfil de un asesor específico.
 * El backend podría adaptar la info devuelta según el rol del solicitante.
 */
export const fetchAdvisorProfile = async (asesorId: string): Promise<AsesorProfileData | null> => {
    console.log(`SERVICE: Fetching profile for advisor ${asesorId}...`);
    await apiDelay(700);

    // --- SIMULACIÓN ---
    const asesorBase = MOCK_ASESORES.find(a => a.id === asesorId);
    if (!asesorBase) {
        console.error(`Mock advisor with ID ${asesorId} not found.`);
        // En una API real, esto sería un 404
        // throw new Error("Perfil de asesor no encontrado."); 
        return null; // Devolver null si no se encuentra
    }

    // Simular datos adicionales del perfil
    const profileData: AsesorProfileData = {
        ...asesorBase,
        biografiaCompleta: asesorBase.biografiaBreve + " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", // Bio más larga
        googleScholarLink: `https://scholar.google.com/citations?user=fake_${asesorId}`,
        orcidLink: `https://orcid.org/0000-0002-xxxx-${asesorId}`,
        proyectosActuales: [
            // Datos simulados de proyectos actuales
            { id: 'PROY_A1', titulo: `Proyecto Actual 1 de ${asesorBase.nombre}`, estudianteNombre: 'Estudiante Uno', estadoActual: 'Desarrollo Avance 2', linkToProject: '/proyectos/PROY_A1' },
            ...(asesorBase.cargaActual > 1 ? [{ id: 'PROY_A2', titulo: `Proyecto Actual 2 de ${asesorBase.nombre}`, estudianteNombre: 'Estudiante Dos', estadoActual: 'Esperando Revisión E1', linkToProject: '/proyectos/PROY_A2' }] : []),
            ...(asesorBase.cargaActual > 2 ? [{ id: 'PROY_A3', titulo: `Proyecto Actual 3 de ${asesorBase.nombre}`, estudianteNombre: 'Estudiante Tres', estadoActual: 'Planificación', linkToProject: '/proyectos/PROY_A3' }] : []),

        ].slice(0, asesorBase.cargaActual), // Ajustar al número real de carga
        proyectosPasados: [
            // Datos simulados de proyectos pasados
            { id: 'PROY_P1', titulo: 'Proyecto Pasado Exitoso A', estudianteNombre: 'Ex Alumno A', cicloFinalizacion: '2024-1', linkToProject: '/proyectos/PROY_P1' },
            { id: 'PROY_P2', titulo: 'Proyecto Pasado Exitoso B', estudianteNombre: 'Ex Alumno B', cicloFinalizacion: '2023-2', linkToProject: '/proyectos/PROY_P2' },
        ]
    };
    // --- FIN SIMULACIÓN ---

    // try {
    //     // La API podría requerir autenticación para ver ciertos datos
    //     const response = await apiClient.get<AsesorProfileData>(`/api/asesores/${asesorId}/perfil`);
    //     return response.data;
    // } catch (error: any) {
    //     if (error.response && error.response.status === 404) {
    //         return null; // Manejar Not Found
    //     }
    //     console.error(`Error fetching profile for advisor ${asesorId}:`, error);
    //     throw new Error("No se pudo cargar el perfil del asesor.");
    // }
    return profileData;
};