"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/features/auth";
import FiltrosAsesoresSheet from "../components/directorio/filtros-asesores";
import FiltrosAplicados from "../components/directorio/filtros-seleccionados";
import OrdenDropdown, {
  SortOption,
} from "../components/directorio/orden-dropdown-directorio";
import ResultadosAsesores from "../components/directorio/resultados-busqueda";
import { getAsesoresPorFiltros } from "../hooks/directorio/page";
import {
  getIdByCorreo,
  listarAreasTematicas,
  listarTemasInteres,
} from "../hooks/perfil/perfil-apis";
import { AreaTematica, Asesor, TemaInteres } from "../types/perfil/entidades";

// Tipos de datos

interface SearchFilters {
  areasTematicas: AreaTematica[];
  temasInteres: TemaInteres[];
  soloDisponible: boolean;
}

export default function DirectorioAsesoresEstudiantes() {
  const { user } = useAuth();

  const [userId, setUserId] = useState<number | null>(null);
  const hasFetchedId = useRef(false);
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

  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [allAreaTematica, setAllAreasTematicas] = useState<AreaTematica[]>([]);
  const [allTemasInteres, setAllTemasInteres] = useState<TemaInteres[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  const loadUsuarioId = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const id = await getIdByCorreo(user.email);

      if (id !== null) {
        setUserId(id);
        console.log("ID del asesor obtenido:", id);
      } else {
        console.warn("No se encontró un asesor con ese correo.");
        // puedes mostrar un mensaje de advertencia aquí si deseas
      }
    } catch (error) {
      console.error("Error inesperado al obtener el ID del asesor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetchedId.current) {
      hasFetchedId.current = true;
      loadUsuarioId();
    }
  }, [user]);

  //Inicializar asesores, areas y temas de interés mediante mock
  useEffect(() => {
    if (!userId) return;

    const fetchAsesores = async () => {
      setIsLoading(true);

      try {
        const data = await getAsesoresPorFiltros({
          alumnoId: userId,
          cadenaBusqueda: searchQuery,
          activo: filters.soloDisponible,
          idAreas: filters.areasTematicas.map((a) => a.idArea),
          idTemas: filters.temasInteres.map((t) => t.idTema),
        });

        setAsesores(data);
      } catch (error) {
        console.error("Error al cargar asesores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsesores();
    setCurrentPage(1);
  }, [userId, filters, searchQuery]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [allAreas, allTemas] = await Promise.all([
          listarAreasTematicas(userId),
          listarTemasInteres(userId),
        ]);
        setAllAreasTematicas(allAreas);
        setAllTemasInteres(allTemas);
      } catch (e) {
        console.error("Error al cargar filtros:", e);
      }
    })();
  }, [userId]);

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

  // Ordenar asesores
  useEffect(() => {
    const sorted = [...asesores];

    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "default":
      default:
        // No hacer nada
        return; // evitamos setear si no hay orden
    }

    setAsesores(sorted);
    setCurrentPage(1);
  }, [sortOption]);

  // Calcular paginación
  const totalPages = Math.ceil(asesores.length / itemsPerPage);
  const paginatedAdvisors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return asesores.slice(startIndex, startIndex + itemsPerPage);
  }, [asesores, currentPage]);

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

  // Filtrar áreas temáticas basado en la búsqueda

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
      <h1 className="text-2xl font-bold mb-6">Directorio de asesores</h1>

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
        <OrdenDropdown sortOption={sortOption} setSortOption={setSortOption} />

        {/* Botón para abrir filtros */}
        <FiltrosAsesoresSheet
          appliedFiltersCount={
            filters.areasTematicas.length +
            filters.temasInteres.length +
            (filters.soloDisponible ? 1 : 0)
          }
          tempFilters={tempFilters}
          setTempFilters={setTempFilters}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          allAreaTematica={allAreaTematica}
          allTemasInteres={allTemasInteres}
          applyFilters={applyFilters}
          cancelFilters={cancelFilters}
        />
      </div>

      {/* Filtros aplicados */}
      <FiltrosAplicados filters={filters} setFilters={setFilters} />

      {/* Resultados */}
      <ResultadosAsesores
        asesores={asesores}
        paginatedAdvisors={paginatedAdvisors}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        soloDisponible={filters.soloDisponible}
        renderPaginationItems={renderPaginationItems}
      />
    </div>
  );
}
