import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Monitor, Trash2 } from "lucide-react";
import Link from "next/link";
import { Exposicion } from "../../dtos/exposicion";

interface ExposicionCardProps {
  etapaId: string;
  exposicion: Exposicion;
}

export function ExposicionCard({
  etapaId,
  exposicion,
  onDelete,
}: ExposicionCardProps & { onDelete: (id: string) => void }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Monitor className="h-5 w-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{exposicion.nombre}</h3>
              <p className="text-sm mt-1">{exposicion.descripcion}</p>
            </div>
          </div>
          {/* Contenedor para alinear los botones */}
          <div className="flex items-center space-x-2">
            <Link
              id="linkDetalleExposicion"
              href={`/coordinador/configuracion/proceso/etapa/${etapaId}/exposicion/${exposicion.id}`}
            >
              <Button id="btnDetalleExposicion" variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Detalles
              </Button>
            </Link>
            <Button
              id="btnDeleteExposicion"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50"
              onClick={() => onDelete(exposicion.id || "")}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}