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
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/features/auth";
import FiltrosAsesoresSheet from "../components/directorio/filtros-asesores";
import FiltrosAplicados from "../components/directorio/filtros-seleccionados";
import OrdenDropdown, {
  type SortOption,
} from "../components/directorio/orden-dropdown-directorio";
import ResultadosAsesores from "../components/directorio/resultados-busqueda";
import { getAsesoresPorFiltros } from "../services/directorio-services";
import {
  getIdByCorreo,
  listarAreasTematicas,
  listarTemasInteres,
} from "../services/perfil-services";
import type {
  AreaTematica,
  Asesor,
  TemaInteres,
} from "../types/perfil/entidades";

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
  const [sortAscending, setSortAscending] = useState(true);
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
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  // Estados para las búsquedas en los filtros

  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [allAreaTematica, setAllAreasTematicas] = useState<AreaTematica[]>([]);
  const [allTemasInteres, setAllTemasInteres] = useState<TemaInteres[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  const loadUsuarioId = async () => {
    if (!user) return;

    setIsLoadingPage(true);

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
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetchedId.current) {
      hasFetchedId.current = true;
      loadUsuarioId();
    }
  }, [user]);

  const fetchAsesores = async () => {
    setIsLoadingResults(true);
    if (!userId) return;
    try {
      const data = await getAsesoresPorFiltros(
        {
          alumnoId: userId,
          cadenaBusqueda: searchQuery,
          activo: filters.soloDisponible,
          idAreas: filters.areasTematicas.map((a) => a.idArea),
          idTemas: filters.temasInteres.map((t) => t.idTema),
        },
        currentPage - 1,
        sortAscending,
      );
      setAsesores(data.content);
      setTotalResults(data.totalElements);
      setTotalPages(Math.ceil(data.totalElements / itemsPerPage));
    } catch (error) {
      console.error("Error al cargar asesores:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Inicializar asesores cuando cambie userId, filtros, searchQuery o currentPage
  useEffect(() => {
    if (!userId) return;
    fetchAsesores();
  }, [userId, filters, searchQuery, currentPage, sortAscending]);

  // Resetear a página 1 cuando cambien filtros o búsqueda (pero no cuando cambie currentPage)
  useEffect(() => {
    if (!userId) return;
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

  useEffect(() => {
    // Si se cambia el sortOption, reiniciar a la primera página
    setCurrentPage(1);
    // Si se cambia el sortOption, invertir el orden
    if (sortOption === "default") {
      setSortAscending(true);
    } else if (sortOption === "name-asc") {
      setSortAscending(true);
    } else if (sortOption === "name-desc") {
      setSortAscending(false);
    }
  }, [sortOption]);

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

  if (isLoadingPage) {
    return (
      <div className="container mx-auto py-6 max-w-6xl">
        <p>Cargando...</p>
      </div>
    );
  }

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
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        setCurrentPage={setCurrentPage}
        soloDisponible={filters.soloDisponible}
        renderPaginationItems={renderPaginationItems}
        isLoadingResults={isLoadingResults}
      />
    </div>
  );
}
