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
import { useToast } from "@/components/ui/use-toast";
import { etapasFormativasService } from "@/features/configuracion/services/etapas-formativas";
import { useState } from "react";

interface NuevaEtapaFormativaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Datos de ejemplo
const carreras = [
  { id: 1, nombre: "Ingeniería de Sistemas" },
  { id: 2, nombre: "Ingeniería Industrial" },
  { id: 3, nombre: "Administración" },
];

export function NuevaEtapaFormativaModal({ isOpen, onClose, onSuccess }: NuevaEtapaFormativaModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const formatDuracionToISO = (duracion: string): string => {
    // Convertir HH:MM:SS a formato ISO 8601 (PT[H]H[M]M[S]S)
    const parts = duracion.split(":");
    if (parts.length !== 3) return "PT0H";

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    let iso = "PT";
    if (hours > 0) iso += `${hours}H`;
    if (minutes > 0) iso += `${minutes}M`;
    if (seconds > 0) iso += `${seconds}S`;

    return iso;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Formatear los datos para la API
      const carreraId = parseInt(formData.carrera);
      const carreraNombre = carreras.find(c => c.id === carreraId)?.nombre || "";

      // Llamamos directamente al endpoint con axios usando el mismo formato
      const response = await etapasFormativasService.create({
        nombre: formData.nombre,
        carreraNombre: carreraNombre,
        carreraId: carreraId,
        creditajePorTema: parseFloat(formData.creditos),
        duracionExposicion: formatDuracionToISO(formData.duracionExposicion),
        activo: true,
        cicloActual: "",
        estadoActual: "EN_CURSO",
        historialCiclos: []
      });

      toast({
        title: "Etapa formativa creada",
        description: `Se ha creado correctamente la etapa: ${response.nombre}`,
      });

      // Cerrar el modal y limpiar el formulario
      onClose();
      setFormData({
        nombre: "",
        creditos: "",
        duracionExposicion: "00:20:00",
        carrera: "",
      });

      // Llamar a onSuccess si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al crear etapa formativa:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la etapa formativa. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
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
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
