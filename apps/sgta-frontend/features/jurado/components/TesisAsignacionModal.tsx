"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ListaTesisJuradoCard } from "./TesisCard";
import { MultiSelectCheckbox } from "./EspecialiadMultiSelect";
import {
  ModalAsignarTesisProps,
  JuradoTemasDetalle,
  SelectOption,
} from "@/features/jurado/types/juradoDetalle.types"; // Asegúrate de que la ruta sea correcta
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { AreaEspecialidad } from "../types/jurado.types";

import { getAllAreasEspecialidad } from "../services/jurado-service";

import { toast } from "sonner";

export const ModalAsignarTesis: React.FC<ModalAsignarTesisProps> = ({
  open,
  onClose,
  onAsignar,
  jurado,
  data,
}) => {
  const [search, setSearch] = useState("");
  const [tesisSeleccionada, setTesisSeleccionada] =
    useState<JuradoTemasDetalle | null>(null);

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

  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] =
    useState<number[]>(
      // Extraer los nombres de las áreas y usarlos como valores iniciales
      jurado ? jurado.map((area) => area.id) : [],
    );

  const handleSelectCard = (tesis: JuradoTemasDetalle) => {
    setTesisSeleccionada(tesis);
  };

  const filteredData = data.filter((t) => {
    // Para buscar en el título y código
    const tituloMatch = t.titulo.toLowerCase().includes(search.toLowerCase());
    const codigoMatch = t.codigo.toLowerCase().includes(search.toLowerCase());

    // Para buscar en los nombres de estudiantes (ahora es un array)
    const estudiantesMatch = t.estudiantes.some(
      (est) =>
        est.nombre.toLowerCase().includes(search.toLowerCase()) ||
        est.codigo.toLowerCase().includes(search.toLowerCase()),
    );

    // Para filtrar por áreas de conocimiento
    const matchesEspecialidad =
      especialidadesSeleccionadas.length === 0 ||
      t.sub_areas_conocimiento.some((subArea) =>
        especialidadesSeleccionadas.includes(subArea.id_area_conocimiento),
      );

    // Combina todos los criterios de búsqueda
    return (
      (tituloMatch || codigoMatch || estudiantesMatch) && matchesEspecialidad
    );
  });

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      // Simular tiempo de carga
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      // Cuando el modal se abre, reinicia los valores a los originales del jurado
      setEspecialidadesSeleccionadas(
        jurado ? jurado.map((area) => area.id) : [],
      );
      // También limpia la búsqueda y la tesis seleccionada
      setSearch("");
      setTesisSeleccionada(null);
    }
  }, [open, jurado]);

  // Texto para mostrar en el MultiSelect
  const getMultiSelectDisplayText = () => {
    const count = especialidadesSeleccionadas.length;
    if (count === 0) return "Seleccione las áreas";
    return `${count} área${count !== 1 ? "s" : ""} seleccionada${count !== 1 ? "s" : ""}`;
  };

  const [areasEspecialidad, setAreasEspecialidad] = useState<
    AreaEspecialidad[]
  >([]);

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

  // Convierte las áreas de especialidad a opciones para el MultiSelectCheckbox
  const areaOptions: SelectOption[] = areasEspecialidad.map((area) => ({
    label: area.nombre,
    value: area.id.toString(),
  }));

  const handleAreaChange = (selectedValues: string[]) => {
    // Convertir los valores string a números
    const selectedIds = selectedValues.map((value) => parseInt(value, 10));
    setEspecialidadesSeleccionadas(selectedIds);
  };

  const [isAssigning, setIsAssigning] = useState(false);

  const handleAsignarClick = async () => {
    if (tesisSeleccionada && !isAssigning) {
      setIsAssigning(true);
      try {
        // Llamar a la función onAsignar y esperar si es una función asíncrona
        await onAsignar(tesisSeleccionada);

        // Mostrar mensaje de éxito
        toast.success(
          `El tema "${tesisSeleccionada.titulo}" ha sido asignado exitosamente al jurado.`,
        );

        // Cerrar el modal
        onClose();
      } catch (error) {
        // Mostrar mensaje de error
        toast.error("Hubo un error al asignar el tema al jurado");
        console.error(error);
      } finally {
        setIsAssigning(false);
      }
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const [searchResults, setSearchResults] =
    useState<JuradoTemasDetalle[]>(data);
  const handleSearch = () => {
    // Aplicar filtros de búsqueda similares a los que tienes en filteredData
    const results = data.filter((t) => {
      const tituloMatch = t.titulo.toLowerCase().includes(search.toLowerCase());
      const codigoMatch = t.codigo.toLowerCase().includes(search.toLowerCase());
      const estudiantesMatch = t.estudiantes.some(
        (est) =>
          est.nombre.toLowerCase().includes(search.toLowerCase()) ||
          est.codigo.toLowerCase().includes(search.toLowerCase()),
      );

      return tituloMatch || codigoMatch || estudiantesMatch;
    });

    setSearchResults(results);
  };

  useEffect(() => {
    setSearchResults(data);
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-[850px] h-[1000px] max-w-none !max-w-[100vw]">
        <DialogHeader>
          <DialogTitle>Asignar Tema de Proyecto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex items-center w-[60%]">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Ingrese el título del tema de proyecto o nombre del estudiante"
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
            onClick={handleSearch}
          >
            Buscar
          </Button>

          <MultiSelectCheckbox
            options={areaOptions}
            selected={especialidadesSeleccionadas.map((id) => id.toString())}
            onChange={handleAreaChange}
            displayText={getMultiSelectDisplayText()}
          />
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="text-center text-gray-400 mt-5">
              <p className="text-gray-500 animate-pulse">
                Cargando temas disponibles...
              </p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center text-gray-400 mt-5">
              <p>
                No hay temas disponibles que coincidan con los filtros
                aplicados.
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <ListaTesisJuradoCard
                data={filteredData}
                onSelect={handleSelectCard}
                selected={tesisSeleccionada}
              />
            </div>
          )}
        </div>

        {!isLoading && filteredData.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            {/* <div className="flex items-center gap-2">
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
            </div> */}

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Mostrando {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredData.length)} de{" "}
                {filteredData.length} registros
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
                      (number === totalPages - 1 &&
                        currentPage < totalPages - 2)
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
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
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
        )}

        <DialogFooter className="absolute bottom-6 right-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleAsignarClick}
            disabled={!tesisSeleccionada || isAssigning}
            className="bg-[#042354] text-white"
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Asignando
              </>
            ) : (
              "Asignar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

