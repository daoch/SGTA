"use client";

import type React from "react";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

export function NuevaExposicionModal({ etapaId }: { etapaId: string }) {
  const [open, setOpen] = useState(false);
  const [conJurados, setConJurados] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la nueva exposición
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nueva Exposición</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Exposición</DialogTitle>
          <DialogDescription>
            Agregue una nueva exposición a la etapa. Las exposiciones son presentaciones que los estudiantes deben
            realizar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la Exposición</Label>
              <Input id="nombre" placeholder="Ej: Exposición de Avance 1" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio">Fecha de inicio</Label>
                <Input id="fechaInicio" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fechaFin">Fecha de fin</Label>
                <Input id="fechaFin" type="date" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" placeholder="Descripción general de la exposición" rows={3} required />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="presencial" className="cursor-pointer">
                Exposición Presencial
              </Label>
              <Switch id="presencial" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="jurados" className="cursor-pointer">
                Con Jurados
              </Label>
              <Switch id="jurados" checked={conJurados} onCheckedChange={setConJurados} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Exposición</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
