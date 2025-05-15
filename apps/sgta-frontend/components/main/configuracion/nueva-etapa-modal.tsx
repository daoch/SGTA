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
import { Plus } from "lucide-react";

export function NuevaEtapaModal() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la nueva etapa
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nueva Etapa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Etapa</DialogTitle>
          <DialogDescription>
            Agregue una nueva etapa al proyecto de fin de carrera. Las etapas representan los cursos que componen el
            proyecto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la Etapa</Label>
              <Input id="nombre" placeholder="Ej: Proyecto de Fin de Carrera 1" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" placeholder="Descripción general de la etapa" rows={3} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="objetivos">Objetivos</Label>
              <Textarea id="objetivos" placeholder="Objetivos de la etapa" rows={4} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Etapa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
