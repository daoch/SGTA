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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { etapasFormativasService, type EtapaFormativaListItem } from "../../services/etapas-formativas";
import { ciclosService } from "../../services/etapa-formativa-ciclo";
import { Ciclo } from "../../types/etapa-formativa-ciclo";



export function NuevaEtapaModal() {
  const [open, setOpen] = useState(false);
  const [etapasFormativas, setEtapasFormativas] = useState<EtapaFormativaListItem[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [selectedEtapa, setSelectedEtapa] = useState<string>("");
  const [selectedCiclo, setSelectedCiclo] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etapasResponse, ciclosResponse] = await Promise.all([
          etapasFormativasService.getAll(),
          ciclosService.getAll()
        ]);
        setEtapasFormativas(etapasResponse);
        setCiclos(ciclosResponse);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la nueva etapa
    console.log({
      etapaFormativaId: selectedEtapa,
      cicloId: selectedCiclo
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nueva Etapa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Etapa</DialogTitle>
          <DialogDescription>
            Agregue una nueva etapa al proyecto de fin de carrera. Las etapas representan los cursos que componen el
            proyecto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="etapaFormativa">Etapa Formativa</Label>
              <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una etapa formativa" />
                </SelectTrigger>
                <SelectContent>
                  {etapasFormativas.map((etapa) => (
                    <SelectItem key={etapa.id} value={etapa.id.toString()}>
                      {etapa.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ciclo">Ciclo</Label>
              <Select value={selectedCiclo} onValueChange={setSelectedCiclo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un ciclo" />
                </SelectTrigger>
                <SelectContent>
                  {ciclos.map((ciclo) => (
                    <SelectItem key={ciclo.id} value={ciclo.id.toString()}>
                      {ciclo.anio} - {ciclo.semestre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Etapa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
