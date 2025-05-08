"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Entregable } from "../../dtos/entregable";

interface EntregableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entregable: Entregable) => Promise<void>;
  entregable?: Entregable | null;
  mode: "create" | "edit";
}

export const EntregableModal: React.FC<EntregableModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entregable,
  mode,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<Entregable>({
    id: "",
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    esEvaluable: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del entregable cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && entregable) {
      setFormData({
        id: entregable.id,
        nombre: entregable.nombre,
        descripcion: entregable.descripcion,
        fechaInicio: entregable.fechaInicio,
        fechaFin: entregable.fechaFin,
        esEvaluable: entregable.esEvaluable,
      });
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        id: "",
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        esEvaluable: false,
      });
    }
  }, [entregable, isEditMode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      esEvaluable: value === "true",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // No limpiamos el formulario aquí, ya que useEffect se encargará de eso
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el entregable:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Entregable" : "Nuevo Entregable"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del entregable existente."
              : "Agregue un nuevo entregable a la etapa. Los entregables son documentos o archivos que los estudiantes deben presentar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Entregable</Label>
              <Input
                id="txtNombreEntregable"
                name="nombre"
                placeholder="Ej: Propuesta de Proyecto"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fechaInicio">Fecha y Hora de Inicio</Label>
              <Input
                id="txtFechaInicio"
                name="fechaInicio"
                type="datetime-local"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
              <Input
                id="txtFechaFin"
                name="fechaFin"
                type="datetime-local"
                value={formData.fechaFin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="txtDescripcion"
                name="descripcion"
                placeholder="Descripción general del entregable"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>¿Es evaluable?</Label>
              <RadioGroup
                id="radioEsEvaluable"
                value={formData.esEvaluable.toString()}
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="radioSi" />
                  <Label htmlFor="radioSi">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="radioNo" />
                  <Label htmlFor="radioNo">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              id="btnCancel"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              id="btnSave"
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Guardando..."
                  : "Creando..."
                : isEditMode
                ? "Guardar Cambios"
                : "Crear Entregable"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
