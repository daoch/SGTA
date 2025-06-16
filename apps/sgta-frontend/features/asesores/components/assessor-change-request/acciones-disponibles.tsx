import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import { UsuarioSolicitud } from "../../types/cambio-asesor/entidades";

interface AccionesDisponiblesSolicitudProps {
  rol?: string | null;
  coordinador: UsuarioSolicitud | undefined;
  nuevoAsesor: UsuarioSolicitud | undefined;
  anteriorAsesor: UsuarioSolicitud | undefined;
  estadoGlobal: string;
  handleAprobar: () => void;
  handleRechazar: () => void;
  onEnviarRecordatorio: () => void;
}

export default function AccionesDisponiblesSolicitud({
  rol,
  coordinador,
  nuevoAsesor,
  anteriorAsesor,
  estadoGlobal,
  handleAprobar,
  handleRechazar,
  onEnviarRecordatorio,
}: Readonly<AccionesDisponiblesSolicitudProps>) {
  if (estadoGlobal !== "PENDIENTE") {
    return null;
  }

  function debeMostrarRecordatorio(
    rolSolicitud: string,
    accionAnterior: string,
  ): boolean {
    return (
      rolSolicitud === "ASESOR_ENTRADA" && accionAnterior === "PENDIENTE_ACCION"
    );
  }

  console.log(estadoGlobal);

  function debeMostrarBotones(
    rolSolicitud: string,
    accionAnterior: string,
  ): boolean {
    return !debeMostrarRecordatorio(rolSolicitud, accionAnterior);
  }

  const mostrarRecordatorio =
    estadoGlobal === "PENDIENTE"
      ? debeMostrarRecordatorio(
          rol ?? "",
          anteriorAsesor?.accionSolicitud ?? "",
        )
      : false;

  const mostrarBotones =
    estadoGlobal === "PENDIENTE"
      ? debeMostrarBotones(rol ?? "", anteriorAsesor?.accionSolicitud ?? "")
      : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle> Acciones Disponibles </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mostrarRecordatorio && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <strong>Esperando respuesta del anterior asesor</strong>
                  <br />
                  {anteriorAsesor?.nombres} aún no ha respondido a la solicitud.
                </div>
                <Button
                  variant="outline"
                  onClick={onEnviarRecordatorio}
                  className="bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 flex-shrink-0"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Recordatorio
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {mostrarBotones && (
          <>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAprobar}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprobar Solicitud
              </Button>
              <Button
                variant="destructive"
                onClick={handleRechazar}
                className="flex-1"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Rechazar Solicitud
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
