"use client";

import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { ActualizarCicloDto, CicloEtapas, CrearCicloDto } from "@/features/administrador/types/ciclo.type";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface EditarCicloModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActualizar: (id: number, formData: CrearCicloDto) => Promise<ActualizarCicloDto>;
  ciclo: CicloEtapas | null;
}

export function EditarCicloModal({ isOpen, onClose, onActualizar, ciclo }: EditarCicloModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formData, setFormData] = useState({
    semestre: "",
    anio: new Date().getFullYear(),
    fechaInicio: "",
    fechaFin: ""
  });

  // Cargar datos del ciclo cuando se abre el modal
  useEffect(() => {
    if (ciclo && isOpen) {
      setFormData({
        semestre: ciclo.semestre,
        anio: ciclo.anio,
        fechaInicio: ciclo.fechaInicio,
        fechaFin: ciclo.fechaFin
      });
    }
  }, [ciclo, isOpen]);

  // Limpiar el formulario al cerrar el modal
  const handleClose = () => {
    setShowConfirm(false);
    setAlert(null);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "anio") {
      const numValue = Number.parseInt(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSemestreChange = (value: string) => {
    setFormData((prev) => ({ ...prev, semestre: value }));
  };

  // Mostrar confirmación personalizada
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // Si el usuario confirma, guardar
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    if (!ciclo) return;
    
    try {
      await onActualizar(ciclo.id, formData);
      setAlert({
        type: "success",
        message: "El ciclo se actualizó correctamente.",
      });
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar ciclo:", error);
      setAlert({
        type: "error",
        message: "Hubo un error al actualizar el ciclo. Por favor, inténtalo de nuevo.",
      });
    }
  };

  if (!ciclo) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Ciclo</DialogTitle>
            <DialogDescription>
              Modifica los datos del ciclo académico.
            </DialogDescription>
          </DialogHeader>

          {alert && (
            <Alert className={alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {alert.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
                {alert.type === "success" ? "¡Éxito!" : "Error"}
              </AlertTitle>
              <AlertDescription className={alert.type === "success" ? "text-green-700" : "text-red-700"}>
                {alert.message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semestre">Semestre</Label>
                <Select value={formData.semestre} onValueChange={handleSemestreChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="anio">Año</Label>
                <Input
                  id="anio"
                  name="anio"
                  type="number"
                  value={formData.anio}
                  onChange={handleChange}
                  required
                  min={2020}
                  max={2030}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
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

              <div>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!!alert}>
                Actualizar Ciclo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar actualización?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas actualizar este ciclo? Los cambios se aplicarán inmediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
