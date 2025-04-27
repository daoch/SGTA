// src/features/academic-staff-search/services/advisorDirectoryService.ts
//import apiClient from '@/lib/api';
import { AsesorInfo, AreaTematica } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATA ---
export const MOCK_AREAS_TEMATICAS: AreaTematica[] = [
  { id: 'cc', nombre: 'Ciencias de la Computación', descripcion: 'Fundamentos teóricos y algoritmos...' },
  { id: 'si', nombre: 'Sistemas de Información', descripcion: 'Gestión y aplicación de SI en organizaciones...' },
  { id: 'is', nombre: 'Ingeniería de Software', descripcion: 'Ciclo de vida, metodologías y arquitecturas...' },
  { id: 'ti', nombre: 'Tecnologías de Información', descripcion: 'Infraestructura, redes, seguridad y gestión TI...' },
  { id: 'ia', nombre: 'Inteligencia Artificial', descripcion: 'Machine learning, deep learning, NLP...' },
  { id: 'web', nombre: 'Desarrollo Web', descripcion: 'Tecnologías Frontend y Backend...' },
  { id: 'sec', nombre: 'Seguridad Informática', descripcion: 'Ciberseguridad, criptografía, hacking ético...' },
  { id: 'bd', nombre: 'Bases de Datos', descripcion: 'Modelado, gestión, SQL, NoSQL, Big Data...' },
  { id: 'hci', nombre: 'Interacción Humano-Computador', descripcion: 'Usabilidad, experiencia de usuario, diseño interfaces...' },
  // Añadir descripciones a todas las áreas mock
];

