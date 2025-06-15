import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SolicitudTema } from "@/features/temas/types/solicitudes/entities";

interface DialogSolicitudesProps {
  solicitudes: SolicitudTema[] | [];
}

const estadoSolicitudes = {
  rechazada: "El tema ha sido rechazado",
  aprobado: "El tema ha sido aprobado",
  pendiente: "Requiere atención",
};

export const DialogSolicitudes: React.FC<DialogSolicitudesProps> = ({
  solicitudes,
}) => {
  const [open, setOpen] = useState(false);

  if (!solicitudes || solicitudes.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver solicitudes ({solicitudes.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitudes ({solicitudes.length})</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {solicitudes.map((sol) => (
            <div key={sol.solicitud_id} className="border-b pb-2">
              <div className="font-semibold">{sol.tipo_solicitud}</div>
              <div className="text-xs text-gray-500">
                {sol.estado_solicitud}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

