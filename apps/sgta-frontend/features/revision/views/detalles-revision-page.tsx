import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Download, FileText, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ObservacionesList } from "../components/observaciones-list";

const revisionesData = [
  {
    id: "1",
    titulo:
      "Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real",
    entregable: "E4",
    estudiante: "Carlos Mendoza",
    codigo: "20180123",
    curso: "tesis1",
    fechaEntrega: "2023-10-15",
    fechaLimite: "2023-10-20",
    estado: "aprobado",
    porcentajePlagio: 5,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: [
      {
        id: "1",
        pagina: 4,
        parrafo: 1,
        texto: "La introducción no presenta claramente los objetivos del estudio.",
        tipo: "contenido" as const,
        resuelto: true,
      },
      {
        id: "2",
        pagina: 9,
        parrafo: 2,
        texto: "El modelo descrito carece de justificación teórica adecuada.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "3",
        pagina: 14,
        parrafo: 3,
        texto: "Falta la referencia de la figura 5 en el texto.",
        tipo: "citado" as const,
        resuelto: true,
      },
    ],
    ultimoCiclo: "2025-1",
  },
  {
    id: "2",
    titulo:
      "Desarrollo de un sistema de monitoreo de calidad del aire utilizando IoT",
    entregable: "E4",
    estudiante: "Ana García",
    codigo: "20190456",
    curso: "tesis1",
    fechaEntrega: "2023-11-02",
    fechaLimite: "2023-11-05",
    estado: "por-aprobar",
    porcentajePlagio: 12,
    formatoValido: false,
    entregaATiempo: true,
    citadoCorrecto: false,
    observaciones: [
      {
        id: "1",
        pagina: 5,
        parrafo: 2,
        texto: "No está transformando la data.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "2",
        pagina: 8,
        parrafo: 3,
        texto: "Se detectó un posible plagio en este párrafo. Verificar la fuente original y citar correctamente.",
        tipo: "plagio" as const,
        resuelto: false,
      },
      {
        id: "3",
        pagina: 12,
        parrafo: 1,
        texto: "La tabla 3 no tiene la referencia adecuada según normas APA.",
        tipo: "citado" as const,
        resuelto: false,
      },
      {
        id: "4",
        pagina: 15,
        parrafo: 4,
        texto: "La figura 2 no está correctamente citada en el texto.",
        tipo: "citado" as const,
        resuelto: false,
      },
      {
        id: "5",
        pagina: 20,
        parrafo: 2,
        texto: "No está transformando la data.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "6",
        pagina: 22,
        parrafo: 3,
        texto: "Se detectó un posible plagio en la conclusión. Verificar y reescribir.",
        tipo: "plagio" as const,
        resuelto: false,
      },
      {
        id: "7",
        pagina: 25,
        parrafo: 1,
        texto: "No está transformando la data.",
        tipo: "contenido" as const,
        resuelto: true,
      },
    ],
    ultimoCiclo: "2025-1",
  },
  {
    id: "3",
    titulo:
      "Análisis comparativo de frameworks de desarrollo web para aplicaciones de alta concurrencia",
    entregable: "E4",
    estudiante: "Luis Rodríguez",
    codigo: "20180789",
    curso: "tesis2",
    fechaEntrega: "2023-09-28",
    fechaLimite: "2023-10-01",
    estado: "aprobado",
    porcentajePlagio: 8,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: [
      {
        id: "1",
        pagina: 6,
        parrafo: 2,
        texto: "Falta contextualización de los frameworks seleccionados.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "2",
        pagina: 11,
        parrafo: 3,
        texto: "La gráfica de rendimiento no tiene fuente citada.",
        tipo: "citado" as const,
        resuelto: false,
      },
    ],
    ultimoCiclo: "2025-1",
  },
  {
    id: "4",
    titulo:
      "Diseño e implementación de un sistema de recomendación basado en filtrado colaborativo",
    entregable: "E4",
    estudiante: "María Torres",
    codigo: "20190321",
    curso: "tesis2",
    fechaEntrega: null,
    fechaLimite: "2023-11-25",
    estado: "revisado",
    porcentajePlagio: null,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: [],
    ultimoCiclo: "2024-2",
  },
  {
    id: "5",
    titulo:
      "Optimización de consultas en bases de datos NoSQL para aplicaciones de big data",
    entregable: "E4",
    estudiante: "Jorge Sánchez",
    codigo: "20180654",
    curso: "tesis1",
    fechaEntrega: "2023-11-10",
    fechaLimite: "2023-11-08",
    estado: "revisado",
    porcentajePlagio: 15,
    formatoValido: true,
    entregaATiempo: false,
    citadoCorrecto: true,
    observaciones: [
      {
        id: "1",
        pagina: 7,
        parrafo: 1,
        texto: "La consulta presentada no es eficiente para grandes volúmenes.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "2",
        pagina: 9,
        parrafo: 2,
        texto: "Falta referencia al motor NoSQL utilizado.",
        tipo: "citado" as const,
        resuelto: true,
      },
      {
        id: "3",
        pagina: 13,
        parrafo: 4,
        texto: "El benchmark presentado no incluye métrica de latencia.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "4",
        pagina: 16,
        parrafo: 2,
        texto: "Conclusión no se alinea con los resultados obtenidos.",
        tipo: "contenido" as const,
        resuelto: true,
      },
      {
        id: "5",
        pagina: 17,
        parrafo: 1,
        texto: "Falta tabla de comparación de tecnologías.",
        tipo: "contenido" as const,
        resuelto: false,
      },
    ],
    ultimoCiclo: "2023-2",
  },
  {
    id: "6",
    titulo: "Evaluación del impacto del uso de energías renovables en zonas rurales",
    entregable: "E4",
    estudiante: "Lucía Fernández",
    codigo: "20190567",
    curso: "tesis2",
    fechaEntrega: "2023-11-12",
    fechaLimite: "2023-11-10",
    estado: "rechazado",
    porcentajePlagio: 28,
    formatoValido: true,
    entregaATiempo: false,
    citadoCorrecto: false,
    observaciones: [
      {
        id: "1",
        pagina: 3,
        parrafo: 1,
        texto: "No se menciona la fuente de los datos de consumo energético.",
        tipo: "citado" as const,
        resuelto: false,
      },
      {
        id: "2",
        pagina: 6,
        parrafo: 2,
        texto: "Conclusión carece de respaldo en datos.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "3",
        pagina: 8,
        parrafo: 3,
        texto: "Los datos de energía solar están desactualizados.",
        tipo: "contenido" as const,
        resuelto: false,
      },
      {
        id: "4",
        pagina: 11,
        parrafo: 1,
        texto: "El mapa no tiene escala definida.",
        tipo: "contenido" as const,
        resuelto: true,
      },
      {
        id: "5",
        pagina: 13,
        parrafo: 3,
        texto: "Falta comparación con estudios similares.",
        tipo: "citado" as const,
        resuelto: false,
      },
      {
        id: "6",
        pagina: 18,
        parrafo: 4,
        texto: "El uso de términos técnicos no es consistente.",
        tipo: "contenido" as const,
        resuelto: true,
      },
    ],
    ultimoCiclo: "2025-1",
  },
];

