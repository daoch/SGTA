import axiosInstance from "@/lib/axios/axios-instance"; // Ajusta la ruta si es necesario
import {
  // Tipos para el listado de solicitudes de cese del coordinador
  IRequestTerminationConsultancyListSearchCriteria,       // Renombrado desde IRequestTerminationConsultancySearchFields para el listado
  ITerminationConsultancyListProcessed,            // Renombrado desde ITerminationConsultancyRequest
  ITerminationConsultancyListResponseFetched,      // Renombrado desde ITerminationConsultancyRequestFetched
  ICessationRequestDataFetched,                    // Renombrado y ajustado
  ICessationRequestDataTransformed,                // Renombrado y ajustado

  // Tipos para el detalle de una solicitud (asumiendo que los DTOs del backend son diferentes)
  ICessationRequestDataViewDetailTransformed,      // Renombrado y ajustado
  ICessationRequestDataViewDetailFetched,          // Renombrado y ajustado

  // Tipos para la lista de asesores disponibles (si este servicio también lo maneja)
  ICessationRequestSearchCriteriaAvailableAdvisorList,
  IListAvailableAdvisorResponseFetched,            // Renombrado para claridad
  ICreateCessationRequestPayload,
  ICessationRequestCreationResponse,
  ProposeReassignmentPayloadService
} from "@/features/asesores/types/cessation-request"; // Ajusta la ruta si es necesario
import axios from "axios";
import { isValid } from "date-fns";

const ELEMENTS_PER_PAGE = 10; // Constante para paginación, puedes moverla a un archivo de constantes si se usa en más lugares

// --- Servicios para Solicitudes de Cese de Asesoría ---


/**
 * Obtiene la lista de solicitudes de cese de asesoría para el coordinador autenticado.
 */
export async function getTerminationConsultancyList(
  searchCriteria: IRequestTerminationConsultancyListSearchCriteria,
): Promise<ITerminationConsultancyListProcessed> {
  const endpointPath = `solicitudes/coordinador/my-cessation-requests`;

  try {
    const response = await axiosInstance.get<ITerminationConsultancyListResponseFetched>(endpointPath, {
      params: {
        page: searchCriteria.page,
        size: ELEMENTS_PER_PAGE,
        status: searchCriteria.status,            
        ...(searchCriteria.fullNameEmail
        ? { fullNameEmail: searchCriteria.fullNameEmail.trim() }
        : {}),
      },
    });

    // Log de la respuesta raw (datos crudos del backend)
    console.log(`[API_RAW_RESPONSE] GET ${endpointPath} data:`, JSON.stringify(response.data, null, 2)); // Usamos JSON.stringify para una mejor visualización de objetos complejos

    const data: ITerminationConsultancyListResponseFetched = response.data;

    const transformedRequests: ICessationRequestDataTransformed[] = (data.requestTermmination || []).map(
      (item: ICessationRequestDataFetched, index: number) => {
        console.log(`[API_TRANSFORM_ITEM_${index}] Original item.registerTime:`, item.registerTime);
        console.log(`[API_TRANSFORM_ITEM_${index}] Original item.responseTime:`, item.responseTime);

        const registerDate = new Date(item.registerTime);
        const responseDate = item.responseTime ? new Date(item.responseTime) : null;

        console.log(`[API_TRANSFORM_ITEM_${index}] Parsed registerDate object:`, registerDate);
        if (isValid(registerDate)) {
          console.log(`[API_TRANSFORM_ITEM_${index}] registerDate.toISOString():`, registerDate.toISOString());
          console.log(`[API_TRANSFORM_ITEM_${index}] registerDate.toString() (Local Browser):`, registerDate.toString());
        } else {
          console.warn(`[API_TRANSFORM_ITEM_${index}] registerTime "${item.registerTime}" parsed to an invalid Date.`);
        }
        
        console.log(`[API_TRANSFORM_ITEM_${index}] Parsed responseDate object:`, responseDate);
        if (responseDate && isValid(responseDate)) {
          console.log(`[API_TRANSFORM_ITEM_${index}] responseDate.toISOString():`, responseDate.toISOString());
          console.log(`[API_TRANSFORM_ITEM_${index}] responseDate.toString() (Local Browser):`, responseDate.toString());
        } else if (item.responseTime) {
            console.warn(`[API_TRANSFORM_ITEM_${index}] responseTime "${item.responseTime}" parsed to an invalid Date.`);
        }


        return {
          ...item,
          registerTime: registerDate,
          responseTime: responseDate,
        };
      },
    );

    console.log(`[API] Solicitudes de cese obtenidas y transformadas: ${transformedRequests.length} registros`);
    return {
      requestTermmination: transformedRequests,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error(`[API_ERROR] GET ${endpointPath}:`, error);
    // Si hay un error en la respuesta de Axios, también podría ser útil loguear error.response.data
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] GET ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    return { requestTermmination: [], totalPages: 0 };
  }
}


