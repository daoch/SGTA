import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface HistorialEvento {
  fecha: string;
  accion: string;
  responsable: string;
  comentario: string;
}

interface HistorialDetalleSolicitudTemaProps {
  historial: HistorialEvento[];
}

export const HistorialDetalleSolicitudTema: React.FC<
  HistorialDetalleSolicitudTemaProps
> = ({ historial }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <History className="w-5 h-5" />
        Historial de Evaluación
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {historial.map((evt, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              {idx < historial.length - 1 && (
                <div className="w-px h-8 bg-gray-200 mt-2" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{evt.accion}</span>
                <Badge variant="outline">{evt.responsable}</Badge>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {new Date(evt.fecha).toLocaleDateString("es-PE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>{evt.comentario}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

