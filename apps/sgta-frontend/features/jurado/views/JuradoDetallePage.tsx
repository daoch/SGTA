"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  TesisAsignada,
  CursoType,
  PeriodoAcademico,
  JuradoDetalleViewProps,
  JuradoTemasDetalle,
  AreaConocimientoJurado,
} from "@/features/jurado/types/juradoDetalle.types";
import { getTemasJurado ,listarAreasConocimientoJurado,getTemasModalAsignar} from "../services/jurado-service";

export function JuradoDetalleView({
  modalAsignarTesisComponent: ModalAsignarTesis,
}: JuradoDetalleViewProps) {
  const params = useParams();
  const router = useRouter();
  const detalleJurado = params?.detalleJurado as string;
  const [searchTerm, setSearchTerm] = useState("");

  const [allTemasJuradoData, setAllTemasJuradoData] = useState<
    JuradoTemasDetalle[]
  >([]);
  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const temas = await getTemasJurado(Number(detalleJurado));
        setAllTemasJuradoData(temas);
        setAsignadas(temas);
      } catch (error) {
        console.error("Error fetching temas de jurado:", error);
      }
    };
    fetchTemas();
  }, []);

  // Luego, dentro del componente, añade el siguiente estado
  const [juradoAreaConocimiento, setJuradoAreaConocimiento] = useState<AreaConocimientoJurado[]>([]);

  // Añade este useEffect después del useEffect existente para cargar los temas
  useEffect(() => {
    const fetchAreasConocimiento = async () => {
      try {
        const areas = await listarAreasConocimientoJurado(Number(detalleJurado));
        setJuradoAreaConocimiento(areas);
      } catch (error) {
        console.error("Error fetching áreas de conocimiento del jurado:", error);
      }
    };
    fetchAreasConocimiento();
  }, [detalleJurado]);

  const [tesisDataSeleccion, setTesisDataSeleccion] = useState<JuradoTemasDetalle[]>([]);

  // Añade este useEffect después del useEffect para cargar áreas de conocimiento
  useEffect(() => {
    const fetchTemasModalAsignar = async () => {
      try {
        const temas = await getTemasModalAsignar(Number(detalleJurado));
        setTesisDataSeleccion(temas);
      } catch (error) {
        console.error("Error fetching temas para modal de asignación:", error);
      }
    };
    fetchTemasModalAsignar();
  }, [detalleJurado]);

  const [asignadas, setAsignadas] = useState<JuradoTemasDetalle[]>([]);

  //PARA LA PAGINACION
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  //CALCULAR TOTAL DE PAGINAS
  const totalPages = Math.ceil(asignadas.length / itemsPerPage);

  //CALCULAR ITEMS A MOSTRAR EN LA PAGINA ACTUAL
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = asignadas.slice(indexOfFirstItem, indexOfLastItem);

  //FUNCION PARA CAMBIAR DE PAGINA
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //GENERAR NUMEROS DE PAGINA
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  //FUNCION PARA CAMBIAR ITEMS POR PAGINA
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [asignadas]);

  const [modalOpen, setModalOpen] = useState(false);
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
      allTemasJuradoData.filter((tesis) => {
        const matchCurso =
          selectedCurso === CursoType.TODOS ||
          tesis.etapaFormativaTesis.nombre === selectedCurso;
        const matchPeriodo =
          selectedPeriodo === PeriodoAcademico.TODOS ||
          tesis.cicloTesis.nombre === selectedPeriodo;
        return matchCurso && matchPeriodo;
      }),
    );
  }, [selectedCurso, selectedPeriodo]); // Quitar searchTerm de aquí

  // Función de búsqueda que filtra por texto y respeta los filtros activos
  const handleSearch = () => {
    setAsignadas(
      allTemasJuradoData.filter((tesis) => {
        const matchText =
          tesis.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tesis.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tesis.estudiantes.some((estudiante) =>
            estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
          );

        const matchCurso =
          selectedCurso === CursoType.TODOS ||
          tesis.etapaFormativaTesis.nombre === selectedCurso;
        const matchPeriodo =
          selectedPeriodo === PeriodoAcademico.TODOS ||
          tesis.cicloTesis.nombre === selectedPeriodo;

        return matchText && matchCurso && matchPeriodo;
      }),
    );
  };

  if (!detalleJurado) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <button
          onClick={() => router.back()}
          className="flex items-center text-black hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Temas como Miembro de Jurado
        </h1>
      </div>

      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-3 items-center">
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
              onValueChange={(val: string) =>
                setSelectedCurso(val as CursoType)
              }
              defaultValue={CursoType.TODOS}
            >
              <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md !important">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CursoType.TODOS}>
                  {CursoType.TODOS}
                </SelectItem>
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
        </div>
        <div>
          {/* Botón de Asignar tesis */}
          <Button
            className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Asignar Tesis
          </Button>
        </div>
      </div>
      <ListaTesisJuradoCard
        data={currentItems}
        onCardClick={handleTesisCardClick}
      />

      {/* Modal */}
       <ModalAsignarTesis
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAsignar={handleAsignarTesis}
        data={tesisDataSeleccion}
        jurado={juradoAreaConocimiento}
      /> 

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">25</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">por página</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Mostrando {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, asignadas.length)} de {asignadas.length}{" "}
            registros
          </span>
        </div>

        <Pagination>
          <PaginationContent className="flex items-center gap-10">
            <PaginationItem>
              <PaginationLink
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-transparent"
                }
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </PaginationLink>
            </PaginationItem>

            <div className="flex items-center gap-1">
              {pageNumbers.map((number) => {
                if (
                  number === 1 ||
                  number === totalPages ||
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => handlePageChange(number)}
                        isActive={currentPage === number}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (
                  (number === 2 && currentPage > 3) ||
                  (number === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={number}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}
            </div>

            <PaginationItem>
              <PaginationLink
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-transparent"
                }
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default JuradoDetalleView;

