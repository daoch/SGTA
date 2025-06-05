import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Download, FileText, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IHighlight } from "react-pdf-highlighter";
import { Observacion, ObservacionesList } from "../components/observaciones-list";
import { RevisionDocumentoAsesorDto } from "../dtos/RevisionDocumentoAsesorDto";
import { obtenerObservacionesRevision } from "../servicios/revision-service";
import { getRevisionById } from "../servicios/revisionService";

function mapHighlightToObservacion(highlight: IHighlight): Observacion {
  return {
    id: highlight.id,
    pagina: highlight.position.pageNumber ?? 1,
    parrafo: 1,
    texto: highlight.content?.text ?? "(Sin contenido)",
    tipo: mapTipoObservacion(highlight.comment.text),
    resuelto: false
  };
}

function mapTipoObservacion(nombre: string | undefined): Observacion["tipo"] {
  const lower = nombre?.toLowerCase() ?? "";
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

export default function RevisionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [revision, setRevision] = useState<RevisionDocumentoAsesorDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState(revision?.estado ?? "por_aprobar");
  const [showConfirmDialog, setShowConfirmDialog] = useState<"aprobar" | "rechazar" | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<"aprobar" | "rechazar" | null>(null);
  const [selectedTab, setSelectedTab] = useState("asesor");
  const [observaciones, setObservaciones] = useState<IHighlight[]>([]);
  const observacionesList: Observacion[] = observaciones.map(mapHighlightToObservacion);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRevisionById(params.id);
        setRevision(data);
        const obs = await obtenerObservacionesRevision(data.id);
        setObservaciones(obs);
      } catch (err: any) {
        setError("Error al cargar los datos de la revisión");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
              <div>
                <h3 className="font-semibold text-lg">{revision.titulo}</h3>
                <p className="text-muted-foreground">Estudiante: {revision.estudiante}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Fecha de Carga</h4>
                  <div className="flex items-center gap-2">
                    <span>{revision.fechaEntrega ? formatFecha(revision.fechaEntrega) : "No entregado"}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Fecha de Revisión Enviada</h4>
                  <span>{new Date(revision.fechaLimite).toLocaleDateString()}</span>
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
                    <ObservacionesList observaciones={observacionesList} editable={false} />
                  </TabsContent>
                  <TabsContent value="jurado">
                    <ObservacionesList observaciones={observacionesList} editable={false} />
                  </TabsContent>
                </Tabs>
              ) : (
                <ObservacionesList observaciones={observacionesList} editable={false} />
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

              <div>
                <h4 className="text-sm font-medium mb-2">Detección de similitud</h4>
                <div>

                </div>
                <span
                  className={
                    revision.porcentajeSimilitud !== null && revision.porcentajeSimilitud > 20
                      ? "text-red-600 font-medium"
                      : revision.porcentajeSimilitud !== null && revision.porcentajeSimilitud > 10
                        ? "text-yellow-600 font-medium"
                        : "text-green-600 font-medium"
                  }
                >
                  {revision.porcentajeSimilitud}%
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {revision.porcentajeSimilitud !== null && revision.porcentajeSimilitud > 20
                    ? "Alto nivel de similitud detectado"
                    : revision.porcentajeSimilitud !== null && revision.porcentajeSimilitud > 10
                      ? "Nivel moderado de similitud detectado"
                      : "Nivel aceptable de similitud "}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Formato válido:</span>
                  {revision.formatoValido ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Entrega a tiempo:</span>
                  {revision.entregaATiempo ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Citado correcto:</span>
                  {revision.citadoCorrecto ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Observaciones</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{observacionesList.length}</span>
                  <div>
                    <span className="text-sm text-muted-foreground">Total</span>
                    <div className="text-xs">
                      <span className="text-green-600">
                        {observacionesList.filter((o) => o.resuelto).length} resueltas
                      </span>
                      {" / "}
                      <span className="text-red-600">
                        {observacionesList.filter((o) => !o.resuelto).length} pendientes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
              onClick={() => {
                setShowConfirmDialog(null);
                setTimeout(() => {
                  setShowSuccessDialog(showConfirmDialog);
                  setEstado(showConfirmDialog === "aprobar" ? "aprobado" : "rechazado");
                }, 300); // pequeña espera para que cierre bien el primer modal
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
