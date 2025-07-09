"use client";
import "react-pdf-highlighter/dist/style.css";

import AppLoading from "@/components/loading/app-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { UsuarioDto } from "@/features/coordinador/dtos/UsuarioDto";
import { DocumentoConVersionDto } from "@/features/gestion/dtos/DocumentoConVersionDto";
import HighlighterPdfViewer from "@/features/revision/components/HighlighterPDFViewer";
import { useDownloadAnnotated } from "@/features/revision/lib/useDownloadAnnotated";
import axiosInstance from "@/lib/axios/axios-instance";
import { AlertTriangle, ArrowLeft, CheckCircle, Download, FileArchive, FileAudio, FileCode, FileImage, FileSpreadsheet, FileText, FileVideo, FileWarning, Info, Quote, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useState } from "react";
import { IHighlight } from "react-pdf-highlighter/dist/types";
import { RevisionDocumentoAsesorDto } from "../dtos/RevisionDocumentoAsesorDto";
import { borrarObservacion, checkPlagiarismAsync, checkStatusProcesamiento, descargarArchivoS3RevisionID, getdocumentosSubidos, getJsonIA, getJsonPlagio, getRevisionById, getStudentsByRevisor, guardarObservacion, IAApiResponse, obtenerObservacionesRevision } from "../servicios/revision-service";

// Datos de ejemplo para una revisión específica
const revisionData = {
  id: 2,
  titulo: "Vision Computacional",
  estudiante: "Luis Manuel Falcon Baca",
  codigo: "20183178",
  curso: "1INF46",
  entregable: "E1",
  fechaEntrega: "2023-11-02",
  fechaLimite: "2023-11-05",
  estado: "por-aprobar",
  porcentajePlagio: 12,
  formatoValido: false,
  entregaATiempo: true,
  citadoCorrecto: false,
  observaciones: [

  ],
};
function getPlagioColorClass(score: number) {
  if (score >= 90) return "bg-red-50 border-red-200";
  if (score >= 70) return "bg-orange-50 border-orange-200";
  if (score >= 50) return "bg-yellow-50 border-yellow-200";
  return "bg-green-50 border-green-200";
}
function getPlagioIconColor(score: number) {
  if (score >= 90) return "text-red-600";
  if (score >= 70) return "text-orange-500";
  if (score >= 50) return "text-yellow-500";
  return "text-green-600";
}
function getPlagioScoreBadgeClass(score: number) {
  if (score >= 90) return "bg-red-600";
  if (score >= 70) return "bg-orange-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-green-600";
}
function getIAColorClass(score: number) {
  if (score >= 90) return "bg-green-50 border-green-200";
  if (score >= 70) return "bg-yellow-50 border-yellow-200";
  if (score >= 50) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}
