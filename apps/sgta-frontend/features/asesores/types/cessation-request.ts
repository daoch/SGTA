// features/asesores/types/cessation-request.ts

/**
 * Payload que el frontend envía al backend para crear una solicitud de cese.
 * Corresponde a CrearSolicitudCeseRequest.java
 */
export interface ICreateCessationRequestPayload {
  temaId: number;
  motivo: string;
}

export interface ProposeReassignmentPayloadService {
  nuevoAsesorPropuestoId: number;
  // antiguoAsesorId: number; // El backend ya no lo necesita en el body si lo obtiene de la solicitud original
}

/**
 * Estructura esperada de la respuesta del backend al crear exitosamente una solicitud.
 * Esto es un EJEMPLO. Debes ajustarlo a lo que tu backend realmente devuelve.
 * Podría ser la entidad Solicitud completa o un DTO más simple.
 * Aquí asumo un DTO simplificado para la respuesta.
 */
export interface ICessationRequestCreationResponse {
  id: number; // ID de la nueva solicitud creada
  temaId: number; // Para referencia
  motivo: string;
  estado: string; // ej. "PENDIENTE"
  fechaCreacion: string; // Formato ISO Date String
  // Puedes añadir más campos si el backend los devuelve y son útiles
}


// --- Tipos Fundamentales que vienen del Backend DTO ---

// El estado que realmente viene del backend para cada solicitud
export type ICessationRequestStatusBackend = "pendiente" | "aceptada" | "rechazada" | "desconocido"; // O los strings exactos que mapeaste en el backend

export interface ICessationRequestTemaSimpleBackend {
  id: number;
  name: string; // o titulo
}


export interface ICessationRequestTemaBackend {
  name: string; // Asumiendo que esto es tema.titulo
}

export interface ICessationRequestEstudianteBackend {
  id: number;
  name: string;
  lastName: string;
  topic: ICessationRequestTemaSimpleBackend; // Asumiendo que el tema del estudiante solo necesita nombre aquí
}

export interface ICessationRequestAsesorBackend {
  id: number;
  name: string;
  lastName: string;
  email: string;
  quantityCurrentProyects: number; // 'activeProjects' en el DTO del frontend que te pasé, asegúrate de que coincida
  urlPhoto: string | null;
}

// Item de solicitud TAL COMO VIENE DEL API en un LISTADO (Fetched)
export interface ICessationRequestDataFetched {
  id: number;
  registerTime: string; // "YYYY-MM-DD" o formato ISO completo si viene de OffsetDateTime
  status: ICessationRequestStatusBackend;
  reason: string;
  response: string | null;
  responseTime: string | null; // "YYYY-MM-DD" o formato ISO completo
  assessor: ICessationRequestAsesorBackend | null;
  students: ICessationRequestEstudianteBackend[];
  tema: ICessationRequestTemaSimpleBackend; // Añadido para tener info del tema principal de la solicitud
}

export interface ITerminationConsultancyListResponseFetched {
  requestTermmination: ICessationRequestDataFetched[];
  totalPages: number;
}

// --- Tipos Transformados para Uso en el Frontend ---
// ICessationRequestDataTransformed heredará 'tema' de ICessationRequestDataFetched
export interface ICessationRequestDataTransformed extends Omit<ICessationRequestDataFetched, "registerTime" | "responseTime"> {
  registerTime: Date;
  // status: ICessationRequestStatusBackend; // Ya lo hereda si no está en Omit y es el mismo tipo
  responseTime: Date | null;
  // Los campos assessor, students, y tema se heredan si no están en Omit
}

export interface ITerminationConsultancyListProcessed {
  requestTermmination: ICessationRequestDataTransformed[];
  totalPages: number;
}

// --- Tipos para Criterios de Búsqueda y Filtros de UI ---

// El valor que el frontend usa para controlar las pestañas y enviar al backend
export type CessationRequestFrontendStatusFilter = "pending" | "history";

