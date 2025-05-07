"use client";

import React from "react";
import { Controller, Control } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  { value: "esperando_respuesta", label: "Esperando Respuesta" },
  { value: "esperando_aprobacion", label: "Esperando Aprobacion" },
  { value: "programada", label: "Programada" },
  { value: "completada", label: "Completada" },
  { value: "finalizada", label: "Finalizada" },
];

interface Props {
  control: Control<{
    buscador: string;
    curso: string;
    periodo: string;
    estado: string;
  }>;
}

export const FilterExposicionJurado: React.FC<Props> = ({ control }) => {
  return (
    <div className="flex flex-wrap gap-4 pb-4 justify-between">
      {/* Buscador */}
      <div className="pt-4">
        <Label htmlFor="buscador" className="text-sm font-semibold">
          Buscar
        </Label>
        <Controller
          name="buscador"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Título o estudiante"
              className="w-[380px]"
            />
          )}
        />
      </div>

      {/* Curso */}
      <div className="pt-4">
        <Label htmlFor="curso" className="text-sm font-semibold">
          Curso
        </Label>
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

      {/* Periodo */}
      <div className="pt-4">
        <Label htmlFor="periodo" className="text-sm font-semibold">
          Período
        </Label>
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

      {/* Estado */}
      <div className="pt-4">
        <Label htmlFor="estado" className="text-sm font-semibold">
          Estado
        </Label>
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
  );
};
