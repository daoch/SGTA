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
  revisionId: string,
  highlights: IHighlight[],
  usuarioId: number
) {
  return axiosInstance.post(
    `/revision/${revisionId}/observaciones?usuarioId=${usuarioId}`,
    highlights // <-- el array directo, no un objeto
  );
}