function getIAScoreTextClass(score: number) {
  if (score >= 90) return "text-black-700";
  if (score >= 70) return "text-black-700";
  if (score >= 50) return "text-black-700";
  return "text-black-700";
}
function getIAScoreBadgeClass(score: number) {
  if (score >= 90) return "bg-green-600";
  if (score >= 70) return "bg-yellow-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-600";
}
function getIAScoreIconColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-600";
}
function getBlockquoteBg(tipo: string) {
  switch (tipo) {
    case "Contenido":
      return "bg-yellow-50";
    case "Similitud":
      return "bg-red-50";
    case "Citado":
      return "bg-blue-50";
    case "GeneradoIA":
      return "bg-green-50";
    default:
      return "bg-gray-50";
  }
}
function getBlockquoteBorder(tipo: string) {
  switch (tipo) {
    case "Contenido":
      return "border-yellow-400";
    case "Similitud":
      return "border-red-500";
    case "Citado":
      return "border-blue-500";
    case "GeneradoIA":
      return "border-green-600";
    default:
      return "border-gray-300";
  }
}
function getFileIcon(ext: string) {
  switch (ext) {
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    case "doc":
    case "docx":
    case "txt":
      return <FileText className="h-4 w-4 text-blue-600" />;
    case "pdf":
      return <FileText className="h-4 w-4 text-red-600" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <FileImage className="h-4 w-4 text-yellow-600" />;
    case "zip":
    case "rar":
      return <FileArchive className="h-4 w-4 text-orange-600" />;
    case "mp3":
    case "wav":
      return <FileAudio className="h-4 w-4 text-purple-600" />;
    case "mp4":
    case "avi":
      return <FileVideo className="h-4 w-4 text-pink-600" />;
    case "js":
    case "ts":
    case "json":
      return <FileCode className="h-4 w-4 text-gray-600" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
  }
}
export default function RevisarDocumentoPage({ params }: { readonly params: { readonly id_revision: number; readonly rol_id?: number; } }) {
  const router = useRouter();
  interface Observacion {
    id: string;
    texto: string;
    pagina: number;
    tipo?: string;
    resuelto?: boolean;
  }

  const [revision, setRevision] = useState<{
    id: number;
    titulo: string;
    estudiante: string;
    codigo: string;
    curso: string;
    entregable: string;
    fechaEntrega: string;
    fechaLimite: string;
    estado: string;
    porcentajePlagio: number;
    formatoValido: boolean;
    entregaATiempo: boolean;
    citadoCorrecto: boolean;
    observaciones: Observacion[];
  }>(revisionData);

  const [isLoading, setIsLoading] = useState(false);
  const [showFinalizarDialog, setShowFinalizarDialog] = useState(false);
  const [showRubricaDialog, setShowRubricaDialog] = useState(false);
  const [notificaciones, setNotificaciones] = useState({
    notificarEstudiante: true,
    notificarAsesor: true,
  });
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const [activeHighlight, setActiveHighlight] = useState<IHighlight | undefined>(undefined);
  const [revision2, setRevision2] = useState<RevisionDocumentoAsesorDto | null>(null);
  const [tab, setTab] = useState<"revisor" | "plagio" | "ia">("revisor");
  const [tabPrincipal, setTabPrincipal] = useState<"principal" | "anexos">("principal");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(null);
  const [isHighlightsLoading, setIsHighlightsLoading] = useState(true);
  interface PlagioDetalle {
    pagina: number; // Si tienes la página real, asígnala aquí
    texto: string;
    url?: string;
    title?: string;
    author?: string;
    fragmento?: string;
  }

  interface PlagioData {
    coincidencias: number;
    detalles: PlagioDetalle[];
  }

  const [plagioData, setPlagioData] = useState<PlagioData | null>(null);
  const [IAData, setIAData] = useState<IAApiResponse | null>(null); // Cambia 'any' por el tipo adecuado si lo tienes
  const [isAnalizandoPlagio, setIsAnalizandoPlagio] = useState(false);
  const [existePlagioJson, setExistePlagioJson] = useState<string | null>(null);
  const [alumnos, setAlumnos] = useState<UsuarioDto[]>([]);
  const [archivosSubidos, setArchivosSubidos] = useState<
    DocumentoConVersionDto[]
  >([]);
  // Anexos state and handlers
  interface Anexo {
    id: number;
    nombre: string;
    url?: string;
  }
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [comentarioAnexos, setComentarioAnexos] = useState<string>("");

  // Dummy descargarAnexo handler
  const handleDescargarDocumento = async (documentoNombre: string) => {
    const documentoNombreBase64 = window.btoa(documentoNombre);
    const response = await axiosInstance.get(
      `s3/archivos/getUrlFromCloudFront/${documentoNombreBase64}`,
    );
    const fileUrl = response.data;
    window.open(fileUrl, "_blank");
  };

  useEffect(() => {
    const fetchArchivosSubidos = async () => {
      try {
        const response = await getdocumentosSubidos(params.id_revision);
        setArchivosSubidos(response);
      } catch (error) {
        toast({ title: "Error al conseguir archivos subido", variant: "destructive" });
      } finally {
      }
    };
    fetchArchivosSubidos(); // Set to [] or fetch real anexos
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRevisionById(params.id_revision.toString());
        setRevision2(data);
      } catch {

      } finally {

      }
    }

    fetchData();
  }, [params.id_revision]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStudentsByRevisor(params.id_revision.toString());
        setAlumnos(data);
      } catch {
      } finally {
      }
    }

    fetchData();
  }, [params.id_revision]);
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let isMounted = true;

    async function checkExistePlagioJson() {
      const exists = await checkStatusProcesamiento(params.id_revision);
      console.log("Estado de procesamiento:", exists);
      if (!isMounted) return;
      setExistePlagioJson(exists);
      if (exists !== "COMPLETADO") {
        // Vuelve a consultar en 10 segundos
        intervalId = setTimeout(checkExistePlagioJson, 10000);
      }
    }

    checkExistePlagioJson();

    return () => {
      isMounted = false;
      if (intervalId) clearTimeout(intervalId);
    };
  }, [params.id_revision]);

  useEffect(() => {
    if (existePlagioJson == "PENDING" || existePlagioJson == "ERROR" && !isAnalizandoPlagio) {
      console.log("No existe JSON de plagio, iniciando análisis...");
      handleAnalizarPlagio();
    } else if (existePlagioJson == "COMPLETADO") {
      console.log("Existe JSON de plagio, no es necesario analizar nuevamente.");
      const fetchPlagioData = async () => {
        const apiData = await getJsonPlagio(params.id_revision);
        const detalles: PlagioDetalle[] = [];
        // Aquí puedes actualizar el estado con los datos obtenidos si lo necesitas
        // setPlagioData(apiData);
        apiData.sources.forEach((src) => {
          src.plagiarismFound.forEach((frag) => {
            detalles.push({
              pagina: frag.page || 0, // Si tienes la página real, asígnala aquí
              texto: `Coincidencia del ${src.score}% con "${src.title}"${src.author ? ` (autor: ${src.author})` : ""}: "${frag.sequence}"`,
              url: src.url,
              title: src.title,
              author: src.author ?? "Desconocido",
              fragmento: frag.sequence,
            });
          });
        });
        setPlagioData({
          coincidencias: apiData.result.score,
          detalles
        });
      };
      fetchPlagioData();
      const fetchIAData = async () => {
        const apiData = await getJsonIA(params.id_revision);
        console.log("Datos de IA obtenidos:", apiData);
        setIAData(apiData);
      };
      fetchIAData();
    }
    // eslint-disable-next-line
  }, [existePlagioJson]);
  const handleAnalizarPlagio = async () => {
    setIsAnalizandoPlagio(true);
    try {
      const apiData = await checkPlagiarismAsync(params.id_revision);
      console.log("NUEVO ESTADO:", apiData);
      // const detalles: PlagioDetalle[] = [];
      // apiData.sources.forEach((src) => {
      //   src.plagiarismFound.forEach((frag) => {
      //     detalles.push({
      //       pagina: frag.page || 0, // Si tienes la página real, asígnala aquí
      //       texto: `Coincidencia del ${src.score}% con "${src.title}"${src.author ? ` (autor: ${src.author})` : ""}: "${frag.sequence}"`,
      //       url: src.url,
      //       title: src.title,
      //       author: src.author ?? "Desconocido",
      //       fragmento: frag.sequence,
      //     });
      //   });
      // });
      // setPlagioData({
      //   coincidencias: apiData.result.score,
      //   detalles
      // });
    } catch (e) {
      setPlagioData(null);
    } finally {
      setIsAnalizandoPlagio(false);
    }
  };
  useEffect(() => {
    async function fetchPdf() {
      try {
        const key = "E1.pdf";
        if (!params.id_revision) return;
        const blob = await descargarArchivoS3RevisionID(params.id_revision);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        console.log("PDF URL:", url);
        // Obtener número de páginas usando pdf-lib
        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setNumPages(pdfDoc.getPageCount());
      } catch (e) {
        console.error("Error al obtener el PDF:", e);
        setPdfUrl(null);
        setNumPages(null);
      }
    }
    fetchPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [params.id_revision]);
  useEffect(() => {
    if (numPages && highlights.length > 0) {
      setHighlights(prev =>
        prev.filter(h =>
          h.position.pageNumber > 0 && h.position.pageNumber <= numPages
        )
      );
    }
  }, [numPages]);
  useEffect(() => {
    async function fetchObservaciones() {
      try {
        const data = await obtenerObservacionesRevision(params.id_revision);
        console.log("Observaciones obtenidas:", data);
        setHighlights(data);
      } catch (e) {
        console.error("Error al obtener observaciones:", e);
        setHighlights([]);
      } finally {
        setIsHighlightsLoading(false);
      }
    }
    fetchObservaciones();
  }, [params.id_revision]);

  const handleHighlightClick = useCallback((highlight: IHighlight) => {
    console.log("Click en highlight:", highlight.id);
    setActiveHighlight(undefined);
    setTimeout(() => {
      setActiveHighlight(highlight);
    }, 0);
  }, []);

  /*const handleSaveAnnotatedPDF = async () => {
    console.log("Iniciando guardado del PDF");
    try {
      setIsLoading(true);
      console.log("Obteniendo PDF original...");

      // 1. Obtener el PDF original
      const response = await fetch("/silabo.pdf");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pdfBytes = await response.arrayBuffer();

      console.log("PDF obtenido, procesando highlights...");
      console.log("Número de highlights:", highlights.length);

      // 2. Cargar el PDF usando pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // 3. Procesar cada highlight
      for (const highlight of highlights) {
        console.log("Procesando highlight:", highlight);
        const { content, position, comment } = highlight;
        const page = pdfDoc.getPage(position.pageNumber - 1);

        page.drawText(comment.text, {
          x: position.boundingRect.x1,
          y: position.boundingRect.y1,
          size: 12,
          color: rgb(1, 0, 0),
        });
      }

      console.log("Guardando PDF modificado...");
      const modifiedPdfBytes = await pdfDoc.save();

      console.log("Descargando archivo...");
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      saveAs(blob, `documento_revisado_${params.id}.pdf`);

    } catch (error) {
      console.error("Error detallado al guardar el PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };*/

  const handleFormatoValidoChange = () => {
    setRevision({
      ...revision,
      formatoValido: !revision.formatoValido,
    });
  };
  useEffect(() => {
    console.log("Highlights updated:", highlights);
  }, [highlights]);

  const handleCitadoCorrectoChange = () => {
    setRevision({
      ...revision,
      citadoCorrecto: !revision.citadoCorrecto,
    });
  };
  const handleDeleteHighlight = (highlightId: string) => {

    setShowDeleteDialog(true);
    setHighlightToDelete(highlightId);
  };
  const confirmDeleteHighlight = async () => {
    if (!highlightToDelete) return;
    try {
      await borrarObservacion(Number(highlightToDelete)); // Convierte el string a number si tu backend espera un número
      setHighlights(prev => prev.filter(h => h.id !== highlightToDelete));
      setShowDeleteDialog(false);
      setHighlightToDelete(null);
      toast({ title: "Observación eliminada" });
    } catch {
      toast({ title: "Error al eliminar la observación", variant: "destructive" });
    }
  };
  const handleUpdateHighlight = (updatedHighlight: IHighlight) => {
    setHighlights(prev => prev.map(h =>
      h.id === updatedHighlight.id ? updatedHighlight : h
    ));
  };

  const downloadAnnotated = useDownloadAnnotated(params.id_revision);

  const handleNewHighlight = async (highlight: IHighlight) => {
    console.log("New highlight received:", highlight);

    // Envía al backend antes de agregar al estado
    try {
      const idObservacion = await guardarObservacion(params.id_revision, highlight, 10); // Cambia 10 por el usuarioId real si lo tienes
      console.log("Observación guardada con ID:", idObservacion);
      const highlightConIdReal = { ...highlight, id: idObservacion.toString() };

      setHighlights(prev => {
        // Solo agrega el highlight con el id real
        const filtered = prev.filter(h => h.id !== highlight.id && h.id !== "");
        const updatedHighlights = [...filtered, highlightConIdReal];
        console.log("All highlights:", updatedHighlights);
        return updatedHighlights;
      });
      toast({ title: "Observación guardada" });
    } catch (error) {
      toast({ title: "Error al guardar la observación", variant: "destructive" });
      console.error("Error al guardar la observación:", error);
    }
  };
  //   const handleAddObservacion = (nuevaObservacion: any) => {
  //     const newId = (revision.observaciones.length + 1).toString();
  //     setRevision({
  //       ...revision,
  //       observaciones: [
  //         ...revision.observaciones,
  //         {
  //           id: newId,
  //           ...nuevaObservacion,
  //           resuelto: false,
  //         },
  //       ],
  //     });
  //     setShowObservacionForm(false);
  //   };

  const handleFinalizarRevision = async () => {
    setIsLoading(true);

    try {
      const highlightsDto = highlights.map(h => ({
        id: h.id,
        position: {
          boundingRect: h.position.boundingRect,
          rects: h.position.rects,
          pageNumber: h.position.pageNumber,
          usePdfCoordinates: h.position.usePdfCoordinates ?? undefined,
        },
        content: {
          text: h.content.text ?? "",
          image: h.content.image ?? "",
        },
        comment: {
          text: h.comment.text,
          emoji: h.comment.emoji,
        },
      }));

      //await guardarObservacionesRevision(params.id_revision, highlightsDto, 10); // Asumiendo que el usuario es el asesor con ID 1
      //console.log("Revisión guardada exitosamente");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // // Cerramos el diálogo de finalizar y mostramos la rúbrica
      setShowFinalizarDialog(false);
      setShowRubricaDialog(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al finalizar la revisión:", error);
      setIsLoading(false);
    }
  };

  const handleNotificacionChange = (key: string, checked: boolean) => {
    setNotificaciones({
      ...notificaciones,
      [key]: checked,
    });
  };

  const handleRubricaComplete = async () => {
    try {
      // En una aplicación real, aquí se enviaría la evaluación de la rúbrica al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirigimos al usuario a la página de detalles de la revisión
      router.push(`/revision/${revision.id}`);
    } catch (error) {
      console.error("Error al guardar la evaluación de la rúbrica:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={"/asesor/revision"}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-pucp-blue">Revisar Documento</h1>
        </div>
        {revision.estado === "aprobado" && (
          <div className="bg-green-100 text-green-700 ml-50 px-4 py-1 rounded-xl border border-green-300 text-sm font-medium">
            ENTREGABLE APROBADO
          </div>
        )}
        {revision.estado === "rechazado" && (
          <div className="bg-red-100 text-red-700 ml-50 px-4 py-1 rounded-xl border border-red-300 text-sm font-medium">
            ENTREGABLE RECHAZADO
          </div>
        )}
        {revision.estado === "revisado" && (
          <div className="bg-red-100 text-blue-700 ml-50 px-4 py-1 rounded-xl border border-blue-300 text-sm font-medium">
            ENTREGABLE REVISADO
          </div>
        )}
        <Dialog open={showFinalizarDialog} onOpenChange={setShowFinalizarDialog}>
          <DialogTrigger asChild>
            <Button className="bg-pucp-blue hover:bg-pucp-light">Guardar Revisión</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Guardar Revisión</DialogTitle>
              <DialogDescription>Confirme los resultados de la revisión antes de finalizar.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Detección de similitud</h4>
                <div className="flex items-center gap-2">
                  {/* <Progress
                    value={revision.porcentajePlagio}
                    max={30}
                    className={`h-2 w-full ${
                      revision.porcentajePlagio > 20
                        ? "bg-red-200"
                        : revision.porcentajePlagio > 10
                          ? "bg-yellow-200"
                          : "bg-green-200"
                    }`}
                  /> */}
                  {(() => {
                    let plagioClass = "";
                    if ((plagioData?.coincidencias ?? 0) > 20) {
                      plagioClass = "text-red-600 font-medium";
                    } else if ((plagioData?.coincidencias ?? 0) > 10) {
                      plagioClass = "text-yellow-600 font-medium";
                    } else {
                      plagioClass = "text-green-600 font-medium";
                    }
                    return (
                      <span className={plagioClass}>
                        {plagioData?.coincidencias ?? 0}%
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* <Separator /> */}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Formato válido:</span>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={handleFormatoValidoChange}>
                    {revision.formatoValido ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-600">Sí</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="text-red-600">No</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Entrega a tiempo:</span>
                  <div>
                    {revision.entregaATiempo ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-600">Sí</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <X className="h-5 w-5 text-red-500" />
                        <span className="text-red-600">No</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Citado correcto:</span>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={handleCitadoCorrectoChange}>
                    {revision.citadoCorrecto ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-600">Sí</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="text-red-600">No</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* <Separator /> */}

              <div>
                <h4 className="text-sm font-medium mb-2">Observaciones</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{revision.observaciones.length}</span>
                  <div>
                    <span className="text-sm text-muted-foreground">Total</span>
                    <div className="text-xs">
                      <span className="text-green-600">
                        {revision.observaciones.filter((o) => o.resuelto).length} resueltas
                      </span>
                      {" / "}
                      <span className="text-red-600">
                        {revision.observaciones.filter((o) => !o.resuelto).length} pendientes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <Separator /> */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFinalizarDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await handleFinalizarRevision(); // puede ser solo lógica de guardado
                    const rolId = params.rol_id ?? 0;
                    if (rolId === 2) {
                      // Si rol_id es 2, redirigir a la página del jurado
                      router.push(`/jurado/revision/detalles-revision/${params.id_revision}`);
                    } else {
                      // Si rol_id no es 2, redirigir a la página del asesor
                      router.push(`/asesor/revision/detalles-revision/${params.id_revision}`);
                    }
                  } catch (error) {
                    console.error("Error al redirigir:", error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="bg-pucp-blue hover:bg-pucp-light"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Confirmar y Continuar"}
              </Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="min-h-[800px]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle>{revision2?.titulo}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span>
                        Estudiantes:
                        {alumnos.length > 0 ? (
                          alumnos.map((alumno, index) => (
                            <span key={alumno.id}>
                              {alumno.nombres} {alumno.primerApellido} {alumno.segundoApellido} ({alumno.codigoPucp})
                              {index < alumnos.length - 1 ? ", " : " "}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No hay estudiantes asignados</span>
                        )}
                      </span>
                      <Badge variant="outline" className="w-fit">
                        {revision2?.curso}
                      </Badge>
                      <Badge variant="outline" className="w-fit bg-blue-100 text-blue-800">
                        {revision2?.entregable}
                      </Badge>
                    </div>
                  </CardDescription>
                </div>
                <Button variant="outline" className="ml-4 gap-2" onClick={downloadAnnotated} disabled={!pdfUrl}>
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </div>
            </CardHeader>
            <Tabs value={tabPrincipal} onValueChange={v => setTabPrincipal(v as "principal" | "anexos")} className="w-full">
              <TabsList className="mb-4 flex gap-2 justify-start ml-2">
                <TabsTrigger
                  value="principal"
                  className={`font-semibold transition-all px-4 py-2 rounded ${tabPrincipal === "principal"
                    ? "bg-pucp-blue text-white shadow border-b-0 border-pucp-blue scale-105"
                    : ""
                    }`}
                >
                  Documento principal
                </TabsTrigger>
                <TabsTrigger
                  value="anexos"
                  className={`font-semibold transition-all px-4 py-2 rounded ${tabPrincipal === "anexos"
                    ? "bg-pucp-blue text-white shadow border-b-0 border-pucp-blue scale-105"
                    : ""
                    }`}
                >
                  Anexos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="principal">
                <Card className="min-h-[800px]">
                  <CardContent className="relative h-[800px]">
                    {/* ...visor PDF y observaciones... */}
                    {isHighlightsLoading ? (
                      <AppLoading />
                    ) : (
                      <HighlighterPdfViewer
                        pdfUrl={pdfUrl ?? ""}
                        onAddHighlight={handleNewHighlight}
                        onDeleteHighlight={handleDeleteHighlight}
                        onUpdateHighlight={handleUpdateHighlight}
                        highlights={highlights}
                        scrollToHighlight={activeHighlight}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="anexos">
                <Card>
                  <CardHeader>
                    <CardTitle>Anexos</CardTitle>
                    <CardDescription>
                      Descarga los documentos anexos y deja un comentario general si es necesario.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {archivosSubidos && archivosSubidos.length > 0 ? (
                        archivosSubidos.map((anexo) => (
                          <div key={anexo.documentoId} className="flex items-center gap-2 w-full py-1 border-b last:border-b-0">
                            <span className="mr-1">
                              {getFileIcon(anexo.documentoNombre.split(".").pop()?.toLowerCase() ?? "")}
                            </span>
                            <span className="truncate flex-1 min-w-0">{anexo.documentoNombre}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDescargarDocumento(anexo.documentoLinkArchivo)}
                            >
                              <Download className="h-4 w-4 mr-1" /> Descargar
                            </Button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No hay anexos disponibles.</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Comentario general sobre los anexos:</label>
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        rows={3}
                        value={comentarioAnexos}
                        onChange={e => setComentarioAnexos(e.target.value)}
                        placeholder="Escribe aquí tu comentario general sobre los anexos..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-between">
                  <span>Lista de observaciones encontradas</span>
                  {existePlagioJson === "PENDING" && (
                    <span className="flex items-center gap-2 text-blue-700 font-semibold animate-pulse text-medium">
                      <svg className="h-7 w-7 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Iniciando análisis de documento. Esto podría tomar unos minutos...
                    </span>
                  )}
                  {existePlagioJson === "EN_PROCESO" && (
                    <span className="flex items-center gap-2 text-blue-700 font-semibold animate-pulse text-medium">
                      <svg className="h-7 w-7 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Analizando documento...
                    </span>
                  )}
                  {existePlagioJson === "ERROR" && (
                    <span className="flex items-center gap-2 text-red-700 font-semibold text-medium">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M15 9l-6 6m0-6l6 6"
                        />
                      </svg>
                      Ocurrió un error, inténtelo más tarde.
                    </span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent >
              <Tabs value={tab} onValueChange={v => setTab(v as "revisor" | "plagio" | "ia")} >
                <TabsList className="mb-4 w-full flex gap-2 items-stretch bg-gray-100 overflow-x-auto whitespace-nowrap">
                  <TabsTrigger
                    value="revisor"
                    className={` font-semibold transition-all ${tab === "revisor" ? "bg-pucp-blue text-white shadow" : ""
                      }`}
                  >
                    Revisor ({highlights.length || 0})
                  </TabsTrigger>

                  <TabsTrigger
                    value="plagio"
                    className={` font-semibold transition-all ${tab === "plagio" ? "bg-pucp-blue text-white shadow" : ""
                      }`}
                  >
                    Similitud ({plagioData?.detalles.length || 0})
                  </TabsTrigger>

                  <TabsTrigger
                    value="ia"
                    className={` font-semibold transition-all ${tab === "ia" ? "bg-pucp-blue text-white shadow" : ""
                      }`}
                  >
                    IA ({IAData?.sentences.length || 0})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="revisor" className="mt-2 relative z-0">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {highlights.slice().sort((a, b) => {
                      const pageA = a.position.pageNumber ?? 0;
                      const pageB = b.position.pageNumber ?? 0;
                      if (pageA !== pageB) return pageA - pageB;
                      // Si están en la misma página, ordena por y1 (de arriba a abajo)
                      const yA = a.position.boundingRect?.y1 ?? 0;
                      const yB = b.position.boundingRect?.y1 ?? 0;
                      return yA - yB;
                    }).map((highlight) => (
                      <div
                        key={highlight.id}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${getBlockquoteBg(highlight.comment.emoji)}`}
                        onClick={() => handleHighlightClick(highlight)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium italic text-black-1000">
                              <em>&quot;{highlight.content.text}&quot;</em>
                            </p>
                            {highlight.comment && highlight.comment.text && (
                              <blockquote className={`border-l-4 pl-3 my-2 text-sm text-gray-900 rounded ${getBlockquoteBg(highlight.comment.emoji)} ${getBlockquoteBorder(highlight.comment.emoji)}`}>
                                Comentario: {highlight.comment.text}
                              </blockquote>
                            )}
                            <p className="text-xs text-gray-800 mt-1">
                              Página {highlight.position.pageNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHighlight(highlight.id);

                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {highlights.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No hay observaciones destacadas
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="plagio" className="mt-2 relative z-0">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {plagioData && plagioData.detalles && plagioData.detalles.length > 0 && (
                      <div className={`p-3 rounded-lg border flex items-center gap-2 justify-center mb-2 ${getPlagioColorClass(plagioData.coincidencias)}`}>
                        <AlertTriangle className={`h-5 w-5 ${getPlagioIconColor(plagioData.coincidencias)}`} />
                        <span className={`font-bold text-lg ${getPlagioIconColor(plagioData.coincidencias)}`}>
                          Similitud total: {plagioData.coincidencias ?? 0}%
                        </span>
                      </div>
                    )}
                    {plagioData?.detalles.map((obs) => {
                      const key = `${obs.url ?? ""}-${obs.fragmento ?? obs.texto}`;
                      // Extrae el porcentaje y el nombre de la fuente del texto si no tienes campos separados
                      const match = obs.texto.match(/Coincidencia del (\d+)% con "([^"]+)"/);
                      const porcentaje = match?.[1] ?? "?";
                      const fuente = obs.title ?? match?.[2] ?? "Fuente desconocida";
                      const colorClass = getPlagioColorClass(Number(porcentaje));
                      const badgeClass = getPlagioScoreBadgeClass(Number(porcentaje));
                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border flex flex-col gap-2 ${colorClass}`}
                        >
                          <p className="text-sm font-medium italic text-black-700">
                            &quot;{obs.fragmento ?? obs.texto}&quot;
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">
                              Fuente: {fuente}
                            </span>
                            {obs.url && (
                              <a
                                href={obs.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs underline text-blue-700 ml-2"
                              >
                                Ver fuente
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-white text-base font-bold shadow ${badgeClass} `}>
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {porcentaje}%
                            </span>
                            <span className="text-s text-gray-500">
                              Página {obs.pagina}
                            </span>
                          </div>

                        </div>
                      );
                    })}
                    {(!plagioData || plagioData.detalles.length === 0) && (
                      <div className="text-center py-6 text-gray-500">
                        No hay observaciones de similitud
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="ia" className="mt-4 relative z-0">

                  {IAData && IAData.sentences && IAData.sentences.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      <div className={`p-3 rounded-lg border cursor-default flex items-center gap-2 justify-center ${getIAColorClass(IAData.score)}`}>
                        <Sparkles className={`h-5 w-5  ${getIAScoreIconColor(IAData.score)}`} />
                        <span className="font-bold text-lg">
                          Puntuación humana: {IAData.score}%
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-5 w-5 text-blue-600 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Un valor bajo indica texto probablemente generado por IA. Un valor alto indica texto probablemente escrito por un humano.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {IAData.sentences.map((sentence) => {
                        const key = `ia-${sentence.page}-${sentence.text}`;
                        const colorClass = getIAColorClass(sentence.score);
                        const scoreTextClass = getIAScoreTextClass(sentence.score);
                        const scoreBadgeClass = getIAScoreBadgeClass(sentence.score);
                        return (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border cursor-pointer ${colorClass}`}
                            tabIndex={0}
                            role="button"
                            onClick={() => {
                              // Highlight temporal solo para scroll
                              const tempHighlight: IHighlight = {
                                id: key,
                                content: { text: sentence.text },
                                position: {
                                  pageNumber: sentence.page,
                                  boundingRect: {
                                    x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0
                                  },
                                  rects: [],
                                  usePdfCoordinates: false,
                                },
                                comment: { text: "Detectado como IA", emoji: "GeneradoIA" },
                              };
                              setActiveHighlight(undefined);
                              setTimeout(() => setActiveHighlight(tempHighlight), 0);
                              console.log("Highlight temporal activado:", tempHighlight);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                const tempHighlight: IHighlight = {
                                  id: key,
                                  content: { text: sentence.text },
                                  position: {
                                    pageNumber: sentence.page,
                                    boundingRect: {
                                      x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0
                                    },
                                    rects: [],
                                    usePdfCoordinates: false,
                                  },
                                  comment: { text: "Detectado como IA", emoji: "GeneradoIA" },
                                };
                                setActiveHighlight(undefined);
                                setTimeout(() => setActiveHighlight(tempHighlight), 0);

                              }
                            }}
                          >
                            <div>
                              <p className={`text-sm font-medium italic ${scoreTextClass} text-justify`}>
                                &quot;{sentence.text}&quot;
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-white text-base font-bold shadow ${scoreBadgeClass}`}>
                                  <Sparkles className="h-4 w-4 mr-1" />
                                  {sentence.score}%
                                </span>
                                <span className="text-s text-gray-500">
                                  Página {sentence.page}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-600">
                      No hay observaciones de contenido generado por IA
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          {/* <Button
                        onClick={handleSaveAnnotatedPDF}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full" // Hacer el botón más visible
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span>Guardando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Guardar PDF con anotaciones</span>
                            </div>
                        )}
                    </Button> */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Observaciones</CardTitle>
              <CardDescription>Distribución por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileWarning className="h-4 w-4 text-yellow-500" />
                    <span>Contenido</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {highlights.filter((h) => h.comment.emoji === "Contenido").length}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Similitud</span>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {highlights.filter((h) => h.comment.emoji === "Similitud").length + (plagioData?.detalles?.length ?? 0)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote className="h-4 w-4 text-blue-500" />
                    <span>Citado</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {highlights.filter((h) => h.comment.emoji === "Citado").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <span>Generado con IA</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {IAData && IAData.sentences ? IAData.sentences.length : 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar observación?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. ¿Deseas eliminar la observación seleccionada?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteHighlight}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

