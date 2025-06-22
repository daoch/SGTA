import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { CheckCircle, AlertCircle, XCircle, ClipboardList } from "lucide-react";
import {
  SolicitudTema,
  SolicitudState,
  SolicitudType,
} from "@/features/temas/types/solicitudes/entities";
import { Card, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EstadoTemaNombre } from "@/features/temas/types/temas/enums";
import { Textarea } from "@/components/ui/textarea";
import { fetchUpdateSolicitudCoordinador } from "@/features/temas/types/solicitudes/data";
import { toast, Toaster } from "sonner";

type VariantColor = "red" | "green" | "neutro";

interface DialogSolicitudesProps {
  solicitudes: SolicitudTema[] | [];
  estadoTema: EstadoTemaNombre;
  listoSolicitudes: boolean;
  setListoSolicitudes: React.Dispatch<React.SetStateAction<boolean>>;
}

const labelTexts = {
  red: "Requiere atención",
  green: null,
  neutro: null,
};

const texts = {
  title: "Solicitudes del Tema",
  description: "solicitudes",
  description_sinSolicitudes: "Sin solicitudes",
};

const solStateVariant: Record<SolicitudState, VariantColor> = {
  ACEPTADA: "green",
  PENDIENTE: "red",
  RECHAZADA: "neutro",
};

const dialogTexts = {
  aprobarButton: {
    aprobado: "Aceptada",
    porAprobar: "Marcar como aceptada",
    ask: "¿Seguro de marcar esta solicitud como aceptada?",
    cancel: "Cancelar",
    confirm: "Confirmar",
    textArea: { placeholder: "Escriba el comentario de aceptacíon aquí ..." },
  },
};

