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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface NuevaEtapaFormativaModalProps {
  isOpen: boolean
  onClose: () => void
}

// Datos de ejemplo
const carreras = [
  { id: 1, nombre: "Ingeniería de Sistemas" },
  { id: 2, nombre: "Ingeniería Industrial" },
  { id: 3, nombre: "Administración" },
];

export function NuevaEtapaFormativaModal({ isOpen, onClose }: NuevaEtapaFormativaModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    creditos: "",
    duracionExposicion: "00:20:00",
    carrera: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para guardar la etapa formativa
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Etapa Formativa</DialogTitle>
          <DialogDescription>Complete los campos para registrar una nueva etapa formativa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Proyecto de Tesis 1"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditos">Créditos</Label>
                <Input
                  id="creditos"
                  name="creditos"
                  type="number"
                  step="0.1"
                  placeholder="Ej: 4.0"
                  value={formData.creditos}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracionExposicion">Duración Exposición</Label>
                <Input
                  id="duracionExposicion"
                  name="duracionExposicion"
                  placeholder="HH:MM:SS"
                  value={formData.duracionExposicion}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500">Formato: HH:MM:SS</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Select value={formData.carrera} onValueChange={(value) => handleSelectChange("carrera", value)}>
                <SelectTrigger id="carrera">
                  <SelectValue placeholder="Seleccionar carrera" />
                </SelectTrigger>
                <SelectContent>
                  {carreras.map((carrera) => (
                    <SelectItem key={carrera.id} value={carrera.id.toString()}>
                      {carrera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
