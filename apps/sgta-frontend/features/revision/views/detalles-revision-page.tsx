import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, Download, FileText, X } from "lucide-react";
import Link from "next/link";
import { ObservacionesList } from "../components/observaciones-list";

// Datos de ejemplo para una revisión específica
const revisionData = {
  id: "2",
  titulo: "Desarrollo de un sistema de monitoreo de calidad del aire utilizando IoT",
  estudiante: "Ana García",
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
    {
      id: "4",
      pagina: 15,
      parrafo: 4,
      texto: "La figura 2 no está correctamente citada en el texto.",
      tipo: "citado",
      resuelto: false,
    },
    {
      id: "5",
      pagina: 20,
      parrafo: 2,
      texto: "No está transformando la data.",
      tipo: "contenido",
      resuelto: false,
    },
    {
      id: "6",
      pagina: 22,
      parrafo: 3,
      texto: "Se detectó un posible plagio en la conclusión. Verificar y reescribir.",
      tipo: "plagio",
      resuelto: false,
    },
    {
      id: "7",
      pagina: 25,
      parrafo: 1,
      texto: "No está transformando la data.",
      tipo: "contenido",
      resuelto: true,
    },
  ] as const,
  historialRevisiones: [
    {
      fecha: "2023-11-03",
      revisor: "Dr. Roberto Sánchez",
      accion: "Inicio de revisión",
    },
    {
      fecha: "2023-11-04",
      revisor: "Dr. Roberto Sánchez",
      accion: "Detección de plagio completada",
    },
    {
      fecha: "2023-11-04",
      revisor: "Dr. Roberto Sánchez",
      accion: "Verificación de formato completada",
    },
    {
      fecha: "2023-11-05",
      revisor: "Dr. Roberto Sánchez",
      accion: "Agregadas 7 observaciones",
    },
  ],
};

export default function RevisionDetailPage({ params }: { params: { id: string } }) {
  // En una aplicación real, aquí se obtendría la revisión específica según el ID
  const revision = revisionData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/revision">
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
              <ObservacionesList observaciones={[...revision.observaciones]} />
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
                    revision.estado === "revisado"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : revision.estado === "aprobado"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }
                >
                  {revision.estado === "revisado"
                    ? "Revisado"
                    : revision.estado === "por-aprobar"
                      ? "Por Aprobar"
                      : "Aprobado"}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Detección de Plagio</h4>
                <div>

                </div>
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
                <p className="text-xs text-muted-foreground mt-1">
                  {revision.porcentajePlagio > 20
                    ? "Alto nivel de plagio detectado"
                    : revision.porcentajePlagio > 10
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
                <Link href={`/revision/revisar/${revision.id}`}>
                  <div className="flex flex-col gap-2">
                    <Button className="w-full bg-[#0743a3] hover:bg-pucp-light">
                      Continuar Revisión
                    </Button>
                    <Button className="w-full bg-[#042354] hover:bg-pucp-light">
                      Aprobar Entregable
                    </Button>
                    <Button className="w-full bg-[#EB3156] hover:bg-pucp-light">
                      Rechazar Entregable
                    </Button>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Revisión</CardTitle>
              <CardDescription>Registro de actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revision.historialRevisiones.map((item, index) => (
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
          </Card>
        </div>
      </div>
    </div>
  );
}