export default function RevisionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const revision = revisionesData.find(r => r.id === params.id);
  const [estado, setEstado] = useState(revision?.estado ?? "por-aprobar");
  const [showConfirmDialog, setShowConfirmDialog] = useState<"aprobar" | "rechazar" | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<"aprobar" | "rechazar" | null>(null);
  const [selectedTab, setSelectedTab] = useState("asesor");

  if (!revision || !Array.isArray(revision.observaciones)) {
    return <div className="text-center mt-10 text-red-600">Revisión no encontrada o sin observaciones detalladas</div>;
  }

  const handleContinuar = () => {
    router.push(`../revisar-doc/${revision.id}`);
  };

  const observacionesJurado = [
    {
      id: "1",
      pagina: 10,
      parrafo: 1,
      texto: "La metodología no está bien detallada para su validación empírica.",
      tipo: "contenido" as const,
      resuelto: false,
    },
    {
      id: "2",
      pagina: 18,
      parrafo: 2,
      texto: "La bibliografía no está normalizada según APA 7ma edición.",
      tipo: "citado" as const,
      resuelto: false,
    }
  ];

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
                    {revision.fechaEntrega ? (
                      <>
                        <span>{new Date(revision.fechaEntrega).toLocaleDateString()}</span>
                        {!revision.entregaATiempo && (
                          <Badge variant="destructive" className="ml-2">
                            Fuera de plazo
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">No entregado</span>
                    )}
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
                    <ObservacionesList observaciones={revision.observaciones} />
                  </TabsContent>
                  <TabsContent value="jurado">
                    <ObservacionesList observaciones={observacionesJurado} />
                  </TabsContent>
                </Tabs>
              ) : (
                <ObservacionesList observaciones={revision.observaciones} />
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
                <h4 className="text-sm font-medium mb-2">Detección de Plagio</h4>
                <div>

                </div>
                <span
                  className={
                    revision.porcentajePlagio !== null && revision.porcentajePlagio > 20
                      ? "text-red-600 font-medium"
                      : revision.porcentajePlagio !== null && revision.porcentajePlagio > 10
                        ? "text-yellow-600 font-medium"
                        : "text-green-600 font-medium"
                  }
                >
                  {revision.porcentajePlagio}%
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {revision.porcentajePlagio !== null && revision.porcentajePlagio > 20
                    ? "Alto nivel de plagio detectado"
                    : revision.porcentajePlagio !== null && revision.porcentajePlagio > 10
                      ? "Nivel moderado de plagio detectado"
                      : "Nivel aceptable de plagio"}
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

              <div className="pt-4">
                {estado === "por-aprobar" && (
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
