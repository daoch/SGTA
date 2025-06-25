"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Ciclo } from "@/features/jurado/types/juradoDetalle.types";

import { getCiclos } from "../services/jurado-service";
import { getCursosByCoordinador } from "../services/exposicion-service";
import { EtapaFormativaCoordinador } from "../dtos/EtapaFormativaCoordinador";

const estados = [
  { value: "todos", label: "Todos" },
  { value: "programada", label: "Programada" },
  { value: "completada", label: "Completada" },
  { value: "calificada", label: "Calificada" },
];

interface Props {
  control: Control<FormValues>;
  onSearch?: () => void;
}

interface FormValues {
  buscador: string;
  curso: string;
  periodo: string;
  estado: string;
}

export const FilterExposicionCoordinador: React.FC<Props> = ({
  control,
  onSearch,
}) => {
  const [etapasFormativas, setEtapasFormativas] = useState<
    EtapaFormativaCoordinador[]
  >([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);

  useEffect(() => {
    const fetchEtapasFormativas = async () => {
      try {
        const etapasFormativas = await getCursosByCoordinador();
        setEtapasFormativas(etapasFormativas);
      } catch (error) {
        console.error("Error fetching etapas formativas:", error);
      }
    };
    fetchEtapasFormativas();
  }, []);

  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const ciclos = await getCiclos();
        setCiclos(ciclos);
      } catch (error) {
        console.error("Error fetching ciclos:", error);
      }
    };
    fetchCiclos();
  }, []);

  useEffect(() => {
    console.log("Etapas Formativas:", etapasFormativas);
    console.log("Ciclos:", ciclos);
    console.log("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  }, [ciclos, etapasFormativas]);

  return (
    <div className="flex flex-wrap gap-4 pb-4 items-end">
      {/* Buscador */}
      <div>
        <Label htmlFor="buscador" className="text-sm font-semibold block mb-2">
          Buscar
        </Label>
        <div className="flex items-center gap-3">
          <Controller
            name="buscador"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Ingrese el título del tema proyecto o el nombre del estudiante"
                className="w-[450px] "
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onSearch) {
                    e.preventDefault(); // Prevenir el comportamiento por defecto del Enter
                    onSearch();
                  }
                }}
              />
            )}
          />
          <Button
            type="button"
            onClick={onSearch}
            className="h-10 bg-[#042354] text-white px-4 "
          >
            Buscar
          </Button>
        </div>
      </div>

      {/* Curso */}
      <div>
        <Label htmlFor="curso" className="text-sm font-semibold mb-2">
          Curso
        </Label>
        <Controller
          name="curso"
          control={control}
          defaultValue="TODOS"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                {etapasFormativas.map((etapa) => (
                  <SelectItem key={etapa.id} value={etapa.nombre}>
                    {etapa.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Periodo */}
      <div>
        <Label htmlFor="periodo" className="text-sm font-semibold block mb-2">
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
                {ciclos.map((ciclo) => {
                  const value = `${ciclo.anio}-${ciclo.semestre}`;
                  return (
                    <SelectItem key={ciclo.id} value={value}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Estado */}
      <div>
        <Label htmlFor="estado" className="text-sm font-semibold block mb-2">
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
