"use client";
import "react-pdf-highlighter/dist/style.css";

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
import HighlighterPdfViewer from "@/features/revision/components/HighlighterPDFViewer";
import { saveAs } from "file-saver";
import { AlertTriangle, ArrowLeft, CheckCircle, FileWarning, Quote, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PDFDocument, rgb } from "pdf-lib";
import { useCallback, useEffect, useState } from "react";
import { IHighlight } from "react-pdf-highlighter/dist/types";
import { analizarPlagioArchivoS3, descargarArchivoS3 } from "../servicios/revision-service";
// ...otros imports...

// Datos de ejemplo para una revisión específica
const revisionData = {
    id: "2",
    titulo: "Desarrollo de un sistema de monitoreo de calidad del aire utilizando IoT",
    estudiante: "Ana García",
    codigo: "20190456",
    curso: "1INF46",
    entregable: "E1",
    fechaEntrega: "2023-11-02",
    fechaLimite: "2023-11-05",
    estado: "en-proceso",
    porcentajePlagio: 12,
    formatoValido: false,
    entregaATiempo: true,
    citadoCorrecto: false,
    observaciones: [
        {
            id: "1",
            pagina: 5,
            parrafo: 2,
            texto: "Falta mayor profundidad en el análisis de resultados.",
            tipo: "contenido",
            resuelto: false,
        },
        {
            id: "2",
            pagina: 8,
            parrafo: 3,
            texto: "Se detectó un posible plagio en este párrafo. Verificar la fuente original y citar correctamente.",
            tipo: "plagio",
            resuelto: false,
        },
        {
            id: "3",
            pagina: 12,
            parrafo: 1,
            texto: "La tabla 3 no tiene la referencia adecuada según normas APA.",
            tipo: "citado",
            resuelto: false,
        },
    ],
};
const observacionesPlagio = [
    {
        id: "p1",
        pagina: 3,
        texto: "Posible plagio detectado en la introducción.",
        tipo: "plagio",
        resuelto: false,
    },
    {
        id: "p2",
        pagina: 7,
        texto: "Coincidencia alta con otra fuente en la conclusión.",
        tipo: "plagio",
        resuelto: false,
    },
];

type ScrollFn = (highlight: IHighlight) => void;
export default function RevisarDocumentoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [revision, setRevision] = useState(revisionData);
    const [showObservacionForm, setShowObservacionForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showFinalizarDialog, setShowFinalizarDialog] = useState(false);
    const [showRubricaDialog, setShowRubricaDialog] = useState(false);
    const [notificaciones, setNotificaciones] = useState({
        notificarEstudiante: true,
        notificarAsesor: true,
    });
    const [highlights, setHighlights] = useState<IHighlight[]>([]);
    const [activeHighlight, setActiveHighlight] = useState<IHighlight | undefined>(undefined);

    const [tab, setTab] = useState<"revisor" | "plagio">("revisor");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
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

    const handleAnalizarPlagio = async () => {
        setIsAnalizandoPlagio(true);
        try {
            const apiData = await analizarPlagioArchivoS3("E1.pdf");
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
                const blob = await descargarArchivoS3(key);
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);

                // Obtener número de páginas usando pdf-lib
                const arrayBuffer = await blob.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                setNumPages(pdfDoc.getPageCount());
            } catch (e) {
                setPdfUrl(null);
                setNumPages(null);
            }
        }
        fetchPdf();

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [params.id]);

    useEffect(() => {
        if (numPages === null) return;
        // Solo crea highlights en páginas válidas
        const initialHighlights = revision.observaciones
            .filter(obs => obs.pagina > 0 && obs.pagina <= numPages)
            .map(obs => ({
                id: obs.id,
                content: { text: obs.texto },
                position: {
                    pageNumber: obs.pagina,
                    boundingRect: {
                        x1: 50,
                        y1: 50,
                        x2: 150,
                        y2: 70,
                        width: 100,
                        height: 20
                    },
                    rects: [],
                    usePdfCoordinates: false,
                },
                comment: { text: obs.texto, emoji: "" },
            }));
        setHighlights(initialHighlights);
    }, [revision, numPages]);
    const handleHighlightClick = useCallback((highlight: IHighlight) => {
        console.log("Click en highlight:", highlight.id);
        setActiveHighlight(undefined);
        setTimeout(() => {
            setActiveHighlight(highlight);
        }, 0);
    }, []);

    const handleSaveAnnotatedPDF = async () => {
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
    };
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
    };

    const handleUpdateHighlight = (updatedHighlight: IHighlight) => {
        setHighlights(prev => prev.map(h =>
            h.id === updatedHighlight.id ? updatedHighlight : h
        ));
    };

    const handleNewHighlight = (highlight: IHighlight) => {
        console.log("New highlight received:", highlight);
        setHighlights(prev => {
            // Check if highlight already exists
            if (prev.some(h => h.id === highlight.id)) {
                return prev;
            }
            const updatedHighlights = [...prev, highlight];
            console.log("All highlights:", updatedHighlights);
            return updatedHighlights;
        });
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
            // En una aplicación real, aquí se enviaría la revisión al backend
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Cerramos el diálogo de finalizar y mostramos la rúbrica
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
                                <h4 className="text-sm font-medium mb-2">Detección de Plagio</h4>
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
                                    <span
                                        className={
                                            revision.porcentajePlagio > 20
                                                ? "text-red-600 font-medium"
                                                : revision.porcentajePlagio > 10
                                                    ? "text-yellow-600 font-medium"
                                                    : "text-green-600 font-medium"
                                        }
                                    >
                                        {revision.porcentajePlagio}%
                                    </span>
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
                                onClick={handleFinalizarRevision}
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
                    <Card className="min-h-[600px]">
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
                        <CardContent className="relative h-[600px]" >
                            <HighlighterPdfViewer
                                pdfUrl={pdfUrl ?? ""}
                                onAddHighlight={handleNewHighlight}
                                onDeleteHighlight={handleDeleteHighlight}
                                onUpdateHighlight={handleUpdateHighlight}
                                highlights={highlights}
                                scrollToHighlight={activeHighlight}
                            />
                            {/* <PdfViewer pdfUrl="\silabo.PDF" /> */}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>

                        <CardHeader>
                            <CardTitle>Observaciones</CardTitle>
                            <CardDescription>
                                Lista de observaciones encontradas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={tab} onValueChange={v => setTab(v as "revisor" | "plagio")}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="revisor">Del Revisor</TabsTrigger>
                                    <TabsTrigger value="plagio">API de Plagio</TabsTrigger>
                                </TabsList>
                                <TabsContent value="revisor">
                                    <div className="space-y-4">
                                        {highlights.map((highlight) => (
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
                                                No hay observaciones de plagio
                                            </div>
                                        )}
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
                        {isAnalizandoPlagio ? "Analizando plagio..." : "Analizar plagio"}
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
                                        {revision.observaciones.filter((o) => o.tipo === "contenido").length}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <span>Plagio</span>
                                    </div>
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                        {revision.observaciones.filter((o) => o.tipo === "plagio").length}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Quote className="h-4 w-4 text-blue-500" />
                                        <span>Citado</span>
                                    </div>
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                        {revision.observaciones.filter((o) => o.tipo === "citado").length}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

