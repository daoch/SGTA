"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExposicionCard } from "@/features/jurado/components/exposicion-card";

const periodos = [
  { value: "2025-1", label: "2025-1" },
  { value: "2024-2", label: "2024-2" },
  { value: "2024-1", label: "2024-1" },
  { value: "2023-2", label: "2023-2" },
];

const cursos = [
  { value: "PFC1", label: "Proyecto de Fin de Carrera 1" },
  { value: "PFC2", label: "Proyecto de Fin de Carrera 2" },
];

const estados = [
  { value: "todos", label: "Todos" },
  { value: "completado", label: "Completado" },
  { value: "pendiente", label: "Pendiente" },
];

const exposiciones = [
  {
    id_exposicion: 1,
    hora: "10:00",
    fecha: "2025-10-01",
    sala: "A201",
    estado: "Pendiente",
    titulo:
      "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
    miembros: [
      { id_docente: 1, nombre: "Juan Perez", tipo: "asesor" },
      { id_docente: 2, nombre: "Maria Lopez", tipo: "estudiante" },
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
    miembros: [
      { id_docente: 3, nombre: "Juan Perez", tipo: "asesor" },
      { id_docente: 4, nombre: "Maria Lopez", tipo: "estudiante" },
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
    miembros: [
      { id_docente: 5, nombre: "Juan Perez", tipo: "asesor" },
      { id_docente: 6, nombre: "Maria Lopez", tipo: "estudiante" },
    ],
  },
];

const Exposiciones: React.FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      curso: cursos[0].value,
      periodo: periodos[0].value,
      estado: estados[2].value,
      buscador: "",
    },
  });

  const estadoSeleccionado = watch("estado");
  const buscadorFiltrado = watch("buscador").toLowerCase();

  const filteredExposiciones = exposiciones.filter((exposicion) => {
    const matchesEstado =
      estadoSeleccionado === "todos" ||
      exposicion.estado.toLowerCase() === estadoSeleccionado.toLowerCase();

    const titulo = exposicion.titulo.toLowerCase();
    const nombresEstudiantes = exposicion.miembros
      .filter((m) => m.tipo === "estudiante")
      .map((m) => m.nombre.toLowerCase())
      .join(" ");

    const matchesBuscador =
      titulo.includes(buscadorFiltrado) ||
      nombresEstudiantes.includes(buscadorFiltrado);

    return matchesEstado && matchesBuscador;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 pb-4">
        {/*BUSCADOR*/}
        <div className="pt-4">
          <label htmlFor="buscador" className="text-sm font-semibold">
            Buscar
          </label>
          <Controller
            name="buscador"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ingrese el título del tema o el nombre del estudiante"
                className="w-[380px]"
              />
            )}
          />
        </div>

        {/*CURSO*/}
        <div className="pt-4">
          <label htmlFor="curso" className="text-sm font-semibold">
            Curso
          </label>
          <Controller
            name="curso"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cursos.map((curso) => (
                      <SelectItem key={curso.value} value={curso.value}>
                        {curso.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/*PERIODO*/}
        <div className="pt-4">
          <label htmlFor="periodo" className="text-sm font-semibold">
            Período
          </label>
          <Controller
            name="periodo"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
        </div>

        {/*ESTADO*/}
        <div className="pt-4">
          <label htmlFor="estado" className="text-sm font-semibold">
            Estado
          </label>
          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
        </div>
      </div>

      {/*EXPOSICIONES*/}
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
