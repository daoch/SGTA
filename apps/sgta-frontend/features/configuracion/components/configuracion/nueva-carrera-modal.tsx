"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface NuevaCarreraModalProps {
  isOpen: boolean
  onClose: () => void
}

// Unidades académicas disponibles
const unidadesAcademicas = [
  { id: 1, nombre: "Facultad de Ciencias e Ingeniería" },
  { id: 2, nombre: "Facultad de Ciencias Empresariales" },
];

export function NuevaCarreraModal({ isOpen, onClose }: NuevaCarreraModalProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    unidadAcademica: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para guardar la carrera
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Carrera</DialogTitle>
          <DialogDescription>Complete los campos para registrar una nueva carrera.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                name="codigo"
                placeholder="Ej: INF"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidadAcademica">Unidad Académica</Label>
              <Select
                value={formData.unidadAcademica}
                onValueChange={(value) => handleSelectChange("unidadAcademica", value)}
              >
                <SelectTrigger id="unidadAcademica">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesAcademicas.map((unidad) => (
                    <SelectItem key={unidad.id} value={unidad.id.toString()}>
                      {unidad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Ingeniería Informática"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Ej: Carrera de software y sistemas"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
              />
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
