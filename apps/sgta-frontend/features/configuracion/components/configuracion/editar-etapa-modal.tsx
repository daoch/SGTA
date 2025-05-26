"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { etapaFormativaCicloService } from "../../services/etapa-formativa-ciclo";
import { EtapaFormativaCiclo } from "../../types/etapa-formativa-ciclo";
import { toast } from "sonner";
import { SquarePen } from "lucide-react";

interface EditarEtapaModalProps {
  etapa: EtapaFormativaCiclo;
  onSuccess?: () => void;
}

export function EditarEtapaModal({ etapa, onSuccess }: EditarEtapaModalProps) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(etapa.nombreEtapaFormativa);
  const [creditaje, setCreditaje] = useState(etapa.creditajePorTema.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setNombre(etapa.nombreEtapaFormativa);
      setCreditaje(etapa.creditajePorTema.toString());
    }
  }, [open, etapa]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !creditaje) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      await etapaFormativaCicloService.update(
        etapa.etapaFormativaId,
        etapa.cicloId,
        {
          nombre: nombre,
          creditajePorTema: parseFloat(creditaje)
        }
      );
      
      toast.success("Etapa actualizada exitosamente");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar la etapa:", error);
      toast.error("Error al actualizar la etapa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="text-blue-500">
          <SquarePen size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Etapa</DialogTitle>
          <DialogDescription>
            Modifique los datos de la etapa formativa. Los cambios se verán reflejados inmediatamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la Etapa</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="creditaje">Creditaje por Tema</Label>
              <Input
                id="creditaje"
                type="number"
                step="0.01"
                value={creditaje}
                onChange={(e) => setCreditaje(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}