// features/asesores/hooks/useCessationRequestQueries.ts (o el nombre que uses)

import { useMutation, useQuery, UseQueryResult, UseMutationResult, useQueryClient } from "@tanstack/react-query";

// Importa los servicios actualizados (ajusta la ruta si es diferente)
import {
  getTerminationConsultancyList,
  getTerminationConsultancyRequestDetail, // Renombrado para claridad
  getAvailableAdvisorList,                 // Renombrado para claridad
  rejectTerminationConsultancyRequest,
  createCessationRequest,
  proposeReassignmentForTermination
} from "../services/solicitud-cese-asesoria"; // Asume este nombre de archivo para servicios

// Importa los tipos actualizados (ajusta la ruta si es diferente)
import {
  IRequestTerminationConsultancyListSearchCriteria, // Para el listado principal
  ITerminationConsultancyListProcessed,      // Lo que devuelve getTerminationConsultancyList
  ICessationRequestDataViewDetailTransformed,  // Lo que devuelve getTerminationConsultancyRequestDetail
  ICessationRequestSearchCriteriaAvailableAdvisorList, // Para la lista de asesores
  IListAvailableAdvisorResponseFetched,        // Lo que devuelve getAvailableAdvisorList
  ICreateCessationRequestPayload,
  ICessationRequestCreationResponse,
  ISolicitudActualizadaResponse
  // IErrorType, // Podrías definir un tipo de error común si lo deseas
} from "../types/cessation-request";
import { approveTerminationConsultancyRequest } from "../services/advisor-service";


/**
 * Hook para obtener la lista de solicitudes de cese de asesoría para el coordinador.
 */
export const useRequestTerminationList = (
  searchCriteria: IRequestTerminationConsultancyListSearchCriteria, // Este ya incluye 'page' y 'status?'
): UseQueryResult<ITerminationConsultancyListProcessed, Error> => {
  return useQuery<ITerminationConsultancyListProcessed, Error>({
    queryKey: cessationRequestListKeys.list(searchCriteria), // La clave depende de todos los criterios
    queryFn: () => getTerminationConsultancyList(searchCriteria), // Pasa todos los criterios al servicio
    // keepPreviousData: true, // Útil para paginación para evitar parpadeo del loader
  });
};

/**
 * Hook para obtener el detalle de una solicitud de cese de asesoría.
 */
export const useRequestTerminationDetail = (
  requestId: number | null,
): UseQueryResult<ICessationRequestDataViewDetailTransformed | null, Error> => { // Usa el tipo transformado
  const queryKey = ["cessationRequestDetail", requestId];

  return useQuery<ICessationRequestDataViewDetailTransformed | null, Error>({
    queryKey,
    queryFn: () => {
      if (requestId === null || requestId === undefined) {
        return Promise.resolve(null);
      }
      return getTerminationConsultancyRequestDetail(requestId); // Llama al servicio
    },
    enabled: requestId !== null && requestId !== undefined,
  });
};


/**
 * Hook para la mutación de rechazar una solicitud de cese.
 */
export const useRejectTerminationRequest = (): UseMutationResult<
  void, // Tipo de dato que devuelve la mutación (en este caso, nada)
  Error, // Tipo del error
  { requestId: number; responseText: string }, // Tipo de las variables de la mutación
  unknown // Tipo del contexto (para optimistic updates, etc.)
> => {
  return useMutation<void, Error, { requestId: number; responseText: string }>({
    mutationFn: ({ requestId, responseText }) =>
      rejectTerminationConsultancyRequest(requestId, responseText),
    // Aquí podrías añadir onSuccess, onError, onSettled para invalidar queries, mostrar notificaciones, etc.
    // Ejemplo:
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['cessationRequestList'] });
    //   queryClient.invalidateQueries({ queryKey: ['cessationRequestDetail', variables.requestId] }); // variables son los params de mutationFn
    //   toast.success("Solicitud rechazada con éxito");
    // },
    // onError: (error) => {
    //   toast.error(`Error al rechazar: ${error.message}`);
    // }
  });
};



/**
 * Hook para obtener la lista de asesores disponibles (basado en criterios).
 */
export const useAvailableAdvisorList = ( // Renombrado de useRequestTerminationAdvisorPerThematicArea para mayor claridad
  searchCriteria: ICessationRequestSearchCriteriaAvailableAdvisorList,
): UseQueryResult<IListAvailableAdvisorResponseFetched | null, Error> => { // El servicio devuelve el tipo Fetched directamente
  const queryKey = ["availableAdvisorList", searchCriteria];

  return useQuery<IListAvailableAdvisorResponseFetched | null, Error>({
    queryKey,
    queryFn: () => getAvailableAdvisorList(searchCriteria),
    enabled: !!searchCriteria, // Solo ejecutar si hay criterios
  });
};

