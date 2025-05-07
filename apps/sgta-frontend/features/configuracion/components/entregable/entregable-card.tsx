import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";

interface EntregableCardProps {
  etapaId: string;
  entregableId: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  esEvaluable: boolean;
}

export function EntregableCard({
  etapaId,
  entregableId,
  nombre,
  descripcion,
  fechaInicio,
  fechaFin,
  esEvaluable,
}: EntregableCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{nombre}</h3>
              <p className="text-sm text-muted-foreground">
                Fechas: {fechaInicio} - {fechaFin}
              </p>
              <p className="text-sm mt-1">{descripcion}</p>
              <div className="flex gap-2 mt-2">
                {/* Evaluable */}
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
                  {esEvaluable ? "Evaluable" : "No evaluable"}
                </span>
              </div>
            </div>
          </div>
          <Link
            id="linkDetalleEntregable"
            href={`/coordinador/configuracion/proceso/etapa/${etapaId}/entregable/${entregableId}`}
          >
            <Button id="btnDetalleEntregable" variant="outline" size="sm">
              Ver detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
