"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from "lucide-react";
import { ListaTesisJuradoCard } from "./TesisCard";
import { MultiSelectCheckbox } from "./EspecialiadMultiSelect";
import { Jurado ,Tesis ,Especialidades, EspecialidadOption} from "@/features/jurado/types/juradoDetalle.types"; // Asegúrate de que la ruta sea correcta

interface ModalAsignarTesisProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (tesisSeleccionada: Tesis) => void;
  data: Tesis[];
  jurado: Jurado; // o el tipo completo si lo tienes
}

// Función auxiliar para convertir el enum a opciones para el MultiSelectCheckbox
const getEspecialidadOptions = (): EspecialidadOption[] => {
  // Filtrar "TODOS" para que no aparezca en las opciones de MultiSelect
  return Object.values(Especialidades)
    .filter(esp => esp !== Especialidades.TODOS)
    .map(especialidad => ({
      label: especialidad,
      value: especialidad
    }));
};


export const ModalAsignarTesis: React.FC<ModalAsignarTesisProps> = ({
  open,
  onClose,
  onAsignar,
  jurado,
  data,
}) => {
  const [search, setSearch] = useState("");
  //const [especialidad, setEspecialidad] = useState('')
  const [tesisSeleccionada, setTesisSeleccionada] = useState<Tesis | null>(null);
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] =
    useState<string[]>(jurado.specialties || []);

  const handleSelectCard = (tesis: Tesis) => {
    setTesisSeleccionada(tesis);
  };

  const filteredData = data.filter((t) => {
    const matchesSearch =
      t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      t.estudiante.toLowerCase().includes(search.toLowerCase()) ||
      t.codigo.toLowerCase().includes(search.toLowerCase());

    const matchesEspecialidad =
      especialidadesSeleccionadas.length === 0 ||
      t.especialidades?.some((esp: string) =>
        especialidadesSeleccionadas.includes(esp),
      );

    return matchesSearch && matchesEspecialidad;
  });

  useEffect(() => {
    setEspecialidadesSeleccionadas(jurado.specialties || []);
  }, [jurado]);

  // Texto para mostrar en el MultiSelect
  const getMultiSelectDisplayText = () => {
    const count = especialidadesSeleccionadas.length;
    if (count === 0) return "Seleccione áreas";
    return `${count} área${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-[811px] h-[496px] max-w-none !max-w-[100vw]">
        <DialogHeader>
          <DialogTitle>Asignar Tema de Proyecto</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div className="relative flex items-center w-[75%]">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Ingrese el título del tema de proyecto o nombre del estudiante"
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <MultiSelectCheckbox
            options={getEspecialidadOptions()}
            selected={especialidadesSeleccionadas}
            onChange={setEspecialidadesSeleccionadas}
            displayText={getMultiSelectDisplayText()}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          <ListaTesisJuradoCard
            data={filteredData}
            onSelect={handleSelectCard}
            selected={tesisSeleccionada}
          />
        </div>

        <DialogFooter className="absolute bottom-4 right-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              if (tesisSeleccionada) {
                try {
                  //llamada a la api

                  //if (response.ok) {
                  // const nuevaTesis = await response.json();
                  onAsignar(tesisSeleccionada); // Notifica al padre
                  onClose();
                  //} else {
                  //console.error('Error en la respuesta del servidor');
                  //}
                } catch (error) {
                  console.error("Error al asignar tesis:", error);
                }
              }
            }}
          >
            Asignar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
