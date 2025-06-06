import axiosInstance from "@/lib/axios/axios-instance";
import { IHighlight } from "react-pdf-highlighter";
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

export async function analizarPlagioArchivoS3(key: string): Promise<PlagioApiResponse> {
    const response = await axiosInstance.get(
        `/plagiarism/check/${encodeURIComponent(key)}`
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