/**
 * Rechaza una solicitud de cese de asesoría.
 */
export async function rejectTerminationConsultancyRequest(
  requestId: number,
  responseText: string, // Motivo del rechazo
): Promise<void> { // La mutación en el backend devuelve void (200 OK)
  const endpointPath = `solicitudes/${requestId}/reject`; // Ajusta la ruta base si es necesario (ej. /api/v1/)

  console.log(`[API_CALL] PUT ${endpointPath} with payload:`, { responseText });

  // El backend espera un cuerpo: { "responseText": "motivo del rechazo" }
  // El backend espera un método PUT
  await axiosInstance.put(endpointPath, { // CAMBIADO A PUT
    responseText: responseText,           // CAMBIADO a responseText
  });
  console.log(`[API] Solicitud ${requestId} rechazada con éxito (llamada enviada).`);
}

/**
 * Obtiene el detalle de una solicitud específica de cese de asesoría.
 * NOTA: El backend actual usa GET para esto, pero tu código original usaba POST.
 * He asumido GET basado en el controlador que me mostraste:
 * @GetMapping("/cessation-requests/{requestId}")
 * public ResponseEntity<DetalleSolicitudCeseDto> getDetalleSolicitudesCese(@PathVariable Integer requestId)
 * Si es POST, debes cambiar axiosInstance.get a axiosInstance.post y enviar el body.
 */
export async function getTerminationConsultancyRequestDetail(
  requestId: number,
): Promise<ICessationRequestDataViewDetailTransformed | null> {
  // Endpoint del backend para detalle:
  const endpointPath = `solicitudes/cessation-requests/${requestId}/details`;

  try {
    const response = await axiosInstance.get<ICessationRequestDataViewDetailFetched>(endpointPath);
    const data: ICessationRequestDataViewDetailFetched = response.data;

    if (!data) return null; // Si el backend devuelve 204 o un cuerpo vacío para un no encontrado

    const transformedDetail: ICessationRequestDataViewDetailTransformed = {
      ...data,
      registerTime: new Date(data.registerTime),
      responseTime: data.responseTime ? new Date(data.responseTime) : null,
      // La lógica de students para advisorId: null que tenías puede necesitarse aquí
      // dependiendo de lo que la UI espere y lo que el backend devuelva para esta vista.
      // students: data.status === "pending" && data.students
      //     ? data.students.map((student) => ({ ...student, advisorId: null })) // Esto parece lógica de UI, no del servicio API
      //     : data.students,
    };

    console.log(`[API] Detalle de solicitud ${requestId} obtenido con éxito.`);
    return transformedDetail;
  } catch (error) {
    console.error(`[API_ERROR] GET ${endpointPath}:`, error);
    // Puedes verificar si error.response.status es 404 y devolver null específicamente
    // if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    return null; // O re-lanzar el error
  }
}


// --- Servicios Relacionados con Asesores (si pertenecen a este módulo) ---

/**
 * Obtiene la lista de asesores disponibles para una posible asignación en cese/cambio.
 * Llama a un endpoint GET en el backend.
 */
