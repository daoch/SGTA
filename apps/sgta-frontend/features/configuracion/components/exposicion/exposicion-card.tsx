import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Users } from "lucide-react";
import Link from "next/link";

interface ExposicionCardProps {
  etapaId: string;
  exposicionId: string;
  nombre: string;
  descripcion: string;
}

export function ExposicionCard({
  etapaId,
  exposicionId,
  nombre,
  descripcion,
}: ExposicionCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Monitor className="h-5 w-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{nombre}</h3>
              <p className="text-sm mt-1">{descripcion}</p>
            </div>
          </div>
          <Link
            id="linkDetalleExposicion"
            href={`/coordinador/configuracion/proceso/etapa/${etapaId}/exposicion/${exposicionId}`}
          >
            <Button id="btnDetalleExposicion" variant="outline" size="sm">
              Ver detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
