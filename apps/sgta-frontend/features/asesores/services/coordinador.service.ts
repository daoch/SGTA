// src/features/asesores/services/coordinador.service.ts
import axiosInstance from "@/lib/axios/axios-instance"; // Tu instancia configurada de Axios
import axios from "axios"; // Para el type guard isAxiosError
import { ELEMENTS_PER_PAGE_DEFAULT } from "@/lib/constants"; // Constante para el tamaño de página por defecto

// Importar los tipos relevantes desde el nuevo archivo de tipos para reasignaciones
import {
  IReasignacionesPendientesListResponseFetched, // Lo que devuelve el backend (Page<ReasignacionPendienteDto>)
  IReasignacionesPendientesListProcessed,     // Lo que queremos que devuelva este servicio (con fechas transformadas)
  IReasignacionPendienteFetched,              // Tipo de cada item en la respuesta raw
  IReasignacionPendienteTransformed,          // Tipo de cada item transformado
  IReasignacionesPendientesSearchCriteria,    // Para los parámetros de la API
} from "@/features/asesores/types/reasignacion.types"; // Ajusta la ruta

/**
 * Obtiene la lista paginada de solicitudes de cese aprobadas que están
 * pendientes de reasignación de asesor, para el coordinador autenticado.
 */
export async function getReasignacionesPendientes(
  searchCriteria: IReasignacionesPendientesSearchCriteria
): Promise<IReasignacionesPendientesListProcessed> {
  const endpointPath = "coordinador/solicitudes-cese/reasignaciones-pendientes"; // Coincide con el @GetMapping
  
  // Definimos apiParams con tipos más específicos en lugar de 'any'
  const apiParams: Record<string, string | number> = {
    page: searchCriteria.page,
    size: searchCriteria.size || ELEMENTS_PER_PAGE_DEFAULT,
  };

  if (searchCriteria.searchTerm && searchCriteria.searchTerm.trim() !== "") {
    apiParams.searchTerm = searchCriteria.searchTerm;
  }
  // Aquí podrías añadir más filtros si los implementas en el backend, ej:
  // if (searchCriteria.estadoReasignacion) {
  //   apiParams.estadoReasignacion = searchCriteria.estadoReasignacion;
  // }

  console.log(`[API_CALL] GET ${endpointPath} with params:`, apiParams);

  try {
    const response = await axiosInstance.get<IReasignacionesPendientesListResponseFetched>(
      endpointPath, // No es necesario el /api/ si axiosInstance.baseURL ya lo tiene
      { params: apiParams }
    );

    console.log(
      `[API_SUCCESS] GET ${endpointPath} raw data:`,
      JSON.stringify(response.data, null, 2)
    );
    const fetchedData = response.data;

    // Transformar los datos (ej. strings de fecha a objetos Date)
    const transformedReasignaciones: IReasignacionPendienteTransformed[] = (
      fetchedData.content || []
    ).map((item: IReasignacionPendienteFetched) => ({
      ...item,
      fechaAprobacionCese: new Date(item.fechaAprobacionCese),
      fechaPropuestaNuevoAsesor: item.fechaPropuestaNuevoAsesor
        ? new Date(item.fechaPropuestaNuevoAsesor)
        : null,
    }));

    const processedData: IReasignacionesPendientesListProcessed = {
      reasignaciones: transformedReasignaciones,
      totalPages: fetchedData.totalPages,
      totalElements: fetchedData.totalElements,
      currentPage: fetchedData.number, // 'number' es la página actual 0-indexed de Spring Page
      pageSize: fetchedData.size,
    };
    console.log(`[API_PROCESSED] GET ${endpointPath} processed data:`, processedData);
    return processedData;
  } catch (error) {
    console.error(`[API_ERROR] GET ${endpointPath}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `[API_ERROR_DATA] GET ${endpointPath} error data:`,
        JSON.stringify(error.response.data, null, 2)
      );
    }
    // Devolver una estructura vacía válida en caso de error para que el hook no falle
    return {
      reasignaciones: [],
      totalPages: 0,
      totalElements: 0,
      currentPage: searchCriteria.page,
      pageSize: searchCriteria.size || ELEMENTS_PER_PAGE_DEFAULT,
    };
  }
}
