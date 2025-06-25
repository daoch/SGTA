"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { Exposicion } from "../types/exposicion.types";
import { format } from "date-fns";
import { Label } from "@radix-ui/react-label";
import {
  ExposicionJurado,
  MiembroJuradoExpo,
} from "@/features/jurado/types/jurado.types";

const ModalDetallesExposicion: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exposicion: ExposicionJurado | null;
}> = ({ open, onOpenChange, exposicion }) => {
  if (!exposicion) return null;

  const { miembros } = exposicion;

  const asesor = miembros.find((m) => m.tipo === "Asesor");
  const estudiantes = miembros.filter((m) => m.tipo === "Tesista");
  const jurados = miembros.filter((m) => m.tipo === "Jurado");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="leading-none font-semibold">Detalles de la Exposición</DialogTitle>
          <div className="pt-4">
            <div className="gap-4 pb-4">
              <Label className="text-[15px] leading-none font-semibold">
                Título del tema
              </Label>
              <Textarea
                value={exposicion.titulo }
                disabled
                className="text-muted-foreground text-sm "
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4">
              <div>
                <Label className="text-[15px] leading-none font-semibold">Curso</Label>
                <Textarea
                  value={exposicion.nombre_etapa_formativa}
                  disabled
                  className="text-muted-foreground text-sm h-8 min-h-0 resize-none py-1"
                />
              </div>
              <div>
                <Label className="text-[15px] leading-none font-semibold">Exposición</Label>
                <Textarea
                  value={ exposicion.nombre_exposicion}
                  disabled
                  className="text-muted-foreground text-sm h-8 min-h-0 resize-none py-1"
                />

              </div>
              
            </div>

            {estudiantes.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pb-4">
                {estudiantes.map((miembro, index) => (
                  <div key={miembro.id_persona}>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-1 rounded-full">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[14px] leading-none font-semibold">
                          Estudiante {index + 1}
                        </div>
                        <div className="text-muted-foreground text-[13px] ">{miembro.nombre}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {asesor && (
              <div className="gap-4 pb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-[14px] leading-none font-semibold">
                      Asesor
                    </div>
                    <div className="text-muted-foreground text-[13px] ">{asesor.nombre}</div>
                  </div>
                </div>
              </div>
            )}

            {jurados.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pb-4">
                {jurados.map((jurado, index) => (
                  <div key={jurado.id_persona}>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-1 rounded-full">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <div className="text-[14px] leading-none font-semibold">
                          Jurado {index + 1}
                        </div>
                        <div className="text-muted-foreground text-[13px]">{jurado.nombre}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pb-4">
              <div>
                <Label className="text-[15px] leading-none font-semibold">
                  Fecha
                </Label>
                <Input
                  value={format(exposicion.fechahora, "dd/MM/yyyy")}
                  disabled
                  className="text-muted-foreground !text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[15px] leading-none font-semibold">
                  Hora
                </Label>
                <Input
                  value={format(exposicion.fechahora, "HH:mm 'hrs'")}
                  disabled
                  className="text-muted-foreground !text-[13px]"
                />
              </div>
              <div>
                <Label className="text-[15px] leading-none font-semibold">
                  Sala
                </Label>
                <Input
                  value={exposicion.sala}
                  disabled
                  className="text-muted-foreground !text-[13px]"
                />
              </div>
            </div>

            {/*ENLACES*/}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[15px] leading-none font-semibold">
                    Enlace de la Exposición
                  </label>
                 {exposicion.enlace_sesion ? (
                  <Button
                   // variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(exposicion.enlace_sesion, "_blank")}
                  >
                    Abrir enlace
                  </Button>
                ) : (
                  <div className="text-sm text-gray-500">No disponible</div>
                )}
                </div>
                <div>
                  <label className="text-[15px] leading-none font-semibold">
                    Enlace de la Grabación
                  </label>
                  {exposicion.enlace_grabacion ? (
                    <Button
                     // variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(exposicion.enlace_grabacion, "_blank")}
                    >
                      Abrir grabación
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500">No disponible</div>
                  )}
                </div>
              </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetallesExposicion;
