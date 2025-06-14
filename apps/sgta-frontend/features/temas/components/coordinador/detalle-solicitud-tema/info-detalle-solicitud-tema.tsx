import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Target } from "lucide-react";
import { SolicitudPendiente } from "../../../types/solicitudes/entities";

interface InfoDetalleSolicitudTemaProps {
  solicitud: SolicitudPendiente;
}

export const InfoDetalleSolicitudTema: React.FC<
  InfoDetalleSolicitudTemaProps
> = ({ solicitud }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Información del Tema
      </CardTitle>
    </CardHeader>
    <CardContent>
      {/* Project Summary */}
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Resumen del proyecto
        </h4>
        <p>{solicitud.tema.resumen}</p>
      </div>
      <Separator className="mb-3 mt-3" />
      {/* Project Goals */}
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Objetivos del proyecto
        </h4>
        <p>{solicitud.tema.objetivos}</p>
      </div>
    </CardContent>
  </Card>
);

