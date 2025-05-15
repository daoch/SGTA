"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface NuevoCicloModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NuevoCicloModal({ isOpen, onClose }: NuevoCicloModalProps) {
  const [formData, setFormData] = useState({
    semestre: "",
    año: new Date().getFullYear(),
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Si el campo es año, asegurarse de que sea un número
    if (name === "año") {
      const numValue = Number.parseInt(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => {
          const newData = { ...prev, [name]: numValue };
          // Actualizar el nombre cuando cambia el año
          newData.nombre = `${numValue}-${prev.semestre}`;
          return newData;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSemestreChange = (value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, semestre: value };
      // Actualizar el nombre cuando cambia el semestre
      newData.nombre = `${prev.año}-${value}`;
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para guardar el ciclo
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Ciclo</DialogTitle>
          <DialogDescription>Complete los campos para registrar un nuevo ciclo académico.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre</Label>
                <Select value={formData.semestre} onValueChange={handleSemestreChange}>
                  <SelectTrigger id="semestre">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="año">Año</Label>
                <Input id="año" name="año" type="number" value={formData.año} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="2025-1"
                value={formData.nombre}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">El nombre se genera automáticamente a partir del año y semestre.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin</Label>
                <Input
                  id="fechaFin"
                  name="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  required
                />
              </div>
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
