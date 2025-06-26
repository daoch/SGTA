"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Controller, Control, useForm } from "react-hook-form";
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
import { AreaEspecialidad, TipoDedicacion } from "../types/jurado.types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  EtapaFormativa,
  Ciclo,
} from "@/features/jurado/types/juradoDetalle.types";
import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  getCiclos,
  getEtapasFormativasNombres,
  getEtapaFormativaId
} from "../services/jurado-service";

const estados = [
  { value: "todos", label: "Todos" },
  { value: "esperando_respuesta", label: "Esperando Respuesta" },
  { value: "esperando_aprobación", label: "Esperando Aprobación" },
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

export const FilterExposicionJurado: React.FC<Props> = ({
  control,
  onSearch,
}) => {
  const [etapasFormativas, setEtapasFormativas] = useState<EtapaFormativa[]>(
    [],
  );
  const [selectedEtapaFormativa, setSelectedEtapaFormativa] =
    useState<string>("TODOS");
  useEffect(() => {
    const fetchEtapasFormativas = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        console.log("ID Token del filtro:", idToken);
        const etapasFormativas = await getEtapaFormativaId(idToken!);
        setEtapasFormativas(etapasFormativas);
      } catch (error) {
        console.error("Error fetching etapas formativas:", error);
      }
    };
    fetchEtapasFormativas();
  }, []);

  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<string>("TODOS");
  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const ciclos = await getCiclos();
        setCiclos(ciclos);
        if (ciclos.length > 0) {
          const primerValor = `${ciclos[0].anio}-${ciclos[0].semestre}`;
          setSelectedCiclo(primerValor);
        }
      } catch (error) {
        console.error("Error fetching ciclos:", error);
      }
    };
    fetchCiclos();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 pb-4 items-end">
      {/* Buscador */}
      <div>
        <Label htmlFor="buscador" className="leading-none font-semibold mb-2">
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
        <Label htmlFor="curso" className="leading-none font-semibold mb-2">
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
                  <SelectItem key={etapa.etapaFormativaId} value={etapa.nombre}>
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
        <Label htmlFor="periodo" className="leading-none font-semibold mb-2">
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
        <Label htmlFor="estado" className="leading-none font-semibold mb-2">
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
