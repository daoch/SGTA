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

const ModalDetallesExposicion: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exposicion: Exposicion | null;
}> = ({ open, onOpenChange, exposicion }) => {
  if (!exposicion) return null;

  const { miembros } = exposicion;

  const asesor = miembros.find((m) => m.tipo === "asesor");
  const estudiantes = miembros.filter((m) => m.tipo === "estudiante");
  const jurados = miembros.filter((m) => m.tipo === "jurado");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Exposición</DialogTitle>
          <div className="pt-4">
            <div className="gap-4 pb-4">
              <Label className="text-sm font-medium text-gray-500">
                Título del tema
              </Label>
              <Textarea
                value={exposicion.titulo}
                disabled
                className="bg-gray-50 resize-none"
              />
            </div>

            <div className="gap-4 pb-4">
              <Label className="text-sm font-medium text-gray-500">Curso</Label>
              <Textarea
                value={exposicion.titulo}
                disabled
                className="bg-gray-50 resize-none"
              />
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
                        <div className="text-sm font-medium text-gray-800">
                          Estudiante {index + 1}
                        </div>
                        <div className="text-sm">{miembro.nombre}</div>
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
                    <div className="text-sm font-medium text-gray-800">
                      Asesor
                    </div>
                    <div className="text-sm">{asesor.nombre}</div>
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
                        <div className="text-sm font-medium text-gray-800">
                          Jurado {index + 1}
                        </div>
                        <div className="text-sm">{jurado.nombre}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 pb-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Fecha
                </Label>
                <Input
                  value={format(exposicion.fechaHora, "dd/MM/yyyy")}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Hora
                </Label>
                <Input
                  value={format(exposicion.fechaHora, "HH:mm 'hrs'")}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Sala
                </Label>
                <Input
                  value={exposicion.sala}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetallesExposicion;
