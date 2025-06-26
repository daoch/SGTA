import { UsuarioDto } from "@/features/coordinador/dtos/UsuarioDto";
import axiosInstance from "@/lib/axios/axios-instance";
import { IHighlight } from "react-pdf-highlighter";
import { RevisionDocumentoAsesorDto } from "../dtos/RevisionDocumentoAsesorDto";
/**
 * Descarga un archivo desde el backend S3.
 * @param key Nombre o clave del archivo a descargar (ej: "silabo.pdf").
 * @returns Un Blob con el contenido del archivo.
 */

export async function descargarArchivoS3(key: string): Promise<Blob> {
  const response = await axiosInstance.get(
    `/s3/archivos/descargar/${encodeURIComponent(key)}`,
    { responseType: "blob" }
  );
  return response.data;
}
export async function descargarArchivoS3RevisionID(id: number): Promise<Blob> {
  const response = await axiosInstance.get(
    `/s3/archivos/descargar-por-revision/${encodeURIComponent(String(id))}`,
    { responseType: "blob" }
  );
  return response.data;
}
export interface PlagiarismFound {
  startIndex: number;
  endIndex: number;
  sequence: string;
  page: number;
}

export interface PlagiarismSource {
  author: string;
  score: number;
  url: string;
  title: string;
  plagiarismFound: PlagiarismFound[];
  // Puedes agregar más campos si los necesitas, pero no uses any
}

export interface PlagioApiResult {
  score: number;
  sourceCounts: number;
  textWordCounts: number;
  totalPlagiarismWords: number;
  identicalWordCounts: number;
  similarWordCounts: number;
}

export interface PlagioApiResponse {
  status: number;
  result: PlagioApiResult;
  sources: PlagiarismSource[];
  // Agrega aquí otros campos relevantes si los necesitas
}

export async function analizarPlagioArchivoS3(revisionId: number): Promise<PlagioApiResponse> {
  const response = await axiosInstance.get(
    `/plagiarism/check/${revisionId}`
  );
  // El backend devuelve un string JSON, así que lo parseamos
  return typeof response.data === "string" ? JSON.parse(response.data) as PlagioApiResponse : response.data;
}
export async function guardarObservacionesRevision(
  revisionId: number,
  highlights: IHighlight[],
  usuarioId: number
) {
  return axiosInstance.post(
    `/revision/${revisionId}/observaciones?usuarioId=${usuarioId}`,
    highlights // <-- el array directo, no un objeto
  );
}
export async function guardarObservacion(
  revisionId: number,
  observacion: IHighlight, // o HighlightDto si ya lo tienes mapeado
  usuarioId: number
): Promise<number> {
  const response = await axiosInstance.post<number>(
    `/revision/${revisionId}/observacion?usuarioId=${usuarioId}`,
    observacion
  );
  console.log("Respuesta del backend al guardar observación:", response);
  return response.data; // Aquí recibes el id de la observación creada
}
interface ObservacionToHighlightRect {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  pageNumber?: number;
}

interface ObservacionToHighlight {
  id: string | number;
  contenido?: string;
  comentario?: string;
  tipoObservacion?: {
    nombreTipo?: string;
  };
  boundingRect?: ObservacionToHighlightRect;
  rects?: ObservacionToHighlightRect[];
  numeroPaginaInicio?: number;
}

export interface HighlightDto {
  id: number | string;
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
      pageNumber?: number | null;
    };
    rects: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
      pageNumber?: number | null;
    }>;
    pageNumber: number;
    usePdfCoordinates?: boolean | null;
  };
  content: {
    text?: string | null;
    image?: string | null;
  };
  comment: {
    text: string;
    emoji: string;
  };
}

export interface RevisionCriterioEntregableDto {
  id: number;
  nombre : string;
  notaMaxima: number;
  descripcion : string;
  nota : number|null;
  revision_documento_id:number;
  usuario_revisor_id :number;
  tema_x_entregable_id: number;
  entregable_id : number;
  entregable_descripcion:string;
  revision_criterio_entrebable_id : number|null;
  observacion:string|null;
}

