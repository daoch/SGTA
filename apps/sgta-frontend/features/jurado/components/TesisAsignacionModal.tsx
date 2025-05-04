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
import { Jurado } from "@/features/jurado/types/juradoDetalle.types"; // Asegúrate de que la ruta sea correcta

interface ModalAsignarTesisProps {
  open: boolean;
  onClose: () => void;
  onAsignar: (tesisSeleccionada: any) => void;
  data: any[];
  jurado: Jurado; // o el tipo completo si lo tienes
}

export const ModalAsignarTesis: React.FC<ModalAsignarTesisProps> = ({
  open,
  onClose,
  onAsignar,
  jurado,
  data,
}) => {
  const [search, setSearch] = useState("");
  //const [especialidad, setEspecialidad] = useState('')
  const [tesisSeleccionada, setTesisSeleccionada] = useState<any | null>(null);
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] =
    useState<string[]>(jurado.specialties || []);

  const handleSelectCard = (tesis: any) => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-[811px] h-[496px] max-w-none !max-w-[100vw]">
        <DialogHeader>
          <DialogTitle>Asignar Tema de Proyecto</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Ingrese el título del tema de proyecto o nombre del estudiante"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <MultiSelectCheckbox
            options={[
              {
                label: "Ingeniería de Software",
                value: "Ingeniería de Software",
              },
              {
                label: "Ciencias de la Computación",
                value: "Ciencias de la Computación",
              },
              {
                label: "Tecnologias de la informacion",
                value: "Tecnologias de la informacion",
              },
              { label: "Vision Computacional", value: "Vision Computacional" },
              {
                label: "Sistemas de Informacion",
                value: "Sistemas de Informacion",
              },
            ]}
            selected={especialidadesSeleccionadas}
            onChange={setEspecialidadesSeleccionadas}
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
