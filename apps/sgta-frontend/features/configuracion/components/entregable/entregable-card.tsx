import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { Entregable } from "../../dtos/entregable";

interface EntregableCardProps {
  etapaId: string;
  entregable: Entregable;
}

export function EntregableCard({
  etapaId,
  entregable,
  onDelete,
}: EntregableCardProps & { onDelete: (id: string) => void }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{entregable.nombre}</h3>
              <p className="text-sm text-muted-foreground">
                Fecha de apertura:{" "}
                {new Date(entregable.fechaInicio).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - Fecha de cierre:{" "}
                {new Date(entregable.fechaFin).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm mt-1">{entregable.descripcion}</p>
            </div>
          </div>
          {/* Contenedor para alinear los botones */}
          <div className="flex items-center space-x-2">
            <Link
              id="linkDetalleEntregable"
              href={`/coordinador/configuracion/proceso/etapa/${etapaId}/entregable/${entregable.id}`}
            >
              <Button id="btnDetalleEntregable" variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Detalles
              </Button>
            </Link>
            <Button
              id="btnDeleteEntregable"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50"
              onClick={() => onDelete(entregable.id || "")}
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