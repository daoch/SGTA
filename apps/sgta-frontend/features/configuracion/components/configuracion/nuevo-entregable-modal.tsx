"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";

export function NuevoEntregableModal({ etapaId }: { etapaId: string }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el nuevo entregable
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nuevo Entregable</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Entregable</DialogTitle>
          <DialogDescription>
            Agregue un nuevo entregable a la etapa. Los entregables son
            documentos o archivos que los estudiantes deben presentar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Entregable</Label>
              <Input
                id="nombre"
                placeholder="Ej: Propuesta de Proyecto"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fecha">Fecha límite</Label>
              <Input id="fecha" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hora">Hora límite</Label>
              <Input id="hora" type="time" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción general del entregable"
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Entregable</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