export const DialogSolicitudes: React.FC<DialogSolicitudesProps> = ({
  solicitudes,
  estadoTema,
  listoSolicitudes,
  setListoSolicitudes,
}) => {
  const [open, setOpen] = useState(false);
  const [aprobadas, setAprobadas] = useState<Record<number, boolean>>({}); // Solicitudes aprobadas
  const [dialogAbierto, setDialogAbierto] = useState<number | null>(null); // NUEVO: id de solicitud con diálogo abierto
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggleAtendida = (id: number) => {
    setAprobadas((prev) => {
      const nueva = { ...prev, [id]: !prev[id] };
      const okCount = Object.values(nueva).filter(Boolean).length;
      setListoSolicitudes(okCount >= counts.PENDIENTE);
      return nueva;
    });
  };

  const sinSolicitudes = !solicitudes || solicitudes.length === 0;

  // Contar por estado
  const counts: Record<SolicitudState, number> = {
    ACEPTADA: 0,
    PENDIENTE: 0,
    RECHAZADA: 0,
  };
  solicitudes.forEach((s) => {
    counts[s.estado_solicitud]++;
  });

  const requiereAtencion = counts.PENDIENTE > 0;

  let variant: VariantColor;
  if (requiereAtencion) {
    variant = !listoSolicitudes ? "red" : "green";
  } else {
    variant = "neutro";
  }

  const actionButton = (
    <VariantCard color={variant}>
      <CardHeader>
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className={iconBgStyles({ color: variant })}>
            <ClipboardList className="w-5 h-5 text-black-700" />
          </div>
          <div className="flex-1">
            {/* Title */}
            <div className="font-semibold text-lg text-[#042354]">
              {texts.title}
            </div>
            {/* Summary */}
            <div className="flex items-end gap-2">
              {!sinSolicitudes && (
                <span className="text-3xl font-extrabold text-[#042354]">
                  {solicitudes.length}
                </span>
              )}
              <span className="text-gray-500 mb-1">
                {!sinSolicitudes
                  ? texts.description
                  : texts.description_sinSolicitudes}
              </span>
            </div>
            {/* Label */}
            {labelTexts[variant] && (
              <Badge className={badgeEstadoStyles({ color: variant })}>
                {labelTexts[variant]}
              </Badge>
            )}
          </div>
          {/* Counts Labels */}
          {!sinSolicitudes && (
            <div className="flex flex-col gap-1 items-start">
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" /> {counts.PENDIENTE}
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" /> {counts.ACEPTADA}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <XCircle className="w-4 h-4" /> {counts.RECHAZADA}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
    </VariantCard>
  );

  const tiposAprobacion = [
    SolicitudType.APROBACION_TEMA,
    SolicitudType.CAMBIO_RESUMEN,
    SolicitudType.CAMBIO_TITULO,
  ];

  function requiresApproval(sol: SolicitudTema): boolean {
    return (
      !tiposAprobacion.includes(sol.tipo_solicitud as SolicitudType) &&
      sol.estado_solicitud === "PENDIENTE"
    );
  }

  async function handleAceptarSolicitud(
    solicitud_id: number,
    respuesta: string,
  ) {
    setLoading(true);
    try {
      await fetchUpdateSolicitudCoordinador(solicitud_id, respuesta);
      // Opcional: feedback al usuario, recargar datos, etc.
      handleToggleAtendida(solicitud_id);
      setDialogAbierto(null);
      setComentario("");
    } catch (error) {
      // Manejo de error, por ejemplo mostrar un toast o mensaje
      console.error("Error al actualizar la solicitud:", error);
      toast.error("Ocurrió un error. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const aprobarBtn = dialogTexts.aprobarButton;
  return (
    <>
      <Toaster position="top-right" richColors />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{actionButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitudes ({solicitudes.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {solicitudes.map((sol) => {
              const isAprobada = aprobadas[sol.solicitud_id] ?? false;
              return (
                <div
                  key={sol.solicitud_id}
                  className="border-b pb-2 flex items-center justify-between"
                >
                  {/* Solicitud Info */}
                  <div>
                    <div className="font-semibold">{sol.tipo_solicitud}</div>
                    <div className="text-xs text-gray-500">
                      {sol.descripcion}
                    </div>
                    <Badge
                      className={badgeEstadoStyles({
                        color: solStateVariant[sol.estado_solicitud],
                      })}
                    >
                      {sol.estado_solicitud}
                    </Badge>
                  </div>
                  {/* Button Atender Solicitud */}
                  {requiresApproval(sol) && (
                    <Dialog
                      open={dialogAbierto === sol.solicitud_id}
                      onOpenChange={(o) =>
                        setDialogAbierto(o ? sol.solicitud_id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          disabled={isAprobada}
                          className={
                            isAprobada
                              ? "flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white font-medium transition-colors"
                              : "flex items-center gap-1 px-3 py-1 rounded border border-gray-200 text-[#23293B] font-medium bg-white hover:bg-gray-50 transition-colors"
                          }
                        >
                          <CheckCircle
                            className={
                              isAprobada
                                ? "w-4 h-4 text-white"
                                : "w-4 h-4 text-gray-400"
                            }
                            fill={isAprobada ? "currentColor" : "none"}
                          />
                          {isAprobada
                            ? aprobarBtn.aprobado
                            : aprobarBtn.porAprobar}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar aceptación</DialogTitle>
                          <div className="text-sm text-gray-500">
                            {aprobarBtn.ask}
                          </div>
                          <Textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => {
                              setComentario(e.target.value);
                            }}
                            className="min-h-[120px] mt-4"
                            placeholder={aprobarBtn.textArea.placeholder}
                          />
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            type="button"
                            className="px-3 py-1 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            onClick={() => setDialogAbierto(null)}
                            disabled={loading}
                          >
                            {aprobarBtn.cancel}
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1 rounded bg-green-600 text-white font-medium hover:bg-green-700"
                            onClick={() =>
                              handleAceptarSolicitud(
                                sol.solicitud_id,
                                comentario,
                              )
                            }
                            disabled={loading}
                          >
                            {aprobarBtn.confirm}
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const cardStyles = cva(
  "rounded-xl shadow-sm transition-colors cursor-pointer border",
  {
    variants: {
      color: {
        red: "bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300",
        green:
          "bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300",
        neutro: "hover:bg-gray-100 border-gray-200 hover:border-gray-300",
      },
    },
    defaultVariants: {
      color: "neutro",
    },
  },
);

export interface VariantCardProps
  extends React.ComponentPropsWithoutRef<typeof Card> {
  color?: VariantColor;
}

export const VariantCard = React.forwardRef<HTMLDivElement, VariantCardProps>(
  ({ color = "neutro", className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(cardStyles({ color }), className)}
        {...props}
      />
    );
  },
);

VariantCard.displayName = "VariantCard";

const iconBgStyles = cva("rounded-full p-3 flex items-center justify-center", {
  variants: {
    color: {
      green: "bg-green-200",
      red: "bg-red-200",
      neutro: "bg-gray-200",
    },
  },
  defaultVariants: {
    color: "neutro",
  },
});

const badgeEstadoStyles = cva(
  "inline-block mt-2 px-3 rounded text-xs font-medium",
  {
    variants: {
      color: {
        red: "bg-red-100 text-red-600",
        green: "bg-green-100 text-green-600",
        neutro: "bg-gray-100 text-gray-600",
      },
    },
    defaultVariants: {
      color: "neutro",
    },
  },
);

