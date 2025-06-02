import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Calendar } from "lucide-react";
import clsx from "clsx";
import { mapEstadoSolToClassName } from "../../../types/solicitudes/lib";
import { SolicitudPendiente } from "../../../types/solicitudes/entities";

interface EncabezadoDetalleSolicitudTemaProps {
  solicitud: SolicitudPendiente;
}

export const EncabezadoDetalleSolicitudTema: React.FC<
  EncabezadoDetalleSolicitudTemaProps
> = ({ solicitud }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4 mb-4">
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/coordinador/aprobaciones")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a solicitudes
        </Button> */}
        <Badge variant="secondary" className="text-sm">
          # {solicitud.id} {solicitud.tema.id}
        </Badge>
      </div>
      <div className="space-y-4">
        <div>
          <CardTitle className="text-2xl md:text-3xl">
            {solicitud.tema.titulo}
          </CardTitle>
          <Badge
            variant="outline"
            className={clsx(
              "flex items-center gap-1",
              mapEstadoSolToClassName(solicitud.estado),
            )}
          >
            <Clock className="w-4 h-4" />
            {solicitud.estado}
          </Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Estudiantes:</span>
            <span>
              {solicitud.tema.tesistas
                ?.map((t) => `${t.nombres} ${t.primerApellido}`)
                .join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Asesor:</span>
            <span>
              {solicitud.tema.coasesores && solicitud.tema.coasesores.length > 0
                ? `${solicitud.tema.coasesores[0].nombres} ${solicitud.tema.coasesores[0].primerApellido}`
                : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Fecha:</span>
            <span>
              {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
);

