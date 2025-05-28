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

export function NuevoContenidoModal({
  tipo = "entregable",
  conPeso = false,
}: {
  tipo?: "entregable" | "exposicion"
  conPeso?: boolean
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el nuevo contenido
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nuevo Contenido</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Contenido Esperado</DialogTitle>
          <DialogDescription>
            Agregue un nuevo contenido esperado para {tipo === "entregable" ? "el entregable" : "la exposición"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Contenido</Label>
              <Input id="nombre" placeholder="Ej: Introducción" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción Detallada</Label>
              <Textarea id="descripcion" placeholder="Descripción detallada del contenido esperado" rows={4} required />
            </div>
            {conPeso && (
              <div className="grid gap-2">
                <Label htmlFor="peso">Peso en la Calificación (puntos)</Label>
                <Input id="peso" type="number" min="0" max="20" placeholder="Ej: 5" required />
                <p className="text-xs text-gray-500">El total de puntos entre todos los contenidos debe sumar 20.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Contenido</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
