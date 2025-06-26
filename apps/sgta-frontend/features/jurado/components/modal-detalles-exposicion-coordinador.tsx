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
import { format } from "date-fns";
import { Label } from "@radix-ui/react-label";
import { ExposicionJurado } from "@/features/jurado/types/jurado.types";
import { useState, useEffect } from "react";

const ModalDetallesExposicionCoordinador: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exposicion: ExposicionJurado | null;
  handleGuardarGrabacion: (enlaceGrabacion: string) => void;
  saving: boolean;
}> = ({ open, onOpenChange, exposicion, handleGuardarGrabacion, saving }) => {
  const [grabacionInput, setGrabacionInput] = useState("");

  useEffect(() => {
    setGrabacionInput(exposicion?.enlace_grabacion ?? "");
  }, [exposicion]);

  useEffect(() => {
    if (!open) {
      setGrabacionInput("");
    }
  }, [open]);

  if (!exposicion) return null;

  const { miembros } = exposicion;

  const asesor = miembros.find((m) => m.tipo === "Asesor");
  const estudiantes = miembros.filter((m) => m.tipo === "Tesista");
  const jurados = miembros.filter((m) => m.tipo === "Jurado");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Exposición</DialogTitle>
          <div className="pt-4">
            <div className="gap-4 pb-4">
              <Label className="text-sm font-medium">Título del tema</Label>
              <Textarea
                value={exposicion.titulo}
                disabled
                className="bg-gray-50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4">
              <div>
                <Label className="text-sm font-medium">Curso</Label>
                <Textarea
                  value={exposicion.nombre_etapa_formativa}
                  disabled
                  className="bg-gray-50 resize-none h-8 min-h-0 py-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Exposicion</Label>
                <Textarea
                  value={exposicion.nombre_exposicion}
                  disabled
                  className="bg-gray-50 resize-none h-8 min-h-0 py-1"
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
                        <div className="text-sm font-medium">
                          Estudiante {index + 1}
                        </div>
                        <div className="text-sm text-gray-500 ">
                          {miembro.nombre}
                        </div>
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
                    <div className="text-sm font-medium">Asesor</div>
                    <div className="text-sm text-gray-500 ">
                      {asesor.nombre}
                    </div>
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
                        <div className="text-sm text-gray-500 ">
                          {jurado.nombre}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pb-4">
              <div>
                <Label className="text-sm font-medium">Fecha</Label>
                <Input
                  value={format(exposicion.fechahora, "dd/MM/yyyy")}
                  disabled
                  className="bg-gray-70"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Hora</Label>
                <Input
                  value={format(exposicion.fechahora, "HH:mm 'hrs'")}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Sala</Label>
                <Input
                  value={exposicion.sala}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/*ENLACES*/}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="enlace-exposicion"
                  className="text-sm font-medium block mb-2"
                >
                  Enlace de la Exposición
                </label>
                {exposicion.enlace_sesion ? (
                  <Button
                    id="enlace-exposicion"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      window.open(exposicion.enlace_sesion, "_blank")
                    }
                  >
                    Abrir enlace
                  </Button>
                ) : (
                  <span className="text-sm text-gray-500">No disponible</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="enlace-grabacion"
                  className="text-sm font-medium block mb-2"
                >
                  Enlace de la Grabación
                </label>
                <Input
                  id="enlace-grabacion"
                  value={grabacionInput}
                  onChange={(e) => setGrabacionInput(e.target.value)}
                  placeholder="Ingresa aquí el enlace de la grabación"
                  className="mb-2"
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="default"
            onClick={() => handleGuardarGrabacion(grabacionInput)}
            disabled={saving || !grabacionInput}
          >
            {saving ? "Guardando..." : "Guardar enlace"}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetallesExposicionCoordinador;
