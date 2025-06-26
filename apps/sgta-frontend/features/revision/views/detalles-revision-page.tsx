import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { UsuarioDto } from "@/features/coordinador/dtos/UsuarioDto";
import axiosInstance from "@/lib/axios/axios-instance";
import { ArrowLeft, CheckCircle, Download, FileText, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IHighlight } from "react-pdf-highlighter";
import { Observacion, ObservacionesList } from "../components/observaciones-list";
import { RevisionDocumentoAsesorDto } from "../dtos/RevisionDocumentoAsesorDto";
import { getRevisionById, getStudentsByRevisor, obtenerObservacionesRevision } from "../servicios/revision-service";

function mapTipoObservacion(nombre?: string): Observacion["tipo"] {
  const lower = nombre?.toLowerCase().trim() ?? "";

  if (lower.includes("inteligencia")) return "inteligencia";
  if (lower.includes("similitud")) return "similitud";
  if (lower.includes("citado")) return "citado";

  return "contenido";
}

function formatFecha(fecha: string) {
  const date = new Date(fecha);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
}

// Extiende IHighlight para permitir el campo corregido
interface IHighlightConCorregido extends IHighlight {
  corregido?: boolean;
}

export default function RevisionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [revision, setRevision] = useState<RevisionDocumentoAsesorDto | null>(null);
  const [alumnos, setAlumnos] = useState<UsuarioDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState(revision?.estado ?? "por_aprobar");
  const [showConfirmDialog, setShowConfirmDialog] = useState<"aprobar" | "rechazar" | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<"aprobar" | "rechazar" | null>(null);
  const [selectedTab, setSelectedTab] = useState("asesor");
  const [observaciones, setObservaciones] = useState<IHighlight[]>([]);
  const [observacionesList, setObservacionesList] = useState<Observacion[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRevisionById(params.id);
        setRevision(data);
        setEstado(data.estado);
        const obs = await obtenerObservacionesRevision(data.id);
        setObservaciones(obs);
      } catch {
        setError("Error al cargar los datos de la revisión");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStudentsByRevisor(params.id);
        setAlumnos(data);
      } catch {
        setError("Error al cargar los alumnos de la revisión");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  async function actualizarEstadoRevision(revisionId: number, nuevoEstado: string) {
    try {
      const response = await axiosInstance.put(`/revision/${revisionId}/estado`, {
        estado: nuevoEstado
      });
      return response.data; // o response.status si solo te importa el status
    } catch (error) {
      console.error("Error en la actualización:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        const highlights = await obtenerObservacionesRevision(Number(params.id));
        const observaciones: Observacion[] = (highlights as IHighlightConCorregido[]).map((h) => ({
          id: String(h.id),
          pagina: h.position.pageNumber,
          parrafo: 0,
          texto: h.content.text ?? "",
          tipo: mapTipoObservacion(h.comment.text),
          resuelto: (h as any).resuelto ?? h.corregido ?? false, // Cambiado aquí
          corregido: h.corregido ?? false,
        }));
        setObservacionesList(observaciones);
      } catch (error) {
        console.error("Error cargando observaciones:", error);
      }
    };

    if (params.id) {
      fetchObservaciones();
    }
  }, [params.id]);

  if (loading) {
    return <div className="text-center mt-10 text-muted-foreground">Cargando revisión...</div>;
  }

  if (error || !revision) {
    return <div className="text-center mt-10 text-red-600">{error || "Revisión no encontrada"}</div>;
  }

  if (!revision) {
    return <div className="text-center mt-10 text-red-600">Revisión no encontrada</div>;
  }

  const renderEstudiantes = () => {
    return (
      <div className="space-y-2">
        {alumnos.map((estudiante, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <div className="font-medium">{estudiante.nombres} {estudiante.primerApellido} {estudiante.segundoApellido}</div>
              <div className="text-sm text-muted-foreground">{estudiante.codigoPucp}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={"../"}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-pucp-blue">Detalles de Revisión</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Documento</span>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Descargar
                </Button>
              </CardTitle>
              <CardDescription>Información del documento bajo revisión</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Información del tema y alumnos */}
              <div>
                <h3 className="font-semibold text-lg">{revision.titulo}</h3>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Estudiantes:</h4>
                {renderEstudiantes()}
              </div>
              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Fecha de Entrega de Documento</h4>
                  <div className="flex items-center gap-2">
                    {revision.fechaEntrega ? (
                      <>
                        <span>{new Date(revision.fechaEntrega).toLocaleDateString()}</span>
                        {revision.fechaEntrega && revision.fechaLimiteEntrega && (
                          <Badge
                            variant={revision.fechaEntrega > revision.fechaLimiteEntrega ? "destructive" : "success"}
                            className="ml-2"
                          >
                            {revision.fechaEntrega > revision.fechaLimiteEntrega ? "Fuera de plazo" : "Dentro de plazo"}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">No entregado</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Fecha Límite de Revisión</h4>
                  <span>{new Date(revision.fechaLimiteRevision).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
              <CardDescription>Lista de observaciones encontradas durante la revisión</CardDescription>
            </CardHeader>
            <CardContent>
              {estado === "revisado" ? (
                <Tabs defaultValue="asesor" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="asesor">Del Asesor</TabsTrigger>
                    <TabsTrigger value="jurado">Del Profesor o Jurado</TabsTrigger>
                  </TabsList>
                  <TabsContent value="asesor">
                    <ObservacionesList key={observacionesList.length} observaciones={observacionesList} editable={false} onChange={setObservacionesList} />
                  </TabsContent>
                  <TabsContent value="jurado">
                    <ObservacionesList key={observacionesList.length} observaciones={observacionesList} editable={false} onChange={setObservacionesList} />
                  </TabsContent>
                </Tabs>
              ) : (
                <ObservacionesList key={observacionesList.length} observaciones={observacionesList} editable={true} onChange={setObservacionesList} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Revisión</CardTitle>
              <CardDescription>Resumen del estado actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estado:</span>
                <Badge
                  variant="outline"
                  className={
                    estado === "revisado"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : estado === "aprobado"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : estado === "rechazado"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }
                >
                  {estado === "revisado"
                    ? "Revisado"
                    : estado === "aprobado"
                      ? "Aprobado"
                      : estado === "rechazado"
                        ? "Rechazado"
                        : "Por Aprobar"}
                </Badge>

              </div>

              <Separator />

              {revision.porcentajeSimilitud !== null && (
                <>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Detección de similitud</h4>

                    <span
                      className={
                        revision.porcentajeSimilitud > 20
                          ? "text-red-600 font-medium"
                          : revision.porcentajeSimilitud > 10
                            ? "text-yellow-600 font-medium"
                            : "text-green-600 font-medium"
                      }
                    >
                      {revision.porcentajeSimilitud}%
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {revision.porcentajeSimilitud > 20
                        ? "Alto nivel de similitud detectado"
                        : revision.porcentajeSimilitud > 10
                          ? "Nivel moderado de similitud detectado"
                          : "Nivel aceptable de similitud"}
                    </p>
                  </div>

                  <Separator />
                </>
              )}

              {revision.porcentajeGenIA !== null && (
                <>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Detección de contenido generado por Inteligencia Artificial</h4>

                    <span
                      className={
                        revision.porcentajeGenIA > 20
                          ? "text-red-600 font-medium"
                          : revision.porcentajeGenIA > 10
                            ? "text-yellow-600 font-medium"
                            : "text-green-600 font-medium"
                      }
                    >
                      {revision.porcentajeGenIA}%
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {revision.porcentajeGenIA > 20
                        ? "Alto nivel de contenido generado por IA detectado"
                        : revision.porcentajeGenIA > 10
                          ? "Nivel moderado de contenido generado por IA detectado"
                          : "Nivel aceptable de contenido generado por IA"}
                    </p>
                  </div>

                  <Separator />
                </>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Formato válido:</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Entrega a tiempo:</span>
                  {revision.fechaEntrega < revision.fechaLimiteEntrega ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Citado correcto:</span>
                  {
                    observacionesList.some((obs) => obs.tipo === "citado") ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )
                  }
                </div>
              </div>

              <Separator />

              {observacionesList.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Observaciones</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{observacionesList.length}</span>
                    <div>
                      <span className="text-sm text-muted-foreground">Total</span>
                      <div className="text-xs">
                        <span className="text-red-600">
                          {observacionesList.filter((o) => !o.resuelto).length} pendientes
                        </span>
                        {" / "}
                        <span className="text-green-600">
                          {observacionesList.filter((o) => o.resuelto).length} resueltas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                {estado === "por_aprobar" && (
                  <div className="flex flex-col gap-2">
                    <Link href={`../revisar-doc/${revision.id}`}>
                      <Button className="w-full bg-[#0743a3] hover:bg-pucp-light">
                        Continuar Revisión
                      </Button>
                    </Link>
                    <Button
                      className="w-full bg-[#042354] hover:bg-pucp-light"
                      onClick={() => setShowConfirmDialog("aprobar")}
                    >
                      Aprobar Entregable
                    </Button>
                    <Button
                      className="w-full bg-[#EB3156] hover:bg-pucp-light"
                      onClick={() => setShowConfirmDialog("rechazar")}
                    >
                      Rechazar Entregable
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/*<Card>
            <CardHeader>
              <CardTitle>Historial de Revisión</CardTitle>
              <CardDescription>Registro de actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revision.historialRevisiones?.map((item, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4 pb-4 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-pucp-blue -left-[5px] top-2"></div>
                    <p className="text-sm font-medium">{item.accion}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(item.fecha).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.revisor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>*/}
        </div>
      </div>
      <Dialog open={!!showConfirmDialog} onOpenChange={() => setShowConfirmDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {showConfirmDialog === "aprobar" ? "Aprobar Entregable" : "Rechazar Entregable"}
            </DialogTitle>
            <DialogDescription>
              La decisión será enviada al estudiante.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(null)}>Cancelar</Button>
            <Button
              className="bg-[#042354] hover:bg-pucp-light"
              onClick={async () => {
                try {
                  // Llamada al backend para actualizar el estado de la revisión
                  await actualizarEstadoRevision(Number(params.id), showConfirmDialog === "aprobar" ? "aprobado" : "rechazado");

                  // Actualiza el estado local de la revisión (si lo estás usando en la vista)
                  setRevision({ ...revision, estado: showConfirmDialog === "aprobar" ? "aprobado" : "rechazado" });

                  // Notificación de éxito
                  toast({
                    title: showConfirmDialog === "aprobar" ? "Entregable aprobado" : "Entregable rechazado",
                  });

                  // Cierra el modal de confirmación
                  setShowConfirmDialog(null);

                  // Espera breve para transición y abre el modal de éxito
                  setTimeout(() => {
                    setShowSuccessDialog(showConfirmDialog);
                    setEstado(showConfirmDialog === "aprobar" ? "aprobado" : "rechazado");
                  }, 300);
                } catch {
                  // Notificación de error
                  toast({
                    title: "Error al enviar la decisión",
                    variant: "destructive",
                  });
                }
              }}
            >
              Confirmar y Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!showSuccessDialog} onOpenChange={() => setShowSuccessDialog(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>
              ¡{showSuccessDialog === "aprobar" ? "Aprobación" : "Rechazo"} Enviado!
            </DialogTitle>
            <DialogDescription>
              La {showSuccessDialog === "aprobar" ? "aprobación" : "decisión de rechazo"} ha sido enviada correctamente a los destinatarios seleccionados para su revisión.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={() => router.push("../")}>Volver al listado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
