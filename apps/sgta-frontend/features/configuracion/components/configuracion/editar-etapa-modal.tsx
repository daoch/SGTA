"use client";
import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [estado, setEstado] = useState<"En Curso" | "Finalizado">(
    etapa.estado || "En Curso"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) setEstado(etapa.estado);
  }, [open, etapa.estado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await etapaFormativaCicloService.actualizarEstado(etapa.id, estado);
      toast.success("Estado actualizado");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar");
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
          <DialogTitle>Editar Estado</DialogTitle>
          <DialogDescription>
            Seleccione el nuevo estado
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Estado</Label>


              <Select
                value={estado}
                onValueChange={(value: "En Curso" | "Finalizado") => setEstado(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En Curso">En Curso</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>



            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}