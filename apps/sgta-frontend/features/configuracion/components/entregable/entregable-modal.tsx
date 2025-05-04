"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Entregable } from "../../types/entregable";

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
    titulo: "",
    fecha: "",
    hora: "",
    descripcion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del entregable cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && entregable) {
      setFormData({
        id: entregable.id,
        titulo: entregable.titulo,
        fecha: entregable.fecha,
        hora: entregable.hora,
        descripcion: entregable.descripcion,
      });
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        titulo: "",
        fecha: "",
        hora: "",
        descripcion: "",
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

  // Formatear fecha para el input date (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    // Si la fecha está en formato DD/MM/YYYY
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return dateString;
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
              <Label htmlFor="titulo">Nombre del Entregable</Label>
              <Input
                id="txtNombreEntregable"
                name="titulo"
                placeholder="Ej: Propuesta de Proyecto"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fecha">Fecha límite</Label>
              <Input
                id="txtFechaLimite"
                name="fecha"
                type="date"
                value={formatDateForInput(formData.fecha)}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hora">Hora límite</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="txtHoraLimite"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
