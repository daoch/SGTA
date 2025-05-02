"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { ExposicionCard } from "@/features/alumno/components/exposicion-card";
import React from "react";
import { useState } from "react";

//periodos: 2025-1, 2025-2, 2026-1, 2026-2
//atributos: id_ciclo, semestre, anio
const periodos = [
  { value: "2025-1", label: "2025-1" },
  { value: "2024-2", label: "2024-2" },
  { value: "2024-1", label: "2024-1" },
  { value: "2023-2", label: "2023-2" },
];

//estado: todos, completado, pendiente
const estados = [
  { value: "todos", label: "Todos" },
  { value: "completado", label: "Completado" },
  { value: "pendiente", label: "Pendiente" },
];

//exposiciones:
const exposiciones = [
  {
    id_exposicion: 1,
    hora: "10:00",
    fecha: "2025-10-01",
    sala: "A201",
    estado: "Pendiente",
    titulo:
      "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
    miembros_jurado: [
      {
        id_docente: 1,
        nombre: "Juan Perez",
        tipo: "asesor",
      },
      {
        id_docente: 3,
        nombre: "Maria Lopez",
        tipo: "miembro",
      },
      {
        id_docente: 4,
        nombre: "Luis Muroya",
        tipo: "miembro",
      },
    ],
  },
  {
    id_exposicion: 2,
    hora: "10:00",
    fecha: "2025-10-01",
    sala: "A201",
    estado: "Completado",
    titulo:
      "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
    miembros_jurado: [
      {
        id_docente: 1,
        nombre: "Juan Perez",
        tipo: "asesor",
      },
      {
        id_docente: 2,
        nombre: "Maria Lopez",
        tipo: "miembro",
      },
      {
        id_docente: 3,
        nombre: "Luis Muroya",
        tipo: "miembro",
      },
    ],
  },
  {
    id_exposicion: 3,
    hora: "10:00",
    fecha: "2025-10-01",
    sala: "A201",
    estado: "Pendiente",
    titulo:
      "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
    miembros_jurado: [
      {
        id_docente: 1,
        nombre: "Juan Perez",
        tipo: "asesor",
      },
      {
        id_docente: 2,
        nombre: "Maria Lopez",
        tipo: "miembro",
      },
      {
        id_docente: 3,
        nombre: "Luis Muroya",
        tipo: "miembro",
      },
    ],
  },
];

const Exposiciones: React.FC = () => {
  const [selectedPeriodo, setSelectedPeriodo] = useState(periodos[0].value);
  const [selectedEstado, setSelectedEstado] = useState(estados[2].value);

  const filteredExposiciones = exposiciones.filter((exposicion) => {
    if (selectedEstado === "todos") return true;
    return exposicion.estado.toLowerCase() === selectedEstado.toLowerCase();
  });

  return (
    <div>
      <div className="flex gap-4 pb-4">
        {/*PERIODO*/}
        <div className="pt-4">
          <label htmlFor="periodo" className="text-sm font-semibold">
            Período
          </label>
          <Select
            defaultValue={selectedPeriodo}
            onValueChange={setSelectedPeriodo}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {periodos.map((periodo) => (
                  <SelectItem key={periodo.value} value={periodo.value}>
                    {periodo.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/*ESTADO*/}
        <div className="pt-4">
          <label htmlFor="estado" className="text-sm font-semibold">
            Estado
          </label>
          <Select
            defaultValue={selectedEstado}
            onValueChange={setSelectedEstado}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {estados.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/*TABLA DE EXPOSICIONES*/}
      <div className="space-y-4">
        {filteredExposiciones.map((exposicion) => (
          <ExposicionCard
            key={exposicion.id_exposicion}
            exposicion={exposicion}
          />
        ))}
      </div>
    </div>
  );
};

export default Exposiciones;

