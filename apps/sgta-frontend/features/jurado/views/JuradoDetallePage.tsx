"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListaTesisJuradoCard } from "../components/TesisCard";

import {
  Jurado,
  TesisAsignada,
  CursoType,
  PeriodoAcademico,
  JuradoDetalleViewProps,
} from "@/features/jurado/types/juradoDetalle.types";

export function JuradoDetalleView({
  modalAsignarTesisComponent: ModalAsignarTesis,
}: JuradoDetalleViewProps) {
  const params = useParams();
  const router = useRouter();
  const detalleJurado = params?.detalleJurado as string;
  const [searchTerm, setSearchTerm] = useState("");

  // Define los datos con el tipo correcto
  const tesisData: TesisAsignada[] = [
    {
      titulo:
        "Aplicación de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampas pegantes",
      codigo: "INF0501",
      estudiante: "Angel Malpartida",
      codEstudiante: "20201242",
      resumen:
        "El presente trabajo de investigación busca hacer una revisión sistemática sobre las técnicas actuales que se usan para solucionar problemas de identificación y clasificación de plagas de insectos...",
      especialidades: ["Desarrollo Web", "Backend"],
      curso: CursoType.PFC1,
      periodo: PeriodoAcademico.PERIODO_2025_1,
      rol: "Jurado",
    },
    {
      titulo:
        "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
      codigo: "INF1643",
      estudiante: "Marco Bossio",
      codEstudiante: "20105420",
      resumen:
        "El nivel de complejidad textual puede ser un inconveniente para algunas personas al momento de usar Chatbots...",
      especialidades: ["Ciencias de la Computación"],
      curso: CursoType.PFC2,
      periodo: PeriodoAcademico.PERIODO_2025_1,
      rol: "Jurado",
    },
  ];

  const tesisDataSeleccion = [
    {
      titulo:
        "Aplicación de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampas pegantes",
      codigo: "INF0501",
      estudiante: "Angel Malpartida",
      codEstudiante: "20201242",
      especialidades: ["Vision Computacional", "Sistemas de Informacion"],
      rol: "Jurado",
      resumen: "",
    },
    {
      titulo:
        "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
      codigo: "INF1643",
      estudiante: "Marco Bossio",
      codEstudiante: "20105420",
      especialidades: ["Ciencias de la Computación"],
      rol: "Jurado",
      resumen: "",
    },
  ];

  const juradoEjemplo: Jurado = {
    specialties: ["Ingeniería de Software", "Ciencias de la Computación"],
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [asignadas, setAsignadas] = useState<TesisAsignada[]>(tesisData);
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoAcademico>(
    PeriodoAcademico.TODOS,
  );
  const [selectedCurso, setSelectedCurso] = useState<CursoType>(
    CursoType.TODOS,
  );

  const handleAsignarTesis = async () => {
    try {
      // implementación futura
    } catch (error) {
      console.error("Error en la asignación:", error);
    }
  };

  const handleTesisCardClick = (codigoTesis: string) => {
    // Navegación a la página de detalle de tesis
    router.push(`/coordinador/jurados/${detalleJurado}/tesis/${codigoTesis}`);
  };

  // Modificación clave: eliminar searchTerm de las dependencias y
  // filtrar solo por curso y periodo en este useEffect
  useEffect(() => {
    setAsignadas(
      tesisData.filter((tesis) => {
        const matchCurso =
          selectedCurso === CursoType.TODOS || tesis.curso === selectedCurso;
        const matchPeriodo =
          selectedPeriodo === PeriodoAcademico.TODOS ||
          tesis.periodo === selectedPeriodo;
        return matchCurso && matchPeriodo;
      }),
    );
  }, [selectedCurso, selectedPeriodo]); // Quitar searchTerm de aquí

  // Función de búsqueda que filtra por texto y respeta los filtros activos
  const handleSearch = () => {
    setAsignadas(
      tesisData.filter((tesis) => {
        const matchText =
          tesis.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tesis.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tesis.estudiante.toLowerCase().includes(searchTerm.toLowerCase());

        const matchCurso =
          selectedCurso === CursoType.TODOS || tesis.curso === selectedCurso;
        const matchPeriodo =
          selectedPeriodo === PeriodoAcademico.TODOS ||
          tesis.periodo === selectedPeriodo;

        return matchText && matchCurso && matchPeriodo;
      }),
    );
  };

  if (!detalleJurado) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] pl-[20px] items-center gap-[10px] self-stretch">
        <button
          onClick={() => router.back()}
          className="flex items-center text-black hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
        </button>
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Temas como Miembro de Jurado
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex items-center w-[447px] h-[44px] border border-[#E2E6F0] bg-background">
          <Input
            placeholder="Ingrese el código, título del tema o nombre del estudiante"
            className="pl-12 w-full h-full px-3 py-2 items-center gap-2 bg-transparent resize-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button
          className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
          onClick={handleSearch}
        >
          Buscar
        </Button>

        {/* ComboBox 1 - Curso */}
        <div className="flex flex-col w-[242px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Curso</label>
          <Select
            onValueChange={(val: string) => setSelectedCurso(val as CursoType)}
            defaultValue={CursoType.TODOS}
          >
            <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md !important">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CursoType.TODOS}>{CursoType.TODOS}</SelectItem>
              <SelectItem value={CursoType.PFC1}>
                Proyecto de Fin de Carrera 1
              </SelectItem>
              <SelectItem value={CursoType.PFC2}>
                Proyecto de Fin de Carrera 2
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ComboBox 2 - Periodo */}
        <div className="flex flex-col w-[104px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Periodo</label>
          <Select
            onValueChange={(val: string) =>
              setSelectedPeriodo(val as PeriodoAcademico)
            }
            defaultValue={PeriodoAcademico.TODOS}
          >
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PeriodoAcademico.TODOS}>
                {PeriodoAcademico.TODOS}
              </SelectItem>
              <SelectItem value={PeriodoAcademico.PERIODO_2025_1}>
                2025-1
              </SelectItem>
              <SelectItem value={PeriodoAcademico.PERIODO_2025_0}>
                2025-0
              </SelectItem>
              <SelectItem value={PeriodoAcademico.PERIODO_2024_2}>
                2024-2
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón de Asignar tesis */}
        <Button
          className="inline-flex h-[44px] px-[16px] py-0 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white ml-auto"
          onClick={() => setModalOpen(true)}
        >
          + Asignar Tesis
        </Button>
      </div>
      <ListaTesisJuradoCard
        data={asignadas}
        onCardClick={handleTesisCardClick}
      />

      {/* Modal */}
      <ModalAsignarTesis
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAsignar={handleAsignarTesis}
        data={tesisDataSeleccion}
        jurado={juradoEjemplo}
      />
    </div>
  );
}

export default JuradoDetalleView;
