import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";

interface EntregableCardProps {
  etapaId: string;
  entregableId: string;
  titulo: string;
  fecha: string;
  descripcion: string;
}

export function EntregableCard({
  etapaId,
  entregableId,
  titulo,
  fecha,
  descripcion,
}: EntregableCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{titulo}</h3>
              <p className="text-sm text-muted-foreground">
                Fecha límite: {fecha}
              </p>
              <p className="text-sm mt-1">{descripcion}</p>
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