// Mapea el DTO a IHighlight
function highlightDtoToIHighlight(dto: HighlightDto): IHighlight {
  return {
    id: String(dto.id),
    content: {
      text: dto.content?.text ?? "",
      image: dto.content?.image ?? "",
    },
    comment: {
      text: dto.comment?.text ?? "",
      emoji: dto.comment?.emoji ?? "",
    },
    position: {
      boundingRect: {
        ...dto.position.boundingRect,
        pageNumber: dto.position.boundingRect.pageNumber ?? undefined,
      },
      rects: (dto.position.rects ?? []).map(rect => ({
        ...rect,
        pageNumber: rect.pageNumber === null ? undefined : rect.pageNumber,
      })),
      pageNumber: dto.position.pageNumber ?? 1,
      usePdfCoordinates: dto.position.usePdfCoordinates ?? false,
    },
  };
}
export async function obtenerObservacionesRevision(revisionId: number): Promise<IHighlight[]> {
  const response = await axiosInstance.get(`/revision/${revisionId}/observaciones`);
  // Mapea cada observación del backend a IHighlight
  console.log("Response data:", response.data);
  return response.data.map(highlightDtoToIHighlight);
}
export async function borrarObservacion(observacionId: number): Promise<void> {
  await axiosInstance.delete(`/revision/observaciones/${observacionId}`);
}

export async function getRevisionById(id: string): Promise<RevisionDocumentoAsesorDto> {
  const res = await axiosInstance.get("/revision/detalle", {
    params: { revisionId: id }
  });
  return res.data;
}

export async function getStudentsByRevisor(id: string): Promise<UsuarioDto[]> {
  const res = await axiosInstance.get("/revision/getStudents", {
    params: { revisionId: id }
  });
  return res.data;
}

export async function obtenerUrlCloudFrontPorRevision(revisionId: number): Promise<string> {
  const response = await axiosInstance.get<string>(`/s3/archivos/getUrlFromCloudFrontByRevision/${revisionId}`);
  return response.data; // Aquí recibes la URL de CloudFront como string
}
export async function existePlagioJsonF(revisionId: number): Promise<boolean> {
  const response = await axiosInstance.get<boolean>(`/s3/archivos/existe-plagio-json/${revisionId}`);
  return response.data;
}
export async function checkStatusProcesamiento(revisionId: number): Promise<string> {
  const response = await axiosInstance.get<string>(`/plagiarism/check-async/status/${revisionId}`);
  return response.data;
}
export async function checkPlagiarismAsync(revisionId: number): Promise<string> {
  const response = await axiosInstance.get<string>(`/plagiarism/check-async/similitud/${revisionId}`);
  return response.data;
}
export async function getJsonPlagio(revisionId: number): Promise<PlagioApiResponse> {
  const response = await axiosInstance.get(`/s3/archivos/get-plagio-json/${revisionId}`);
  return typeof response.data === "string" ? JSON.parse(response.data) as PlagioApiResponse : response.data;
}

export interface IAApiSentence {
  length: number;
  score: number;
  start_position: number;
  text: string;
  page:number
}

export interface IAAttackDetected {
  zero_width_space: boolean;
  homoglyph_attack: boolean;
}

<<<<<<< feature-revision/b-entregable-nota
}

export async function listarCriterioEntregablesNotas(revisionId:number) : Promise<RevisionCriterioEntregableDto[]> {
  const response = await axiosInstance.get(`/criterio-entregable/revision/${revisionId}`);
  return response.data;
}
export async function guardarNota( listaCriterios:RevisionCriterioEntregableDto[]):Promise<void>{
  console.log(listaCriterios);
  await axiosInstance.post('/criterio-entregable/revision_nota/registrar_nota',listaCriterios);
=======
export interface IAApiResponse {
  status: number;
  length: number;
  score: number;
  sentences: IAApiSentence[];
  input: string;
  attack_detected: IAAttackDetected;
  readability_score: number;
  credits_used: number;
  credits_remaining: number;
  version: string;
  language: string;
}
export async function getJsonIA(revisionId: number): Promise<IAApiResponse> {
  const response = await axiosInstance.get(`/s3/archivos/get-IA-json/${revisionId}`);
  return typeof response.data === "string" ? JSON.parse(response.data) as IAApiResponse : response.data;
>>>>>>> develop
}