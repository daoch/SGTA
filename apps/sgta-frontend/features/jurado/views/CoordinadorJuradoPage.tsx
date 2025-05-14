"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EstadoJurado,
  JuradoViewModel,
} from "@/features/jurado/types/juradoDetalle.types";
import { useEffect, useState } from "react";
import TableJurados from "../components/JuradosTable";
import {
  getAllAreasEspecialidad,
  getAllJurados,
  getAllTiposDedicacion,
} from "../services/jurado-service";
import { AreaEspecialidad, TipoDedicacion } from "../types/jurado.types";

const JuradosView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [juradosData, setJuradosData] = useState<JuradoViewModel[]>([]);
  const [dedication, setDedication] = useState<TipoDedicacion[]>([]);
  const [selectedDedication, setSelectedDedication] = useState<string>("TODOS");

  const [specialty, setSpecialty] = useState<string>("TODOS");
  const [status, setStatus] = useState<EstadoJurado>(EstadoJurado.TODOS);
  const [hasSearched, setHasSearched] = useState(false);

  const [allJuradosData, setAllJuradosData] = useState<JuradoViewModel[]>([]);
  const [areasEspecialidad, setAreasEspecialidad] = useState<
    AreaEspecialidad[]
  >([]);

  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

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
    const fetchTiposDedicacion = async () => {
      try {
        const tiposDedicacion = await getAllTiposDedicacion();
        setDedication(tiposDedicacion);
      } catch (error) {
        console.error("Error fetching tipos de dedicación:", error);
      }
    };
    fetchTiposDedicacion();
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
    console.log("JuradosData", juradosData);
    console.log("Dedicaion", selectedDedication);
    const filtered = allJuradosData.filter((j) => {
      const matchStatus = status === EstadoJurado.TODOS || j.status === status;
      const matchSearch =
        !hasSearched ||
        j.user.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        j.code.includes(appliedSearchTerm) ||
        j.email.toLowerCase().includes(appliedSearchTerm.toLowerCase());
      const matchDedication =
        selectedDedication === "TODOS" || j.dedication === selectedDedication;
      const matchSpecialty =
        specialty === "TODOS" ||
        j.specialties.some((s) => s.toLowerCase() === specialty.toLowerCase());
      return matchStatus && matchSearch && matchDedication && matchSpecialty;
    });

    setJuradosData(filtered);
  }, [
    selectedDedication,
    specialty,
    status,
    appliedSearchTerm,
    hasSearched,
    allJuradosData,
  ]);

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Miembros de Jurado
        </h1>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Ingrese el nombre, código o correo electrónico del usuario"
          className="flex w-[447px] h-[44px] px-3 py-2 items-center gap-2 border border-[#E2E6F0] rounded-none bg-background resize-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setAppliedSearchTerm(searchTerm);
              setHasSearched(true);
            }
          }}
        />

        <div className="flex flex-col w-[250px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Tipo de Dedicación</label>
          <Select onValueChange={(val) => setSelectedDedication(val)}>
            <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              {dedication.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.iniciales}>
                  {tipo.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-[250px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Área de Especialidad</label>
          <Select onValueChange={(val) => setSpecialty(val)}>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent className="max-h-48 overflow-y-auto">
              <SelectItem value="TODOS">Todos</SelectItem>
              {areasEspecialidad.map((area) => (
                <SelectItem key={area.id} value={area.nombre}>
                  {area.nombre.charAt(0).toUpperCase() + area.nombre.slice(1)}
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
      </div>
      {juradosData.length === 0 ? (
        <div className="text-center text-gray-400 mt-5">
          <p>
            No hay miembros de jurados disponibles que coincidan con los filtros
            aplicados.
          </p>
        </div>
      ) : (
        <TableJurados juradosData={juradosData} />
      )}
    </div>
  );
};

export default JuradosView;

