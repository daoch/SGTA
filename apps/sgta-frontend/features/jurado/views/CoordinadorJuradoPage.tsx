"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaEspecialidadFilter,
  EstadoJurado,
  JuradoViewModel,
  TipoDedicacion,
} from "@/features/jurado/types/juradoDetalle.types";
import { useEffect, useState } from "react";
import TableJurados from "../components/JuradosTable";
import { getAllAreasEspecialidad, getAllJurados } from "../services/jurado-service";
import { AreaEspecialidad } from "../types/jurado.types";

const JuradosView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [juradosData, setJuradosData] = useState<JuradoViewModel[]>([]);
  const [dedication, setDedication] = useState<TipoDedicacion>(TipoDedicacion.TODOS);
  const [specialty, setSpecialty] = useState<AreaEspecialidadFilter>(AreaEspecialidadFilter.TODOS);
  const [status, setStatus] = useState<EstadoJurado>(EstadoJurado.TODOS);
  const [hasSearched, setHasSearched] = useState(false);

  const [allJuradosData, setAllJuradosData] = useState<JuradoViewModel[]>([]);
  const [areasEspecialidad, setAreasEspecialidad] = useState<AreaEspecialidad[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areas = await getAllAreasEspecialidad();
        setAreasEspecialidad(areas);
      } catch (error) {
        console.error("Error fetching áreas de especialidad:", error);
      }
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchJurados = async () => {
      try {
        const jurados = await getAllJurados();
        const juradosViewModel = jurados.map((j) => ({
          ...j,
          email: j.email || "",
        }));
        setAllJuradosData(juradosViewModel);
        setJuradosData(juradosViewModel);
      } catch (error) {
        console.error("Error fetching jurados data:", error);
      }
    };
    fetchJurados();
  }, []);

  useEffect(() => {
    const filtered = allJuradosData.filter((j) => {
      const matchDedication = dedication === TipoDedicacion.TODOS || j.dedication === dedication;
      const matchSpecialty =
        specialty === AreaEspecialidadFilter.TODOS || j.specialties.includes(specialty);
      const matchStatus = status === EstadoJurado.TODOS || j.status === status;
      const matchSearch =
        !hasSearched ||
        j.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.code.includes(searchTerm) ||
        j.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchDedication && matchSpecialty && matchStatus && matchSearch;
    });

    setJuradosData(filtered);
  }, [dedication, specialty, status, searchTerm, hasSearched, allJuradosData]);

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] pl-[20px] items-center gap-[10px] self-stretch">
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Miembros de Jurado
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
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
          onClick={handleSearch}
        >
          Buscar
        </Button>

        <div className="flex flex-col w-[130px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Tipo de Dedicación</label>
          <Select onValueChange={(val) => setDedication(val as TipoDedicacion)}>
            <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TipoDedicacion.TODOS}>Todos</SelectItem>
              <SelectItem value={TipoDedicacion.TIEMPO_COMPLETO}>Tiempo Completo</SelectItem>
              <SelectItem value={TipoDedicacion.MEDIO_TIEMPO}>Medio Tiempo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-[200px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Área de Especialidad</label>
          <Select onValueChange={(val) => setSpecialty(val as AreaEspecialidadFilter)}>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AreaEspecialidadFilter.TODOS}>
                {AreaEspecialidadFilter.TODOS}
              </SelectItem>
              {areasEspecialidad.map((area) => (
                <SelectItem key={area.name} value={area.name}>
                  {area.name.charAt(0).toUpperCase() + area.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-[107px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Estado</label>
          <Select onValueChange={(val) => setStatus(val as EstadoJurado)}>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EstadoJurado.TODOS}>Todos</SelectItem>
              <SelectItem value={EstadoJurado.ACTIVO}>Activo</SelectItem>
              <SelectItem value={EstadoJurado.INACTIVO}>Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white">
          + Nuevo Jurado
        </Button>
      </div>

      <TableJurados juradosData={juradosData} />
    </div>
  );
};

export default JuradosView;
