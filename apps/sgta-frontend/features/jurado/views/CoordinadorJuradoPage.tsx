"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TipoDedicacion,
  Especialidades,
  EstadoJurado,
  JuradoViewModel,
} from "@/features/jurado/types/juradoDetalle.types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableJurados from "../components/JuradosTable";

// Función auxiliar para generar opciones del Select de especialidades
const getSelectEspecialidadesItems = () => {
  return Object.values(Especialidades).map((especialidad) => (
    <SelectItem key={especialidad} value={especialidad}>
      {especialidad}
    </SelectItem>
  ));
};

const JuradosView = () => {
  const juradosOriginal = [
    {
      user: { name: "Juan Pérez", avatar: "https://github.com/daoch.png" },
      code: "12345",
      email: "juan.perez@mail.com",
      dedication: "Tiempo Completo",
      assigned: "5",
      specialties: ["Desarrollo Web", "Backend"],
      status: "Activo",
    },
    {
      user: { name: "Ana Gómez", avatar: "https://github.com/daoch.png" },
      code: "67890",
      email: "ana.gomez@mail.com",
      dedication: "Medio Tiempo",
      assigned: "3",
      specialties: ["Front-End", "UI/UX"],
      status: "Inactivo",
    },
    // Agregar más jurados según sea necesario
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [juradosData, setJuradosData] =
    useState<JuradoViewModel[]>(juradosOriginal);
  const [dedication, setDedication] = useState<TipoDedicacion>(
    TipoDedicacion.TODOS,
  );
  const [specialty, setSpecialty] = useState<Especialidades>(
    Especialidades.TODOS,
  );
  const [status, setStatus] = useState<EstadoJurado>(EstadoJurado.TODOS);
  const [hasSearched, setHasSearched] = useState(false);

  // 1) Filtrado automático al cambiar combobox
  useEffect(() => {
    setJuradosData(() => {
      return juradosOriginal.filter((j) => {
        const matchDedication =
          dedication === TipoDedicacion.TODOS || j.dedication === dedication;
        const matchSpecialty =
          specialty === Especialidades.TODOS ||
          j.specialties.includes(specialty);
        const matchStatus =
          status === EstadoJurado.TODOS || j.status === status;
        // Solo aplicamos búsqueda si ya se buscó alguna vez
        const matchSearch =
          !hasSearched ||
          j.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.code.includes(searchTerm) ||
          j.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchDedication && matchSpecialty && matchStatus && matchSearch;
      });
    });
  }, [dedication, specialty, status, searchTerm, hasSearched]);

  const handleSearch = () => {
    setJuradosData(() => {
      return juradosOriginal.filter((j) => {
        const matchSearch =
          j.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.code.includes(searchTerm) ||
          j.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchSearch;
      });
    });
  };

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] pl-[20px] items-center gap-[10px] self-stretch">
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Miembros de Jurado
        </h1>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Input de búsqueda */}
        <Input
          placeholder="Ingrese el nombre, código o correo electrónico del usuario"
          className="flex w-[447px] h-[44px] px-3 py-2 items-center gap-2 border border-[#E2E6F0] rounded-none bg-background resize-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Button
          className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
          onClick={handleSearch} // Llama a la función de búsqueda al hacer clic
        >
          Buscar
        </Button>

        {/* ComboBox 1 - Tipo de Dedicación */}
        <div className="flex flex-col w-[130px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Tipo de Dedicación</label>
          <Select onValueChange={(val) => setDedication(val as TipoDedicacion)}>
            <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md !important">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Tiempo Completo">Tiempo Completo</SelectItem>
              <SelectItem value="Medio Tiempo">Medio Tiempo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ComboBox 2 - Área de Especialidad */}
        <div className="flex flex-col w-[148px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Área de Especialidad</label>
          <Select onValueChange={(val) => setSpecialty(val as Especialidades)}>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {/* Generacion dinamica segun el Types de especialidades */}
              {getSelectEspecialidadesItems()}
            </SelectContent>
          </Select>
        </div>

        {/* ComboBox 3 - Estado */}
        <div className="flex flex-col w-[107px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Estado</label>
          <Select onValueChange={(val) => setStatus(val as EstadoJurado)}>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón de Crear Jurado */}
        <Button className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white">
          + Nuevo Jurado
        </Button>
      </div>

      {/* Llamada al componente de Tabla */}
      <TableJurados juradosData={juradosData} />
    </div>
  );
};

export default JuradosView;