export interface IRequestTerminationConsultancyListSearchCriteria {
  page: number; // 0-indexed
  status?: CessationRequestFrontendStatusFilter; // El filtro que se envía al backend
  fullNameEmail?: string; // Si se implementa búsqueda por texto en backend
}


// --- Tipos para Detalles de Solicitud (si difieren del listado) ---
// (Mantengo tus definiciones, ajusta campos si es necesario)
export interface ICessationRequestStudentDetailBackend extends ICessationRequestEstudianteBackend {
  code?: string;
  email?: string;
  urlPhoto?: string | null;
  advisorId?: number | null;
}

export interface ICessationRequestDataViewDetailFetched {
  id: number;
  registerTime: string;
  status: ICessationRequestStatusBackend;
  reason: string;
  response: string | null;
  responseTime: string | null;
  assessor: ICessationRequestAsesorBackend | null;
  students: ICessationRequestStudentDetailBackend[];
}

export interface ICessationRequestDataViewDetailTransformed extends Omit<ICessationRequestDataViewDetailFetched, "registerTime" | "responseTime" | "status"> {
  registerTime: Date;
  status: ICessationRequestStatusBackend;
  responseTime: Date | null;
}

// --- Tipos para el Store de Zustand ---
export interface ICessationRequestSearchCriteriaStoreState {
  fullNameEmail: string;
  status: CessationRequestFrontendStatusFilter; // El estado de la pestaña actual en la UI
  page: number; // 0-indexed
}

export interface ICessationRequestSearchCriteriaStoreActions {
  setFullNameEmail: (value: string) => void;
  setPage: (value: number) => void;
  setStatusTabFilter: (value: CessationRequestFrontendStatusFilter) => void;
  setFullNameEmailPage: (value: string) => void; // Resetea página y actualiza término
  clear: () => void;
}

// Combinación para el store
export type ICessationRequestSearchStore = ICessationRequestSearchCriteriaStoreState & ICessationRequestSearchCriteriaStoreActions;


// --- Tipos Misceláneos (revisar si siguen siendo necesarios) ---
export interface ICessationRequestThematicArea {
  id: number;
  name: string;
}

export interface ICessationRequestAvailableAdvisor {
  id: number;
  nombres: string;         // Coincide con DTO Java
  primerApellido: string;  // Coincide con DTO Java
  segundoApellido?: string; // Coincide con DTO Java, opcional si puede ser null/undefined
  correoElectronico: string;// Coincide con DTO Java
  codigoPucp?: string;     // Coincide con DTO Java, opcional
  cantidadTesistasActuales?: number; // Coincide con DTO Java, opcional
  // capacidadMaxima?: number; // Si lo añades al DTO Java
  // areasTematicas?: ICessationRequestThematicArea[]; // Si lo añades al DTO Java
  urlFoto: string | null;    // Coincide con DTO Java
}

export interface ICessationRequestSearchCriteriaAvailableAdvisorList {
  idThematicAreas: Array<number>;
  fullNameEmailCode: string;
  page: number;
}

export interface IListAvailableAdvisorResponseFetched {
  content: ICessationRequestAvailableAdvisor[]; // Lista de asesores
  totalPages: number;
  totalElements: number;
  number: number; // página actual (0-indexed)
  size: number;
  // ... otros campos de paginación de Spring Data Page si los necesitas
}

// --- Tipos para UI y Props de Componentes ---
export interface ISelectRequestCessationOptions {
  id: number | null;
  option: "detail" | "denny" | "accept" | "accept_reassign" | null; // Añadir más opciones si es necesario
  openModal: boolean;
  requestData?: ICessationRequestDataTransformed; // Opcional: para pasar datos al modal
}

export interface ICessationRequestAssignmentModalProps {
  open: boolean;
  idRequest: number;
  onOpenChange: (open: boolean) => void;
  refetch: () => Promise<void>;
}

export interface ICessationRequestPaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void; // Espera la nueva página (0-indexed)
}

