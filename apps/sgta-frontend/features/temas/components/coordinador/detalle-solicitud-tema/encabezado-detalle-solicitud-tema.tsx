import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Calendar, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { mapEstadoSolToClassName } from "../../../types/solicitudes/lib";
import { SolicitudPendiente } from "../../../types/solicitudes/entities";
import { joinUsers } from "@/lib/temas/lib";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const texts = {
  backButton: "Volver a solicitudes",
  estudiantes: "Estudiantes:",
  asesores: "Asesores:",
  fecha: "Fecha:",
};

interface EncabezadoDetalleSolicitudTemaProps {
  solicitud: SolicitudPendiente;
}

export const EncabezadoDetalleSolicitudTema: React.FC<
  EncabezadoDetalleSolicitudTemaProps
> = ({ solicitud }) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Link href="/coordinador/aprobaciones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {texts.backButton}
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          <div>
            <CardTitle className="text-2xl font-bold text-[#042354] mb-1.5">
              {solicitud.tema.titulo}
            </CardTitle>
            {/* Badges */}
            <div className="flex gap-1.5">
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
              <Badge variant="secondary" className="text-sm">
                # {solicitud.tema.id}
              </Badge>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {/* Students */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col lg:flex-row md:items-center gap-0.5 md:gap-2">
                <span className="font-medium">{texts.estudiantes}</span>
                <span>{joinUsers(solicitud.tema.tesistas || [])}</span>
              </div>
            </div>
            {/* Asesores */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col lg:flex-row md:items-center gap-0.5 md:gap-2">
                <span className="font-medium">{texts.asesores}</span>
                <span>{joinUsers(solicitud.tema.coasesores || [])}</span>
              </div>
            </div>
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div className="flex flex-col lg:flex-row md:items-center gap-0.5 md:gap-2">
                <span className="font-medium">{texts.fecha}</span>
                <span>
                  {new Date(solicitud.fechaSolicitud).toLocaleDateString(
                    "es-PE",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

