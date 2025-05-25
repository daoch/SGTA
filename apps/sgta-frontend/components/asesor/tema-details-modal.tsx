import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye, History } from "lucide-react";
import { Tema } from "@/app/types/temas/entidades";
import { asesorData } from "@/app/types/temas/data";
import { Tipo } from "@/app/types/temas/enums";

interface TemaDetailsDialogProps {
  tema: Tema;
}

/**
 * Muestra en un Dialog el detalle de un tema.
 * @param tema
 * @returns TemaDetailsDialog
 */
export const TemaDetailsDialog: React.FC<TemaDetailsDialogProps> = ({
  tema,
}) => {
  const coasesores = tema.coasesores
    ? tema.coasesores
        .map((c) => `${c.nombres} ${c.primerApellido} ${c.segundoApellido}`)
        .join(", ")
    : "";
  const subarea = tema.subareas?.[0]?.nombre || "No especificada";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalles</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Tema</DialogTitle>
          <DialogDescription>
            Información completa sobre el tema propuesto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Title */}
          <div>
            <p className="text-sm font-medium">Título</p>
            <p className="bg-muted p-2 rounded-md">{tema.titulo}</p>
          </div>

          {/* Area */}
          <div>
            <p className="text-sm font-medium">Área</p>
            <p className="bg-muted p-2 rounded-md">{subarea}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium">Descripción</p>
            <p className="bg-muted p-2 rounded-md whitespace-pre-line">
              {tema.resumen}
            </p>
          </div>

          {/* Asesor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Asesor</p>
              <p className="bg-muted p-2 rounded-md">{asesorData.name}</p>
            </div>

            {/* Estado */}
            <div>
              <p className="text-sm font-medium">Estado</p>
              <div className="bg-muted p-2 rounded-md">
                <Badge variant="outline">
                  {tema.estadoTemaNombre ?? "No definido"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Coasesores */}
          {coasesores && coasesores.length && (
            <div>
              <p className="text-sm font-medium">Coasesores</p>
              <p className="bg-muted p-2 rounded-md">{coasesores}</p>
            </div>
          )}

          {/* Students */}
          {tema.tesistas && tema.tesistas.length > 0 && (
            <div>
              <p className="text-sm font-medium">Estudiantes</p>
              <div className="space-y-2">
                {tema.tesistas.map((tesista) => (
                  <div
                    key={tesista.id}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {tesista.nombres} {tesista.primerApellido}{" "}
                        {tesista.segundoApellido}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tesista.codigoPucp}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver portafolio
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}

          {/* Requisitos */}
          {tema.objetivos && tema.objetivos.trim() !== "" && (
            <div>
              <p className="text-sm font-medium">Requisitos</p>
              <p className="bg-muted p-2 rounded-md whitespace-pre-line">
                {tema.objetivos}
              </p>
            </div>
          )}

          {/* Fecha límite */}
          {tema.fechaLimite && (
            <div>
              <p className="text-sm font-medium">Fecha Límite</p>
              <p className="bg-muted p-2 rounded-md">
                {formatDate(tema.fechaLimite)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 flex justify-between">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Ver historial de cambios
          </Button>
          <Button variant="outline">Cerrar</Button>
          {tema.estadoTemaNombre === Tipo.LIBRE && (
            <Button variant="default">Inscribir Tema</Button>
          )}{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function formatDate(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const anio = fecha.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
}
