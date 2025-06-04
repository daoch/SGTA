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
  observacionId: string | number;
  contenido?: string;
  comentario?: string;
  tipoObservacion?: {
    nombreTipo?: string;
  };
  boundingRect?: ObservacionToHighlightRect;
  rects?: ObservacionToHighlightRect[];
  numeroPaginaInicio?: number;
}

function observacionToIHighlight(obs: ObservacionToHighlight): IHighlight {
  return {
    id: String(obs.observacionId),
    content: {
      text: obs.contenido ?? "",
      // Si tienes imágenes, puedes mapearlas aquí
    },
    comment: {
      text: obs.comentario ?? "",
      emoji: obs.tipoObservacion?.nombreTipo ?? "", // o el campo que corresponda
    },
    position: {
      boundingRect: {
        x1: obs.boundingRect?.x1 ?? 0,
        y1: obs.boundingRect?.y1 ?? 0,
        x2: obs.boundingRect?.x2 ?? 0,
        y2: obs.boundingRect?.y2 ?? 0,
        width: obs.boundingRect?.width ?? 0,
        height: obs.boundingRect?.height ?? 0,
        pageNumber: obs.boundingRect?.pageNumber ?? obs.numeroPaginaInicio ?? 1,
      },
      rects: (obs.rects ?? []).map((r: ObservacionToHighlightRect) => ({
        x1: r.x1 ?? 0,
        y1: r.y1 ?? 0,
        x2: r.x2 ?? 0,
        y2: r.y2 ?? 0,
        width: r.width ?? 0,
        height: r.height ?? 0,
        pageNumber: r.pageNumber ?? obs.numeroPaginaInicio ?? 1,
      })),
      pageNumber: obs.numeroPaginaInicio ?? 1,
      usePdfCoordinates: true, // si corresponde
    },
  };
}
export async function obtenerObservacionesRevision(revisionId: number): Promise<IHighlight[]> {
  const response = await axiosInstance.get(`/revision/${revisionId}/observaciones`);
  // Mapea cada observación del backend a IHighlight
  return response.data.map(observacionToIHighlight);
}