export async function getAvailableAdvisorList(
  searchCriteria: ICessationRequestSearchCriteriaAvailableAdvisorList,
): Promise<IListAvailableAdvisorResponseFetched | null> {
  const endpointPath = `coordinador/asesores-disponibles`; // Coincide con el @GetMapping del backend

  // Construir el objeto de parámetros para la query URL
  const apiParams: Record<string, any> = {
    page: searchCriteria.page, // El backend espera 'page' para Pageable
    size: ELEMENTS_PER_PAGE,   // El backend espera 'size' para Pageable
    // sort: "primerApellido,asc" // El backend tiene un @PageableDefault, pero puedes sobrescribirlo si es necesario
  };

  if (searchCriteria.fullNameEmailCode && searchCriteria.fullNameEmailCode.trim() !== "") {
    apiParams.searchTerm = searchCriteria.fullNameEmailCode; // Coincide con @RequestParam String searchTerm
  }

  if (searchCriteria.idThematicAreas && searchCriteria.idThematicAreas.length > 0) {
    // Axios enviará esto como parámetros repetidos: areaConocimientoIds=1&areaConocimientoIds=2
    // Spring MVC lo mapeará a List<Integer> areaConocimientoIds
    apiParams.areaConocimientoIds = searchCriteria.idThematicAreas;
  }

  console.log(`[API_CALL] GET ${endpointPath} with params:`, apiParams);

  try {
    const response = await axiosInstance.get<IListAvailableAdvisorResponseFetched>(
      `${endpointPath}`, // Recuerda el /api/ si es parte de tu baseURL o lo necesitas aquí
      { params: apiParams } // Pasar los parámetros para una petición GET
    );

    console.log(`[API_SUCCESS] GET /api/${endpointPath}. Asesores obtenidos:`, response.data?.content?.length);
    return response.data; // El backend devuelve un objeto Page, que Jackson serializa a algo como IListAvailableAdvisorResponseFetched
  } catch (error) {
    console.error(`[API_ERROR] GET /api/${endpointPath}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] GET /api/${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    return null; // O re-lanzar el error para que React Query lo maneje y muestre un estado de error
  }
}


/**
 * Llama al backend para que un asesor cree una nueva solicitud de cese.
 */
export async function createCessationRequest(
  payload: ICreateCessationRequestPayload
): Promise<ICessationRequestCreationResponse> {
  const endpointPath = `asesor/solicitudes-cese`; // Ruta del API (ej. /asesor/solicitudes-cese)
  console.log(`[API_CALL] POST ${endpointPath} with payload:`, payload);
  try {
    // Asegúrate que axiosInstance esté configurado para incluir el token de autenticación
    const response = await axiosInstance.post<ICessationRequestCreationResponse>(`${endpointPath}`, payload);
    console.log(`[API_SUCCESS] POST ${endpointPath} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[API_ERROR] POST ${endpointPath}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] POST ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    throw error; // Relanzar para que React Query lo maneje
  }
}

/**
 * Llama al backend para que el coordinador proponga una reasignación de asesor.
 */
export async function proposeReassignmentForTermination( // <<--- FUNCIÓN AÑADIDA/ASEGURADA
  solicitudDeCeseOriginalId: number,
  payload: ProposeReassignmentPayloadService, // Usa el tipo definido arriba o importado
): Promise<void> { // Asumiendo que el backend devuelve 200 OK sin cuerpo o un mensaje simple
  // La ruta del API debe coincidir con la definida en el controller del backend
  const endpointPath = `coordinador/solicitudes-cese/${solicitudDeCeseOriginalId}/proponer-reasignacion`;

  // El payload solo necesita nuevoAsesorPropuestoId según el DTO del backend
  // PropuestaReasignacionRequestComplemento.java
  const requestBody = {
    nuevoAsesorPropuestoId: payload.nuevoAsesorPropuestoId,
  };

  console.log(`[API_CALL] POST ${endpointPath} with body:`, requestBody);

  try {
    // El backend devuelve un ResponseEntity.ok().body(Map.of("mensaje", "..."));
    // así que podemos esperar un objeto simple o simplemente no preocuparnos por el tipo de respuesta si es void.
    await axiosInstance.post(`${endpointPath}`, requestBody);
    console.log(`[API_SUCCESS] POST ${endpointPath} - Propuesta de reasignación enviada.`);
    // No se espera un cuerpo de respuesta significativo (void para la mutación)
  } catch (error) {
    console.error(`[API_ERROR] POST ${endpointPath}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API_ERROR_DATA] POST ${endpointPath} error data:`, JSON.stringify(error.response.data, null, 2));
    }
    throw error; // Relanzar para que React Query lo maneje
  }
}