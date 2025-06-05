"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Search, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MultiSelectCheckbox } from "./EspecialiadMultiSelect";
import { AreaEspecialidad } from "../types/jurado.types";
import { getAllAreasEspecialidad } from "../services/jurado-service";
import { SelectOption } from "../types/juradoDetalle.types";
import { getProfesores } from "../services/temas-service";
import { Profesor } from "../types/temas.types";
import { ProfesorCard } from "./profesor-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ModalAsignarMiembroJuradoProps {
  isOpen: boolean;
  onClose: () => void;
  temaId: number;
  areasConocimientoId: number[];
  cantMiembrosJuradoDisp: number;
  onAsignar: (profesores: number[]) => Promise<void>;
  miembrosJurado?: { id: number; nombre: string; tipo: string }[];
}

export default function ModalAsignarMiembroJurado({
  isOpen,
  onClose,
  temaId,
  areasConocimientoId,
  cantMiembrosJuradoDisp,
  onAsignar,
  miembrosJurado = [],
}: ModalAsignarMiembroJuradoProps) {
  const [areasEspecialidad, setAreasEspecialidad] = useState<
    AreaEspecialidad[]
  >([]);

  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState<
    Profesor[]
  >([]);

  // console.log(
  //   "Cantidad de miembros de jurado disponibles:",
  //   cantMiembrosJuradoDisp,
  // );

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areas = await getAllAreasEspecialidad();
        setAreasEspecialidad(areas);
      } catch (error) {
        console.error("Error fetching áreas de especialidad:", error);
      }
    };
    const fetchProfesores = async () => {
      try {
        const profesores = await getProfesores();
        // filtramos aquellos profesores que ya fueron mapeados a este tema
        const profesoresFiltrados = profesores.filter(
          (profesor) =>
            !miembrosJurado.some((miembro) => miembro.id === profesor.id),
        );
        setProfesores(profesoresFiltrados);
        setProfesoresSeleccionados(profesoresFiltrados);
        // console.log("Profesores:", profesores);
      } catch (error) {
        console.error("Error fetching profesores:", error);
      }
    };
    fetchAreas();
    fetchProfesores();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] =
    useState<number[]>(
      areasConocimientoId.length > 0 ? areasConocimientoId : [],
    );

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simular tiempo de carga
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      setEspecialidadesSeleccionadas(
        areasConocimientoId.length > 0 ? areasConocimientoId : [],
      );
      setSearch("");
      const filteredProfesores = profesores.filter((profesor) => {
        return profesor.areasConocimientoIds.some((areaId) =>
          areasConocimientoId.includes(areaId),
        );
      });

      setProfesoresSeleccionados(filteredProfesores);
    }
  }, [isOpen]);

  const getMultiSelectDisplayText = () => {
    const count = especialidadesSeleccionadas.length;
    if (count === 0) return "Seleccione las áreas";
    return `${count} área${count !== 1 ? "s" : ""} seleccionada${count !== 1 ? "s" : ""}`;
  };

  const areaOptions: SelectOption[] = areasEspecialidad.map((area) => ({
    label: area.nombre,
    value: area.id.toString(),
  }));

  const handleAreaChange = (selectedValues: string[]) => {
    const selectedIds = selectedValues.map((value) => parseInt(value, 10));
    setEspecialidadesSeleccionadas(selectedIds);
    if (selectedIds.length === 0) {
      setProfesoresSeleccionados(profesores);
    } else {
      const filteredByArea = profesores.filter((profesor) => {
        return profesor.areasConocimientoIds.some((areaId) =>
          selectedIds.includes(areaId),
        );
      });
      setProfesoresSeleccionados(filteredByArea);
    }
  };

  const [selectedProfesores, setSelectedProfesores] = useState<Profesor[]>([]);

  const handleProfesorSelect = (profesor: Profesor) => {
    if (selectedProfesores.includes(profesor)) {
      setSelectedProfesores(
        selectedProfesores.filter((p) => p.id !== profesor.id),
      );
    } else {
      setSelectedProfesores([...selectedProfesores, profesor]);
    }
  };

  const handleRemoveSelected = (profesorId: number) => {
    setSelectedProfesores((prev) => prev.filter((u) => u.id !== profesorId));
  };

  const [search, setSearch] = useState("");
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);

    const filtered = profesores.filter((profesor) => {
      const fullName =
        `${profesor.nombres} ${profesor.primerApellido} ${profesor.segundoApellido}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      const matchesSearchTerm =
        fullName.includes(searchLower) ||
        profesor.codigoPucp.toLowerCase().includes(searchLower) ||
        profesor.correoElectronico.toLowerCase().includes(searchLower);

      const matchesArea =
        especialidadesSeleccionadas.length === 0 ||
        profesor.areasConocimientoIds.some((areaId) =>
          especialidadesSeleccionadas.includes(areaId),
        );

      return matchesSearchTerm && matchesArea;
    });

    setProfesoresSeleccionados(filtered);
  };

  //PARA LA PAGINACION
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(4);

  //CALCULAR TOTAL DE PAGINAS
  const totalPages = Math.ceil(profesoresSeleccionados.length / itemsPerPage);

  //CALCULAR ITEMS A MOSTRAR EN LA PAGINA ACTUAL
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = profesoresSeleccionados.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  //FUNCION PARA CAMBIAR DE PAGINA
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //GENERAR NUMEROS DE PAGINA
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (!isOpen) {
      setEspecialidadesSeleccionadas(areasConocimientoId);
      setSelectedProfesores([]);
      setSearch("");
      setProfesoresSeleccionados(profesores);
      setCurrentPage(1);
    }
  }, [isOpen, areasConocimientoId, profesores]);

  const [isAssigning, setIsAssigning] = useState(false);
  const handleAsignarClick = async () => {
    if (selectedProfesores.length > 0 && !isAssigning) {
      setIsAssigning(true);
      try {
        // Llamar a la función onAsignar y esperar si es una función asíncrona
        const selectedProfesorIds = selectedProfesores.map(
          (profesor) => profesor.id,
        );
        await onAsignar(selectedProfesorIds);

        // Mostrar mensaje de éxito
        toast.success(
          "Los miembros de jurado han sido asignado exitosamente al tema.",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[800px] h-[750px] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Asignar Miembro de Jurado a Tema de Proyecto
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-1 items-center flex-wrap">
          <div className="relative flex items-center w-full gap-2 z-10">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />

            <Input
              placeholder="Ingrese el nombre, código o correo electrónico del docente"
              className="pl-10 w-full h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(search);
                }
              }}
            />

            <Button
              className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
              onClick={() => handleSearch(search)}
            >
              Buscar
            </Button>

            <div className="w-[200px]">
              <MultiSelectCheckbox
                options={areaOptions}
                selected={especialidadesSeleccionadas.map((id) =>
                  id.toString(),
                )}
                onChange={handleAreaChange}
                displayText={getMultiSelectDisplayText()}
              />
            </div>
          </div>

          <div>
            {/* LIMITE ALCANZADO*/}
            {selectedProfesores.length === cantMiembrosJuradoDisp && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Límite alcanzado:</strong> Has llegado al máximo de{" "}
                  {cantMiembrosJuradoDisp} miembros de jurado seleccionables.
                </p>
              </div>
            )}

            {/* USUARIOS SELECCIONADOS */}
            {profesoresSeleccionados.length > 0 && (
              <div className="space-y-2 h-[50px]">
                <Label className="text-sm font-medium">
                  Docentes Seleccionados ({selectedProfesores.length}):
                </Label>
                <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                  {selectedProfesores.length > 0 ? (
                    selectedProfesores.map((profesor) => (
                      <Badge
                        key={profesor.id}
                        className="flex items-center gap-1"
                      >
                        {profesor.nombres} {profesor.primerApellido}{" "}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => handleRemoveSelected(profesor.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No hay docentes seleccionados
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {profesoresSeleccionados.length > 0 ? (
            <div className="flex flex-col gap-4 mt-2 flex-grow">
              {currentItems.map((profesor) => {
                const isSelected = selectedProfesores.includes(profesor);
                const isDisabled =
                  !isSelected &&
                  selectedProfesores.length >= cantMiembrosJuradoDisp;

                return (
                  <ProfesorCard
                    key={profesor.id}
                    docente={profesor}
                    isSelected={selectedProfesores.includes(profesor)}
                    onSelect={() => handleProfesorSelect(profesor)}
                    isDisabled={isDisabled}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">
              No hay profesores que coincidan con los filtros aplicados
            </p>
          )}
        </div>

        {!isLoading && profesoresSeleccionados.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 min-w-[200px]">
              <span className="text-sm text-gray-500">
                Mostrando {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, profesoresSeleccionados.length)} de{" "}
                {profesoresSeleccionados.length} registros
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
            disabled={selectedProfesores.length == 0 || isAssigning}
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
}

