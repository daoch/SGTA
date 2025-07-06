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
import { carreraService, Carrera, unidadAcademicaService, UnidadAcademica } from "../../services/carrera-service";
import { CarreraCreateDto } from "../../dtos/carrera";
import { useEffect } from "react";

interface NuevaCarreraModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Unidades académicas disponibles


export function NuevaCarreraModal({ isOpen, onClose, onSuccess }: NuevaCarreraModalProps) {

  const [unidadesAcademicas, setUnidadesAcademicas] = useState<UnidadAcademica[]>([]);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    unidadAcademicaId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    
    try {
      const carreraData: Omit<Carrera, "id"> = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        unidadAcademicaId: parseInt(formData.unidadAcademicaId),
        activo: true
      };
      
      await carreraService.create(carreraData);
      console.log("Carrera creada exitosamente");
      onClose();
      // Reset form
      setFormData({
        codigo: "",
        nombre: "",
        descripcion: "",
        unidadAcademicaId: "",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al crear la carrera:", error);
    }
  };

  useEffect(() => {
    unidadAcademicaService.getAll().then((unidades) => {
      setUnidadesAcademicas(unidades);
    });
  }, []);

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
                value={formData.unidadAcademicaId}
                onValueChange={(value) => handleSelectChange("unidadAcademicaId", value)}
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
