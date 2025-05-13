import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Entregable } from "../../dtos/entregable";

interface EntregableCardProps {
  etapaId: string;
  entregable: Entregable;
}

export function EntregableCard({
  etapaId,
  entregable,
}: EntregableCardProps) {
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

              {/* Nuevos atributos */}
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Máximo de Documentos:</strong> {entregable.maximoDocumentos}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Extensiones Permitidas:</strong> {entregable.extensionesPermitidas}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Peso Máximo por Documento:</strong> {entregable.pesoMaximoDocumento} MB
              </p>

              <div className="flex gap-2 mt-2">
                {/* Evaluable */}
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
                  {entregable.esEvaluable ? "Evaluable" : "No evaluable"}
                </span>
              </div>
            </div>
          </div>
          <Link
            id="linkDetalleEntregable"
            href={`/coordinador/configuracion/proceso/etapa/${etapaId}/entregable/${entregable.id}`}
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
