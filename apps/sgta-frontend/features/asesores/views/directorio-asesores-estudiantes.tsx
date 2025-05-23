"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Check, Filter, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CardAsesorBusqueda } from "../components/directorio/card-asesor-busqueda";
import {
  generateMockAsesores,
  getAllAreasTematicas,
  getAllTemasInteres,
} from "../mocks/directorio/directorio-mock";
import { AreaTematica, Asesor, TemaInteres } from "../types/perfil/entidades";

// Tipos de datos

interface SearchFilters {
  areasTematicas: AreaTematica[];
  temasInteres: TemaInteres[];
  soloDisponible: boolean;
}

type SortOption = "default" | "name-asc" | "name-desc";

const allAreaTematica: AreaTematica[] = getAllAreasTematicas();

const allTemasInteres: TemaInteres[] = getAllTemasInteres();

const advisors: Asesor[] = generateMockAsesores();

// Mapeo de opciones de ordenamiento a texto para mostrar
const sortOptionLabels: Record<SortOption, string> = {
  default: "Orden predeterminado",
  "name-asc": "Nombre (A-Z)",
  "name-desc": "Nombre (Z-A)",
};

export default function DirectorioAsesoresEstudiantes() {
  // Estado para la búsqueda y filtros
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [filters, setFilters] = useState<SearchFilters>({
    areasTematicas: [],
    temasInteres: [],
    soloDisponible: false,
  });
  const [tempFilters, setTempFilters] = useState<SearchFilters>({
    areasTematicas: [],
    temasInteres: [],
    soloDisponible: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estados para las búsquedas en los filtros
  const [thematicAreaSearch, setThematicAreaSearch] = useState("");
  const [interestAreaSearch, setInterestAreaSearch] = useState("");

  // Inicializar filtros temporales cuando se abre el panel
  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters({ ...filters });
    }
  }, [isFilterOpen, filters]);

  // Función para ejecutar la búsqueda
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  // Función para manejar Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Filtrar y ordenar asesores usando useMemo
  const filteredAdvisors = useMemo(() => {
    let results = advisors;

    // Filtrar por disponibilidad
    if (filters.soloDisponible) {
      results = results.filter((advisor) => advisor.estado);
    }

    // Filtrar por áreas temáticas
    if (filters.areasTematicas.length > 0) {
      results = results.filter((advisor) =>
        filters.areasTematicas.some((area) =>
          advisor.areasTematicas.includes(area),
        ),
      );
    }

    // Filtrar por áreas de interés
    if (filters.temasInteres.length > 0) {
      results = results.filter((advisor) =>
        filters.temasInteres.some((area) =>
          advisor.temasIntereses.includes(area),
        ),
      );
    }

    // Filtrar por búsqueda de texto
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (advisor) =>
          advisor.nombre.toLowerCase().includes(query) ||
          advisor.areasTematicas.some((area) =>
            area.nombre.toLowerCase().includes(query),
          ) ||
          advisor.temasIntereses.some((area) =>
            area.nombre.toLowerCase().includes(query),
          ),
      );
    }

    // Ordenar resultados
    switch (sortOption) {
      case "name-asc":
        results.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "name-desc":
        results.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "default":
      default:
        // Mantener el orden original
        break;
    }

    return results;
  }, [searchQuery, filters, sortOption]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredAdvisors.length / itemsPerPage);
  const paginatedAdvisors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAdvisors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAdvisors, currentPage]);

  // Resetear a la primera página cuando cambian los filtros o la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortOption]);

  useEffect(() => {
    // No es necesario setCurrentPage aquí, ya que el ordenamiento se aplica inmediatamente
  }, [sortOption]);

  // Función para aplicar filtros
  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setIsFilterOpen(false);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setTempFilters({
      areasTematicas: [],
      temasInteres: [],
      soloDisponible: false,
    });
  };

  // Función para cancelar cambios en filtros
  const cancelFilters = () => {
    setTempFilters({ ...filters });
    setIsFilterOpen(false);
  };

  // Función para agregar o quitar un área temática
  const toggleThematicArea = (area: AreaTematica) => {
    setTempFilters((prev) => {
      if (prev.areasTematicas.includes(area)) {
        return {
          ...prev,
          thematicAreas: prev.areasTematicas.filter((a) => a !== area),
        };
      } else {
        return {
          ...prev,
          thematicAreas: [...prev.areasTematicas, area],
        };
      }
    });
  };

  // Función para agregar o quitar un área de interés
  const toggleInterestArea = (area: TemaInteres) => {
    setTempFilters((prev) => {
      if (prev.temasInteres.includes(area)) {
        return {
          ...prev,
          interestAreas: prev.temasInteres.filter((a) => a !== area),
        };
      } else {
        return {
          ...prev,
          interestAreas: [...prev.temasInteres, area],
        };
      }
    });
  };

  // Filtrar áreas temáticas basado en la búsqueda
  const filteredThematicAreas = useMemo(() => {
    if (thematicAreaSearch.trim() === "") return [];
    return allAreaTematica.filter((area) =>
      area.nombre.toLowerCase().includes(thematicAreaSearch.toLowerCase()),
    );
  }, [thematicAreaSearch]);

  // Filtrar áreas de interés basado en la búsqueda
  const filteredInterestAreas = useMemo(() => {
    if (interestAreaSearch.trim() === "") return [];
    return allTemasInteres.filter((area) =>
      area.nombre.toLowerCase().includes(interestAreaSearch.toLowerCase()),
    );
  }, [interestAreaSearch]);

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Calcular el número de filtros aplicados (solo áreas temáticas y temas de interés)
  const appliedFiltersCount =
    filters.areasTematicas.length + filters.temasInteres.length;

  // Generar elementos de paginación
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      // Calcular el rango de páginas a mostrar
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible + 1) {
        // Cerca del inicio
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // Cerca del final
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        // En el medio
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // Añadir primera página y elipsis si es necesario
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    // Añadir páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Añadir última página y elipsis si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Búsqueda de Asesores</h1>

      {/* Barra de búsqueda principal y controles */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, área temática o tema de interés..."
              className="pl-8 rounded-r-none border-r-0"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="rounded-l-none px-3"
            variant="outline"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Dropdown para ordenar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {sortOptionLabels[sortOption]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOption("default")}>
              <div className="flex items-center gap-2">
                {sortOption === "default" && <Check className="h-4 w-4" />}
                <span>Orden predeterminado</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("name-asc")}>
              <div className="flex items-center gap-2">
                {sortOption === "name-asc" && <Check className="h-4 w-4" />}
                <span>Nombre (A-Z)</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("name-desc")}>
              <div className="flex items-center gap-2">
                {sortOption === "name-desc" && <Check className="h-4 w-4" />}
                <span>Nombre (Z-A)</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {appliedFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-full">
                  {appliedFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filtros de búsqueda</SheetTitle>
              <SheetDescription>
                Filtra asesores por áreas temáticas, temas de interés y
                disponibilidad.
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-200px)] py-6">
              <div className="space-y-6 pr-4">
                {/* Filtro de áreas temáticas */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Áreas Temáticas</h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Buscar área temática..."
                      value={thematicAreaSearch}
                      onChange={(e) => setThematicAreaSearch(e.target.value)}
                    />
                    {filteredThematicAreas.length > 0 && (
                      <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                        {filteredThematicAreas.map((area) => (
                          <div
                            key={area.idArea}
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                            onClick={() => toggleThematicArea(area)}
                          >
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                tempFilters.areasTematicas.includes(area)
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              }`}
                            >
                              {tempFilters.areasTematicas.includes(area) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="text-sm">{area.nombre}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {tempFilters.areasTematicas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tempFilters.areasTematicas.map((area) => (
                        <Badge
                          key={area.idArea}
                          variant="secondary"
                          className="gap-1"
                        >
                          {area.nombre}
                          <button
                            onClick={() => toggleThematicArea(area)}
                            className="ml-1 rounded-full hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Eliminar</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Filtro de temas de interés */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Temas de Interés</h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Buscar tema de interés..."
                      value={interestAreaSearch}
                      onChange={(e) => setInterestAreaSearch(e.target.value)}
                    />
                    {filteredInterestAreas.length > 0 && (
                      <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                        {filteredInterestAreas.map((area) => (
                          <div
                            key={area.idTema}
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                            onClick={() => toggleInterestArea(area)}
                          >
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                tempFilters.temasInteres.includes(area)
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              }`}
                            >
                              {tempFilters.temasInteres.includes(area) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="text-sm">{area.nombre}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {tempFilters.temasInteres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tempFilters.temasInteres.map((area) => (
                        <Badge
                          key={area.idTema}
                          variant="secondary"
                          className="gap-1"
                        >
                          {area.nombre}
                          <button
                            onClick={() => toggleInterestArea(area)}
                            className="ml-1 rounded-full hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Eliminar</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Filtro de disponibilidad */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="available">Solo asesores disponibles</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar únicamente asesores que están disponibles para
                      asesorar
                    </p>
                  </div>
                  <Switch
                    id="available"
                    checked={tempFilters.soloDisponible}
                    onCheckedChange={(checked) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        onlyAvailable: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="sm:order-1"
              >
                Limpiar filtros
              </Button>
              <div className="grid grid-cols-2 gap-2 sm:order-2">
                <Button variant="outline" onClick={cancelFilters}>
                  Cancelar
                </Button>
                <Button onClick={applyFilters}>Aplicar</Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filtros aplicados */}
      {(filters.areasTematicas.length > 0 ||
        filters.temasInteres.length > 0 ||
        filters.soloDisponible) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="text-sm text-muted-foreground mr-2 pt-0.5">
            Filtros aplicados:
          </div>

          {filters.areasTematicas.map((area) => (
            <Badge key={area.idArea} variant="secondary" className="gap-1">
              {area.idArea}
              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    thematicAreas: prev.areasTematicas.filter(
                      (a) => a !== area,
                    ),
                  }));
                }}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </button>
            </Badge>
          ))}

          {filters.temasInteres.map((area) => (
            <Badge key={area.idTema} variant="secondary" className="gap-1">
              {area.nombre}
              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    interestAreas: prev.temasInteres.filter((a) => a !== area),
                  }));
                }}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </button>
            </Badge>
          ))}

          {filters.soloDisponible && (
            <Badge variant="secondary" className="gap-1">
              Solo disponibles
              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    onlyAvailable: false,
                  }));
                }}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setFilters({
                areasTematicas: [],
                temasInteres: [],
                soloDisponible: false,
              });
            }}
          >
            Limpiar todos
          </Button>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            Resultados ({filteredAdvisors.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            {filters.soloDisponible
              ? "Mostrando los asesores disponibles encontrados"
              : "Mostrando todos los asesores encontrados"}
          </p>
        </div>

        {filteredAdvisors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron asesores con los criterios especificados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedAdvisors.map((advisor) => (
              <CardAsesorBusqueda advisor={advisor} />
            ))}

            {/* Paginación */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    {currentPage === 1 ? (
                      <span className="px-3 py-1 text-gray-400 cursor-not-allowed">
                        Previous
                      </span>
                    ) : (
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    )}
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    {currentPage === totalPages ? (
                      <span className="px-3 py-1 text-gray-400 cursor-not-allowed">
                        Next
                      </span>
                    ) : (
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
