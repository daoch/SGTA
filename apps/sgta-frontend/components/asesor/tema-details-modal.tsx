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
import { Eye } from "lucide-react";
import { Tema } from "@/app/types/temas/entidades";
import { asesorData } from "@/app/types/temas/data";

interface TemaDetailsDialogProps {
  tema: Tema;
}

export const TemaDetailsDialog: React.FC<TemaDetailsDialogProps> = ({
  tema,
}) => {
  // const asesor = tema.idUsuarioInvolucradosList?.[0]; // puedes mapear desde otro objeto real si tienes más info
  const coasesores = tema.coasesores
    .map((c) => `${c.nombres} ${c.primerApellido} ${c.segundoApellido}`)
    .join(", ");
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
          <div>
            <p className="text-sm font-medium">Título</p>
            <p className="bg-muted p-2 rounded-md">{tema.titulo}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Área</p>
            <p className="bg-muted p-2 rounded-md">{subarea}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Descripción</p>
            <p className="bg-muted p-2 rounded-md whitespace-pre-line">
              {tema.resumen}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Asesor</p>
              <p className="bg-muted p-2 rounded-md">{asesorData.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium">Estado</p>
              <Badge variant="outline">
                {tema.estadoTemaNombre ?? "No definido"}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Coasesores</p>
            <p className="bg-muted p-2 rounded-md">{coasesores || "Ninguno"}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Requisitos</p>
            <p className="bg-muted p-2 rounded-md whitespace-pre-line">
              {tema.objetivos}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Fecha Límite</p>
            <p className="bg-muted p-2 rounded-md">{tema.fechaLimite}</p>
          </div>
        </div>

        <DialogFooter className="pt-4 flex justify-between">
          <Button variant="ghost">Ver historial de cambios</Button>
          <Button variant="default">Inscribir Tema</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

