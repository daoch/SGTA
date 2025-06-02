import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Eye, Check, X, Trash2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AccionKey = "aprobar" | "rechazar" | "observar" | "eliminar";
type EstadoAccion = { show?: boolean; disabled?: boolean };
type AccionesConfig = Record<AccionKey, EstadoAccion>;

interface AccionesDetalleSoliTemaProps {
  dialogAbierto: AccionKey | "";
  setDialogAbierto: (d: AccionKey | "") => void;
  handleAccion: (
    accion: "Aprobada" | "Rechazada" | "Observada" | "Eliminada",
  ) => void;
  accionesConfig?: AccionesConfig;
}

const defaultConfig: AccionesConfig = {
  aprobar: { show: true, disabled: false },
  rechazar: { show: true, disabled: false },
  observar: { show: true, disabled: false },
  eliminar: { show: true, disabled: false },
};

export const AccionesDetalleSoliTema: React.FC<
  AccionesDetalleSoliTemaProps
> = ({
  dialogAbierto,
  setDialogAbierto,
  handleAccion,
  accionesConfig = defaultConfig,
}) => {
  const config = { ...defaultConfig, ...accionesConfig };

  // Mensajes de ayuda para cada acción
  const tooltips: Record<AccionKey, string> = {
    observar:
      "Permite observar la solicitud y dejar comentarios para corrección.",
    aprobar: "Aprueba la solicitud y el tema será registrado.",
    rechazar: "Rechaza la solicitud y el tema no será registrado.",
    eliminar: "Desactiva el tema, se libera al asesor y a los tesistas.",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Disponibles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <TooltipProvider>
          {/* Observar */}
          {config.observar.show && (
            <Dialog
              open={dialogAbierto === "observar"}
              onOpenChange={(o) => setDialogAbierto(o ? "observar" : "")}
            >
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    disabled={config.observar.disabled}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Observar
                  </Button>
                </DialogTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={-1}
                      className="inline-flex items-center justify-center rounded-md p-1"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{tooltips.observar}</TooltipContent>
                </Tooltip>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Observación</DialogTitle>
                  <DialogDescription>
                    ¿Seguro de observar esta solicitud?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogAbierto("")}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => handleAccion("Observada")}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Aprobar */}
          {config.aprobar.show && (
            <Dialog
              open={dialogAbierto === "aprobar"}
              onOpenChange={(o) => setDialogAbierto(o ? "aprobar" : "")}
            >
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={config.aprobar.disabled}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                </DialogTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={-1}
                      className="inline-flex items-center justify-center rounded-md p-1"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{tooltips.aprobar}</TooltipContent>
                </Tooltip>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Aprobación</DialogTitle>
                  <DialogDescription>
                    ¿Seguro de aprobar esta solicitud?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogAbierto("")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAccion("Aprobada")}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Rechazar */}
          {config.rechazar.show && (
            <Dialog
              open={dialogAbierto === "rechazar"}
              onOpenChange={(o) => setDialogAbierto(o ? "rechazar" : "")}
            >
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={config.rechazar.disabled}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                </DialogTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={-1}
                      className="inline-flex items-center justify-center rounded-md p-1"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{tooltips.rechazar}</TooltipContent>
                </Tooltip>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Rechazo</DialogTitle>
                  <DialogDescription>
                    ¿Seguro de rechazar esta solicitud?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogAbierto("")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAccion("Rechazada")}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Eliminar */}
          {config.eliminar.show && (
            <Dialog
              open={dialogAbierto === "eliminar"}
              onOpenChange={(o) => setDialogAbierto(o ? "eliminar" : "")}
            >
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    disabled={config.eliminar.disabled}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </DialogTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={-1}
                      className="inline-flex items-center justify-center rounded-md p-1"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{tooltips.eliminar}</TooltipContent>
                </Tooltip>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Eliminación</DialogTitle>
                  <DialogDescription>
                    ¿Seguro de eliminar esta solicitud?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogAbierto("")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAccion("Eliminada")}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

