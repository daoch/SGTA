import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Users } from "lucide-react";
import Link from "next/link";

interface ExposicionCardProps {
  etapaId: string;
  exposicionId: string;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  duracion: string;
  modalidad: "Virtual" | "Presencial";
  jurados: "Con jurados" | "Sin jurados";
}

export function ExposicionCard({
  etapaId,
  exposicionId,
  titulo,
  fechaInicio,
  fechaFin,
  descripcion,
  duracion,
  modalidad,
  jurados,
}: ExposicionCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Monitor className="h-5 w-5 mt-1 text-muted-foreground" />
            <div>
              <h3 className="font-medium">{titulo}</h3>
              <p className="text-sm text-muted-foreground">
                Fechas: {fechaInicio} - {fechaFin}
              </p>
              <p className="text-sm mt-1">{descripcion}</p>
              <p className="text-sm mt-1">Duración: {duracion}</p>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
                  {modalidad === "Virtual" ? (
                    <Monitor className="h-3 w-3 mr-1" />
                  ) : (
                    <Users className="h-3 w-3 mr-1" />
                  )}
                  {modalidad}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground">
                  {jurados}
                </span>
              </div>
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