export const MOCK_ASESORES: AsesorInfo[] = [
    { id: 'P001', nombre: 'Manuel Vázquez', email: 'mvazquez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P001', rolAcademico: 'Profesor TPC', biografiaBreve: 'Experto en IA y aprendizaje automático, enfocado en aplicaciones sociales.', areasExpertise: [MOCK_AREAS_TEMATICAS[0], { id: 'area-009', nombre: 'Machine Learning' }], temasInteres: ['Ética en IA', 'Procesamiento de Lenguaje Natural'], cargaActual: 3, disponibleNuevos: true, linkPerfilCompleto: '/personal-academico/perfil/P001' },
    { id: 'P006', nombre: 'Carmen Ortiz', email: 'cortiz@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P006', rolAcademico: 'Profesor Asociado', biografiaBreve: 'Desarrolladora full-stack con pasión por arquitecturas limpias y escalables.', areasExpertise: [MOCK_AREAS_TEMATICAS[1], MOCK_AREAS_TEMATICAS[6], { id: 'area-010', nombre: 'Arquitectura de Software' }], cargaActual: 2, disponibleNuevos: true, linkPerfilCompleto: '/personal-academico/perfil/P006' },
    { id: 'P007', nombre: 'Roberto Gómez', email: 'rgomez@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P007', rolAcademico: 'Profesor TPA', biografiaBreve: 'Investigador en HCI y diseño de experiencias de usuario intuitivas.', areasExpertise: [MOCK_AREAS_TEMATICAS[4], { id: 'area-011', nombre: 'Diseño UX/UI' }], temasInteres: ['Accesibilidad Web', 'Gamificación'], cargaActual: 1, disponibleNuevos: true, linkPerfilCompleto: '/personal-academico/perfil/P007' },
    { id: 'P008', nombre: 'Lucía Mendoza', email: 'lmendoza@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P008', rolAcademico: 'Profesor Principal', biografiaBreve: 'Especialista en ciberseguridad y protección de sistemas distribuidos.', areasExpertise: [MOCK_AREAS_TEMATICAS[2], MOCK_AREAS_TEMATICAS[5], { id: 'area-012', nombre: 'Sistemas Distribuidos' }], cargaActual: 4, disponibleNuevos: false, linkPerfilCompleto: '/personal-academico/perfil/P008' },
    { id: 'P009', nombre: 'Eduardo Santos', email: 'esantos@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P009', rolAcademico: 'Profesor TPC', biografiaBreve: 'Arquitecto de datos y entusiasta de soluciones cloud.', areasExpertise: [MOCK_AREAS_TEMATICAS[3], { id: 'area-013', nombre: 'Cloud Computing' }], cargaActual: 2, disponibleNuevos: true, linkPerfilCompleto: '/personal-academico/perfil/P009' },
    { id: 'P013', nombre: 'Fernando Morales', email: 'fmorales@pucp.edu.pe', avatar: 'https://i.pravatar.cc/150?u=P013', rolAcademico: 'Profesor TPC', biografiaBreve: 'Ingeniero Eléctrico con enfoque en sistemas de potencia.', areasExpertise: [{ id: 'area-014', nombre: 'Circuitos Eléctricos'}, { id: 'area-015', nombre: 'Sistemas de Potencia'}], cargaActual: 2, disponibleNuevos: true, linkPerfilCompleto: '/personal-academico/perfil/P013' },
    { 
      id: 'P015', 
      nombre: 'Daniela Paredes', 
      email: 'dparedes@pucp.edu.pe', 
      avatar: 'https://i.pravatar.cc/150?u=P015', 
      rolAcademico: 'Profesor Auxiliar', 
      biografiaBreve: 'Especialista en inteligencia artificial aplicada a la robótica y visión computacional.', 
      areasExpertise: [{ id: 'area-016', nombre: 'Visión Computacional' }, { id: 'area-017', nombre: 'Robótica' }], 
      temasInteres: ['Drones autónomos', 'Sistemas de reconocimiento facial'], 
      cargaActual: 2, 
      disponibleNuevos: true, 
      linkPerfilCompleto: '/personal-academico/perfil/P015' 
  },
  { 
      id: 'P016', 
      nombre: 'Javier Rojas', 
      email: 'jrojas@pucp.edu.pe', 
      avatar: 'https://i.pravatar.cc/150?u=P016', 
      rolAcademico: 'Profesor Principal', 
      biografiaBreve: 'Investigador en ingeniería de software y metodologías ágiles con enfoque en proyectos a gran escala.', 
      areasExpertise: [{ id: 'area-018', nombre: 'Metodologías Ágiles' }, { id: 'area-019', nombre: 'DevOps' }], 
      temasInteres: ['Continuous Integration', 'Testing automatizado'], 
      cargaActual: 3, 
      disponibleNuevos: true, 
      linkPerfilCompleto: '/personal-academico/perfil/P016' 
  },
  { 
      id: 'P017', 
      nombre: 'María Teresa López', 
      email: 'mtlopez@pucp.edu.pe', 
      avatar: 'https://i.pravatar.cc/150?u=P017', 
      rolAcademico: 'Profesor Asociado', 
      biografiaBreve: 'Doctora en ciencias de la computación con enfoque en algoritmos de optimización y computación evolutiva.', 
      areasExpertise: [{ id: 'area-020', nombre: 'Algoritmos Evolutivos' }, { id: 'area-021', nombre: 'Optimización Computacional' }], 
      temasInteres: ['Algoritmos genéticos', 'Inteligencia de enjambre'], 
      cargaActual: 4, 
      disponibleNuevos: false, 
      linkPerfilCompleto: '/personal-academico/perfil/P017' 
  },
  { 
      id: 'P018', 
      nombre: 'Ricardo Palma', 
      email: 'rpalma@pucp.edu.pe', 
      avatar: 'https://i.pravatar.cc/150?u=P018', 
      rolAcademico: 'Profesor TPA', 
      biografiaBreve: 'Experto en bases de datos NoSQL y análisis de datos masivos para aplicaciones empresariales.', 
      areasExpertise: [{ id: 'area-022', nombre: 'Bases de Datos NoSQL' }, { id: 'area-023', nombre: 'Big Data' }], 
      temasInteres: ['MongoDB', 'Apache Kafka', 'Data Lakes'], 
      cargaActual: 1, 
      disponibleNuevos: true, 
      linkPerfilCompleto: '/personal-academico/perfil/P018' 
  },
  { 
      id: 'P019', 
      nombre: 'Ana Belén Castro', 
      email: 'abcastro@pucp.edu.pe', 
      avatar: 'https://i.pravatar.cc/150?u=P019', 
      rolAcademico: 'Profesor TPC', 
      biografiaBreve: 'Investigadora en el campo de la informática biomédica y bioinformática con aplicaciones en genómica.', 
      areasExpertise: [{ id: 'area-024', nombre: 'Bioinformática' }, { id: 'area-025', nombre: 'Computación Biomédica' }], 
      temasInteres: ['Secuenciación genómica', 'Medicina personalizada'], 
      cargaActual: 2, 
      disponibleNuevos: true, 
      linkPerfilCompleto: '/personal-academico/perfil/P019' 
  },
  { 
      id: 'P020', 
      nombre: 'Sergio Alvarado', 
      email: 'salvarado@pucp.edu.pe', 
      avatar: 'https://i.pravatar.cc/150?u=P020', 
      rolAcademico: 'Profesor Auxiliar', 
      biografiaBreve: 'Especialista en Internet de las Cosas y sistemas embebidos con experiencia en proyectos industriales.', 
      areasExpertise: [{ id: 'area-026', nombre: 'Internet de las Cosas' }, { id: 'area-027', nombre: 'Sistemas Embebidos' }], 
      temasInteres: ['Smart Cities', 'Industria 4.0'], 
      cargaActual: 2, 
      disponibleNuevos: true, 
      linkPerfilCompleto: '/personal-academico/perfil/P020' 
  }
];
// --- FIN MOCK DATA ---

