"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { ExposicionCard } from "@/features/jurado/components/alumno-exposicion-card";
import React, { useEffect } from "react";
import { useState } from "react";
import { Ciclo } from "../../types/juradoDetalle.types";
import {
  getCiclos,
  getExposicionesEstudiantesByEstudianteId,
} from "../../services/exposicion-service";
import { ExposicionAlumno } from "../../types/exposicion.types";
import { useAuthStore } from "@/features/auth/store/auth-store";

const Exposiciones: React.FC = () => {
  //JALAMOS LOS CICLOS
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<string>("TODOS");

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

  //ESTADOS DE EXPOSICION
  const estados = [
    { value: "todos", label: "Todos" },
    { value: "programada", label: "Programada" },
    { value: "completada", label: "Completada" },
    { value: "calificada", label: "Calificada" },
  ];
  const [selectedEstado, setSelectedEstado] = useState(estados[0].value);

  const [isLoading, setIsLoading] = useState(true);
  const [exposiciones, setExposiciones] = useState<ExposicionAlumno[]>([]);

  //JALAMOS LAS EXPOSICIONES DEL ALUMNO
  const fetchExposiciones = async () => {
    setIsLoading(true);
    try {
      //se debe reemplazar el 21 por el id del jurado logueado
      const { idToken } = useAuthStore.getState();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }
      const exposicionesData =
        await getExposicionesEstudiantesByEstudianteId(idToken);
      setExposiciones(exposicionesData);
    } catch (error) {
      console.error("Error al cargar exposiciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExposiciones();
    fetchCiclos();
  }, []);

  const filteredExposiciones = exposiciones.filter((exposicion) => {
    const coincideEstado =
      selectedEstado === "todos" ||
      exposicion.estado.toLowerCase() === selectedEstado.toLowerCase();
    const coincideCiclo =
      selectedCiclo === "TODOS" || exposicion.ciclo === selectedCiclo;
    return coincideEstado && coincideCiclo;
  });

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Mis Exposiciones
        </h1>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        {/*CICLO*/}
        <div className="flex flex-col w-[104px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-m font-semibold">Periodo</label>
          <Select
            value={selectedCiclo}
            onValueChange={(val) => setSelectedCiclo(val)}
          >
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
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
        </div>

        {/*ESTADO*/}
        <div className="flex flex-col w-[150px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-m font-semibold">Estado</label>
          <Select
            defaultValue={selectedEstado}
            onValueChange={setSelectedEstado}
          >
            <SelectTrigger className="h-[150px] w-full">
              <SelectValue />
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
      {isLoading ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 animate-pulse">
            Cargando exposiciones del alumno...
          </p>
        </div>
      ) : filteredExposiciones.length === 0 ? (
        <div className="text-center text-gray-400 mt-5">
          <p>No hay exposiciones que coincidan con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExposiciones.map((exposicion, index) => (
            <ExposicionCard
              key={`${exposicion.exposicionId}-${index}`}
              exposicion={exposicion}
              alumnoId={exposicion.estudianteId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Exposiciones;
