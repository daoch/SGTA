"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Profesor } from "../types/temas.types";
import { getProfesores } from "../services/temas-service";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ModeradorCard } from "./moderador-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { reunionesZoom } from "../services/planificacion-service";

interface ModalAgregarHostsMeetingProps {
  isOpen: boolean;
  onClose: () => void;
  idExposicion: number;
}

export default function ModalAgregarHostsMeeting({
  isOpen,
  onClose,
  idExposicion,
}: ModalAgregarHostsMeetingProps) {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState<
    Profesor[]
  >([]);
  const [selectedProfesores, setSelectedProfesores] = useState<Profesor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfesorSelect = (profesor: Profesor) => {
    if (selectedProfesores.includes(profesor)) {
      setSelectedProfesores(
        selectedProfesores.filter((p) => p.id !== profesor.id),
      );
    } else {
      setSelectedProfesores([...selectedProfesores, profesor]);
    }
  };
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const profesores = await getProfesores();
        setProfesores(profesores);
        setProfesoresSeleccionados(profesores);
      } catch (error) {
        console.error("Error fetching profesores:", error);
      }
    };
    fetchProfesores();
  }, []);
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

      return matchesSearchTerm;
    });

    setProfesoresSeleccionados(filtered);
  };

  const handleRemoveSelected = (profesorId: number) => {
    setSelectedProfesores((prev) => prev.filter((u) => u.id !== profesorId));
  };

  //PARA LA PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

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
      setSelectedProfesores([]);
      setSearch("");
      setProfesoresSeleccionados(profesores);
      setCurrentPage(1);
    }
  }, [isOpen, profesores]);

  const [isAssigning, setIsAssigning] = useState(false);
  const handleAsignarClick = async () => {
    if (selectedProfesores.length > 0 && !isAssigning) {
      setIsAssigning(true);
      try {
        // Llamar a la función onAsignar y esperar si es una función asíncrona
        const selectedProfesorIds = selectedProfesores.map(
          (profesor) => profesor.correoElectronico,
        );
        await reunionesZoom(idExposicion);

        // Mostrar mensaje de éxito
        // toast.success(
        //   "Los miembros de jurado han sido asignado exitosamente al tema.",
        // );

        // Cerrar el modal
        onClose();
      } catch (error) {
        // Mostrar mensaje de error
        // toast.error("Hubo un error al asignar el tema al jurado");
        console.error(error);
      } finally {
        setIsAssigning(false);
      }
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-[580px] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg font-medium">
              Agregar Moderadores a las Salas de Zoom
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Puedes agregar moderadores para las salas de exposición en Zoom.
              Tendrán acceso como anfitriones en todas las salas.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-grow min-h-0">
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
            </div>

            <div className="flex-shrink-0">
              <Label className="text-sm font-medium">
                Docentes Seleccionados ({selectedProfesores.length}):
              </Label>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto mt-2">
                {selectedProfesores.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProfesores.map((profesor) => (
                      <Badge
                        key={profesor.id}
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {profesor.nombres} {profesor.primerApellido}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-blue-300"
                          onClick={() => handleRemoveSelected(profesor.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    No hay docentes seleccionados
                  </div>
                )}
              </div>
            </div>

            {profesoresSeleccionados.length > 0 ? (
              <div className="flex flex-col gap-4 mt-2 flex-grow overflow-y-auto">
                {currentItems.map((profesor) => {
                  return (
                    <ModeradorCard
                      key={profesor.id}
                      docente={profesor}
                      isSelected={selectedProfesores.includes(profesor)}
                      onSelect={() => handleProfesorSelect(profesor)}
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
              <div className="flex items-center gap-2 min-w-[250px]">
                <span className="text-sm text-gray-500">
                  Mostrando {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, profesoresSeleccionados.length)} de{" "}
                  {profesoresSeleccionados.length} registros
                </span>
              </div>

              <Pagination>
                <PaginationContent className="flex items-center justify-end gap-15">
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

          <DialogFooter className="flex gap-2 justify-end mt-6">
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
                  Agregando
                </>
              ) : (
                "Agregar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