// Podrías tener una clave para la lista de temas activos del asesor si la usas
export const asesorTopicsKeys = {
  active: ["asesorActiveSupervisingTopics"] as const,
};

// **NUEVO HOOK DE MUTACIÓN**
/**
 * Hook para la mutación de crear una nueva solicitud de cese por un asesor.
 */
export const useCreateCessationRequest = (): UseMutationResult<
  ICessationRequestCreationResponse, // Lo que devuelve la función de mutación (el servicio API)
  Error,                             // Tipo del error
  ICreateCessationRequestPayload,    // Lo que se pasa a mutationFn (el payload)
  unknown                            // Tipo del contexto (raramente usado sin optimistic updates)
> => {
  const queryClient = useQueryClient();

  return useMutation<
    ICessationRequestCreationResponse,
    Error,
    ICreateCessationRequestPayload
  >({
    mutationFn: (payload) => createCessationRequest(payload),
    onSuccess: (data, variables) => {
      // Cuando una solicitud de cese se crea exitosamente:
      console.log("Nueva solicitud de cese creada, respuesta del API:", data);
      console.log("Payload enviado:", variables);

      // 1. Invalidar la query que lista los temas activos del asesor,
      //    porque uno de ellos podría ahora tener una solicitud de cese pendiente
      //    (si la UI de temas del asesor refleja esto de alguna manera).
      queryClient.invalidateQueries({ queryKey: asesorTopicsKeys.active }); // Asumiendo que tienes esta clave

      // 2. Si el asesor también tiene una vista de "Mis Solicitudes de Cese Enviadas",
      //    esa lista también debería invalidarse para incluir la nueva.
      //    Si la lista que usa `cessationRequestListKeys.all` es relevante para el asesor, invalídala.
      //    Por ahora, es más para el coordinador, pero si el asesor la ve, descomenta:
      // queryClient.invalidateQueries({ queryKey: cessationRequestListKeys.all });


      // Aquí podrías mostrar una notificación de éxito global si no se maneja en el componente.
      // Ejemplo: toast.success("Solicitud de cese enviada con éxito.");
    },
    onError: (error, variables) => {
      console.error("Error al crear la solicitud de cese. Payload:", variables, "Error:", error);
      // Aquí podrías mostrar una notificación de error global.
      // Ejemplo: toast.error(`Error al enviar la solicitud: ${error.message}`);
    },
  });
};

interface ProposeReassignmentPayload { // Este es el tipo para las variables de la mutación
  solicitudDeCeseOriginalId: number;
  nuevoAsesorPropuestoId: number;
}

/**
 * Hook para la mutación de proponer una reasignación de asesor por el coordinador.
 */
export const useProposeReassignment = (): UseMutationResult< // <<--- AÑADE EXPORT
  void, // Tipo de dato que devuelve la mutación (nada)
  Error, // Tipo del error
  ProposeReassignmentPayload, // Tipo de las variables de la mutación
  unknown // Tipo del contexto
> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProposeReassignmentPayload>({
    mutationFn: (payload) => proposeReassignmentForTermination(payload.solicitudDeCeseOriginalId, { nuevoAsesorPropuestoId: payload.nuevoAsesorPropuestoId }), // Ajusta la llamada al servicio
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: cessationRequestListKeys.all });
      console.log("Propuesta de reasignación enviada para solicitud ID:", variables.solicitudDeCeseOriginalId, "al asesor ID:", variables.nuevoAsesorPropuestoId);
      // toast.info("Propuesta de reasignación enviada al asesor.");
    },
    onError: (error, variables) => {
      console.error("Error al proponer reasignación para solicitud ID:", variables.solicitudDeCeseOriginalId, error);
      // toast.error(`Error al proponer reasignación: ${error.message}`);
    },
  });
};

export interface ApproveCessationVariables { // Renombrado para claridad
  requestId: number;
  comentarioAprobacion: string;
}

const cessationRequestListKeys = {
  all: ["cessationRequestList"] as const,
  list: (criteria: IRequestTerminationConsultancyListSearchCriteria) =>
    [...cessationRequestListKeys.all, criteria] as const,
};

export const useApproveTerminationRequest = (): UseMutationResult<
  ISolicitudActualizadaResponse, // O void
  Error,
  ApproveCessationVariables,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation<ISolicitudActualizadaResponse, Error, ApproveCessationVariables>({
    mutationFn: ({ requestId, comentarioAprobacion }) =>
      approveTerminationConsultancyRequest(requestId, { comentarioAprobacion }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: cessationRequestListKeys.all }); // Para el coordinador
      queryClient.invalidateQueries({ queryKey: ["cessationRequestDetail", variables.requestId] });
      // toast.success("Solicitud aprobada exitosamente.");
      console.log("Solicitud aprobada, datos devueltos:", data);
    },
    // onError ...
  });
};