/**
 * Obtiene la lista de áreas temáticas para los filtros.
 */
export const fetchFilterAreas = async (): Promise<AreaTematica[]> => {
    console.log("SERVICE: Fetching areas for filters...");
    await apiDelay(200);
    // try {
    //     const response = await apiClient.get<AreaTematica[]>('/api/areas-tematicas'); // Endpoint público
    //     return response.data;
    // } catch (error) { /* ... */ throw new Error("Error al cargar áreas."); }
    return [...MOCK_AREAS_TEMATICAS].sort((a,b) => a.nombre.localeCompare(b.nombre)); // Simulado
}

/**
 * Obtiene la lista de asesores habilitados y disponibles, opcionalmente filtrados.
 * El backend debería manejar el filtrado por eficiencia.
 */
export const fetchAdvisorsDirectory = async (filters: { searchTerm?: string; areaId?: string | null }): Promise<AsesorInfo[]> => {
  console.log("SERVICE: Fetching advisor directory with filters:", filters);
  await apiDelay(900);

  // --- SIMULACIÓN DE FILTRADO ---
  let results = MOCK_ASESORES.filter(a => a.disponibleNuevos); // Asumiendo que solo mostramos disponibles

  if (filters.searchTerm) {
    const lowerSearch = filters.searchTerm.toLowerCase();
    results = results.filter(a =>
      a.nombre.toLowerCase().includes(lowerSearch) ||
      a.areasExpertise.some(area => area.nombre.toLowerCase().includes(lowerSearch)) ||
      a.temasInteres?.some(tema => tema.toLowerCase().includes(lowerSearch))
    );
  }

  if (filters.areaId) {
    results = results.filter(a => a.areasExpertise.some(area => area.id === filters.areaId));
  }
  // --- FIN SIMULACIÓN ---

  // try {
  //     const response = await apiClient.get<AsesorInfo[]>('/api/directorio-asesores', { params: filters });
  //     return response.data;
  // } catch (error) { /* ... */ throw new Error("Error al buscar asesores."); }
  return results;
};