export interface ICessationRequestCardProps {
  request: ICessationRequestDataTransformed;
  onApprove: () => void; // These don't take ID directly, parent list maps it
  onReject: () => void;  // These don't take ID directly, parent list maps it
  onViewDetails?: () => void; // Add this line, make it optional and parameter-less for simplicity here
                              // The ID is already known to the parent iterating component
}

export interface ICessationRequestHistoryTableProps {
  requests: ICessationRequestDataTransformed[];
  onViewDetails: (value: number) => void;
}

export interface INotCessationRequestFoundProps {
  type: CessationRequestFrontendStatusFilter; // El filtro de la pestaña actual
  appliedFilters: boolean;
}

export interface IRejectCessationRequestModalProps {
  isOpen: boolean;
  idRequest: number;
  onClose: () => void;
  refetch: () => Promise<void>;
}

// Para la lista de pendientes
export interface IPendingCessationRequestsListProps {
  requests: ICessationRequestDataTransformed[];
  onApprove: (id: number) => void;     // CORRECTED: Expects number
  onReject: (id: number) => void;      // CORRECTED: Expects number
  onViewDetails: (id: number) => void; // CORRECTED: Expects number
}

export interface ICessationRequestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: number | null; // Puede ser null si el modal se abre antes de tener ID
}

// Ajuste de tipo para el estado de filtro que usa el componente de pestañas
// Anteriormente: IRequestTerminationConsultancyRequestStatusFilter
// Ahora: CessationRequestFrontendStatusFilter
// Esto es para el valor que se pasa a la prop `statusValue` del componente `RequestSearchFilters`
// y lo que `onStatusValueChange` debe emitir.
export type IRequestTerminationConsultancyRequestStatus = "pending" | "approved" | "rejected" | "unknown";
export type IRequestTerminationConsultancyRequestStatusFilter = IRequestTerminationConsultancyRequestStatus | "answered";


/*
  Considera si necesitas un tipo para representar un "Tema que asesora un Asesor"
  para la lista que se le mostraría al asesor para que elija de cuál solicitar el cese.
  Ejemplo:
*/
export interface IAsesorTemaActivo {
  temaId: number;
  temaTitulo: string;
  cantidadEstudiantesEnTema?: number; // Opcional
  // fechaInicioAsesoria?: string; // Opcional
}

// Item para la lista de "Mis Solicitudes de Cese" (perspectiva del asesor)
// Corresponde a MiSolicitudCeseItemDto.java
export interface IMyCessationRequestListItemFetched {
  solicitudId: number;
  temaTitulo: string;
  fechaSolicitud: string; // Formato ISO Date String
  estadoSolicitud: ICessationRequestStatusBackend; // "pendiente", "aprobada", "rechazada"
  respuestaCoordinador: string | null;
  fechaDecision: string | null; // Formato ISO Date String
}

export interface IMyCessationRequestListItemTransformed extends Omit<IMyCessationRequestListItemFetched, "fechaSolicitud" | "fechaDecision"> {
  fechaSolicitud: Date;
  fechaDecision: Date | null;
}

// Respuesta paginada del API para "Mis Solicitudes de Cese"
export interface IMyCessationRequestListResponseFetched {
  content: IMyCessationRequestListItemFetched[];
  totalPages: number;
  totalElements: number;
  number: number; // Número de página actual (0-indexed)
  size: number;
  // ... otros campos de paginación de Spring Data Page
}

export interface IMyCessationRequestListProcessed {
  requests: IMyCessationRequestListItemTransformed[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export interface ISolicitudActualizadaResponse {
  solicitudId: number;
  nuevoEstadoNombre: string;
  respuestaCoordinador: string | null;
  fechaResolucion: string | null; // Vendrá como string ISO
}

export type IRequestTerminationConsultancyStudentDetail = ICessationRequestStudentDetailBackend;
export type ICessationRequestAdvisor = ICessationRequestAvailableAdvisor;

