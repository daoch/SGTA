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
import { toast } from "@/components/ui/use-toast";
import HighlighterPdfViewer from "@/features/revision/components/HighlighterPDFViewer";
import { AlertTriangle, ArrowLeft, CheckCircle, FileWarning, Quote, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useState } from "react";
import { IHighlight } from "react-pdf-highlighter/dist/types";
import { analizarPlagioArchivoS3, borrarObservacion, descargarArchivoS3RevisionID, existePlagioJsonF, getJsonPlagio, guardarObservacion, obtenerObservacionesRevision } from "../servicios/revision-service";
// ...otros imports...

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


export default function RevisarDocumentoPage({ params }: { readonly params: { readonly id_revision: number } }) {
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

  const [tab, setTab] = useState<"revisor" | "plagio" | "ia">("revisor");
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
  const [isAnalizandoPlagio, setIsAnalizandoPlagio] = useState(false);
  const [existePlagioJson, setExistePlagioJson] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkExistePlagioJson() {
      const exists = await existePlagioJsonF(params.id_revision);
      setExistePlagioJson(exists);
    }
    checkExistePlagioJson();
  }, [params.id_revision]);

  useEffect(() => {
    if (existePlagioJson === false && !isAnalizandoPlagio) {
      console.log("No existe JSON de plagio, iniciando análisis...");
      handleAnalizarPlagio();
    } else if (existePlagioJson === true) {
      console.log("Existe JSON de plagio, no es necesario analizar nuevamente.");
      const fetchPlagioData = async () => {
        const apiData = await getJsonPlagio(params.id_revision);
        const detalles: PlagioDetalle[] = [];
        // Aquí puedes actualizar el estado con los datos obtenidos si lo necesitas
        // setPlagioData(apiData);
        apiData.sources.forEach((src) => {
          src.plagiarismFound.forEach((frag) => {
            detalles.push({
              pagina: 1, // Si tienes la página real, asígnala aquí
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
    }
    // eslint-disable-next-line
  }, [existePlagioJson]);
  const handleAnalizarPlagio = async () => {
    setIsAnalizandoPlagio(true);
    try {
      const apiData = await analizarPlagioArchivoS3(params.id_revision);
      console.log("Datos de plagio obtenidos:", apiData);
      const detalles: PlagioDetalle[] = [];
      apiData.sources.forEach((src) => {
        src.plagiarismFound.forEach((frag) => {
          detalles.push({
            pagina: 1, // Si tienes la página real, asígnala aquí
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
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    setHighlightToDelete(highlightId);
    setShowDeleteDialog(true);
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
                    if (revision.porcentajePlagio > 20) {
                      plagioClass = "text-red-600 font-medium";
                    } else if (revision.porcentajePlagio > 10) {
                      plagioClass = "text-yellow-600 font-medium";
                    } else {
                      plagioClass = "text-green-600 font-medium";
                    }
                    return (
                      <span className={plagioClass}>
                        {revision.porcentajePlagio}%
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
                    router.push(`/asesor/revision/detalles-revision/${params.id_revision}`);
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
              <CardTitle>{revision.titulo}</CardTitle>
              <CardDescription>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span>
                    Estudiante: {revision.estudiante} ({revision.codigo})
                  </span>
                  <Badge variant="outline" className="w-fit">
                    {revision.curso === "1INF42" ? "1INF42" : "1INF46"}
                  </Badge>
                  <Badge variant="outline" className="w-fit bg-blue-100 text-blue-800">
                    {revision.entregable}
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="relative h-[800px]" >
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
        </div>

        <div className="space-y-6">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
              <CardDescription>
                Lista de observaciones encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={v => setTab(v as "revisor" | "plagio")}>
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="revisor">Revisor</TabsTrigger>
                  <TabsTrigger value="plagio">Deteccion de similitud</TabsTrigger>
                  <TabsTrigger value="ia" className="flex-1">Generado con IA</TabsTrigger>
                </TabsList>
                <TabsContent value="revisor">
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
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                        onClick={() => handleHighlightClick(highlight)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                              {highlight.content.text}
                            </p>
                            {highlight.comment && (
                              <p className="text-sm text-gray-600 mt-1">
                                {highlight.comment.text}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
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
                <TabsContent value="plagio">
                  <div className="space-y-4">
                    {plagioData?.detalles.map((obs, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50 rounded-lg border border-red-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-red-700">
                            {obs.texto}
                            {obs.url && (
                              <a
                                href={obs.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 underline text-blue-700"
                              >
                                Ver fuente
                              </a>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Página {obs.pagina}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!plagioData || plagioData.detalles.length === 0) && (
                      <div className="text-center py-6 text-gray-500">
                        No hay observaciones de similitud
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="ia">
                  <div className="text-center py-6 text-gray-500">
                    No hay observaciones de contenido generado por IA
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Button
            onClick={handleAnalizarPlagio}
            disabled={isAnalizandoPlagio}
            variant="outline"
            className="w-full mb-4"
          >
            {isAnalizandoPlagio ? "Analizando similitudes..." : "Analizar similitud"}
          </Button>
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
                    {highlights.filter((h) => h.comment.emoji === "Similitud").length}
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
                    {revision.observaciones.filter((o) => o.tipo === "Inteligencia Artificial").length}
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

