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

interface JuradoDetalleViewProps {
  modalAsignarTesisComponent: React.ComponentType<any>;
}

export function JuradoDetalleView({
  modalAsignarTesisComponent: ModalAsignarTesis,
}: JuradoDetalleViewProps) {
  const params = useParams();
  const router = useRouter();
  const detalleJurado = params?.detalleJurado as string; // Este es el dato que viene en la URL
  const [searchTerm, setSearchTerm] = useState("");
  //const [jurado, setJurado] = useState<Jurado | null>(null)

  interface Jurado {
    user: { name: string; avatar: string };
    code: string;
    email: string;
    dedication: string;
    assigned: string;
    specialties: string[];
    status: string;
  }

  const tesisData = [
    {
      titulo:
        "Aplicación de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampas pegantes",
      codigo: "INF0501",
      estudiante: "Angel Malpartida",
      codEstudiante: "20201242",
      resumen:
        "El presente trabajo de investigación busca hacer una revisión sistemática sobre las técnicas actuales que se usan para solucionar problemas de identificación y clasificación de plagas de insectos, los cuales pueden ser para detectar uno o más tipos de insectos. Dentro de esta revisión, se encontró soluciones como algoritmos de segmentación con cambio de espacio de color, lo cual permite remover el fondo de una imagen y centrarse únicamente en el objeto de interés; también, el uso de modelos de detección, por ejemplo YOLO y Faster R-CNN, los cuales están conformados por redes neuronales convolucionales...",
      especialidades: ["Desarrollo Web", "Backend"],
      curso: "PFC1",
      periodo: "2025-1",
      rol: "Jurado",
    },
    {
      titulo:
        "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
      codigo: "INF1643",
      estudiante: "Marco Bossio",
      codEstudiante: "20105420",
      resumen:
        "El nivel de complejidad textual puede ser un inconveniente para algunas personas al momento de usar Chatbots, debido a que estos programas podrían dar respuestas cuyo nivel de complejidad no sea el que entienda el usuario. Entonces, aquellos Chatbots deberían ser entrenados con un conjunto de datos cuya complejidad textual sea la deseada, para evitar confusiones con los usuarios. Para ello, se define una revisión sistemática, en la cual se usan las bases de datos de Google Scholar, ACM Digital Library e IEEE Xplore, de las cuáles se obtiene la información necesaria empleando las palabras claves definidas por el...",
      especialidades: ["Ciencias de la Computación"],
      curso: "PFC2",
      periodo: "2025-1",
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
    },
    {
      titulo:
        "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
      codigo: "INF1643",
      estudiante: "Marco Bossio",
      codEstudiante: "20105420",
      especialidades: ["Ciencias de la Computación"],
      rol: "Jurado",
    },
  ];

  //Se buscan las especialidades del jurado usando su codigo(detalleJurado)
  const juradoEjemplo = {
    specialties: ["Ingeniería de Software", "Ciencias de la Computación"],
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [asignadas, setAsignadas] = useState(tesisData);
  const [selectedPeriodo, setSelectedPeriodo] = useState<
    "Todos" | "2025-1" | "2025-0" | "2024-2"
  >("Todos");
  const [selectedCurso, setSelectedCurso] = useState<"Todos" | "PFC1" | "PFC2">(
    "Todos",
  );

  const handleAsignarTesis = async () => {
    try {
      //llamado a api de listar
      //   const resultado = await response.json();
      // console.log('Tesis asignada correctamente:', resultado);
      // Actualiza el estado local con la nueva tesis asignada
      //setAsignadas(prev => [...prev, nuevaTesis]);
    } catch (error) {
      console.error("Error en la asignación:", error);
      // Aquí podrías mostrar un toast o alerta al usuario
    }
  };

  //useEffect(() => {
    //setAsignadas(tesisData);
  //}, []);

  useEffect(() => {
    setAsignadas(() => {
      return tesisData.filter((tesis) => {
        const matchCurso =
          selectedCurso === "Todos" || tesis.curso === selectedCurso;
        const matchPeriodo =
          selectedPeriodo === "Todos" || tesis.periodo === selectedPeriodo;
        return matchCurso && matchPeriodo;
      });
    });
  }, [selectedCurso, selectedPeriodo, searchTerm]);

  const handleSearch = () => {
    setAsignadas(
      tesisData.filter((tesis) => {
        const matchText =
          tesis.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tesis.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tesis.estudiante.toLowerCase().includes(searchTerm.toLowerCase());
        // Además respetamos filtros de curso/periodo activos
        const matchCurso =
          selectedCurso === "Todos" || tesis.curso === selectedCurso;
        const matchPeriodo =
          selectedPeriodo === "Todos" || tesis.periodo === selectedPeriodo;
        return matchText && matchCurso && matchPeriodo;
      }),
    );
  };

  if (!detalleJurado) {
    return <p>Cargando...</p>; // O un spinner de carga si quieres
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
          <Search className="absolute left-3 text-gray-400 w-5 h-5" />
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
          onClick={handleSearch} // Llama a la función de búsqueda al hacer clic
        >
          Buscar
        </Button>

        {/* ComboBox 1 - Curso */}
        <div className="flex flex-col w-[242px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Curso</label>
          <Select onValueChange={(val) => setSelectedCurso(val as any)}>
            <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md !important">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="PFC1">Proyecto de Fin de Carrera 1</SelectItem>
              <SelectItem value="PFC2">Proyecto de Fin de Carrera 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ComboBox 2 - Perido */}
        <div className="flex flex-col w-[104px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Periodo</label>
          <Select onValueChange={(val) => setSelectedPeriodo(val as any)}>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="2025-1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-1">2025-1</SelectItem>
              <SelectItem value="2025-0">2025-0</SelectItem>
              <SelectItem value="2024-2">2024-2</SelectItem>
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
      <ListaTesisJuradoCard data={asignadas} />

      {/* Modal */}
      <ModalAsignarTesis
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAsignar={handleAsignarTesis}
        data={tesisDataSeleccion} // puede venir de un API más adelante
        jurado={juradoEjemplo}
      />
    </div>
  );
}

export default JuradoDetalleView;
