// components/SolicitudesPendientes.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import { Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { SolicitudesTable } from "../components/coordinador/table-solicitudes-pagination";
import {
  filters,
  initialPagesList,
  pageSolicitudes,
} from "../types/solicitudes/constants";
import {
  fetchCarrerasMiembroComite,
  lenTemasPorCarrera,
  listarTemasPorCarrera,
} from "../types/solicitudes/data";
import { PagesList, TemasPages } from "../types/solicitudes/entities";
import { getSolicitudFromTema } from "../types/solicitudes/lib";
import { EstadoTemaNombre } from "../types/temas/enums";

type PagesListKey = keyof TemasPages;

const LIMIT = 2;

export default function SolicitudesPendientes() {
  const [estadoTema, setEstadoTema] = React.useState<EstadoTemaNombre>(
    EstadoTemaNombre.INSCRITO,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [loading, setLoading] = useState(false);

  const [temas, setTemas] = useState<PagesList>(initialPagesList);
  const [carrerasIds, setCarrerasIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCarrerasYPrimeraPagina() {
      try {
        setLoading(true);
        // Get CarrerasIds
        const carreras = await fetchCarrerasMiembroComite();
        const ids = (carreras || []).map((c) => c.id);
        setCarrerasIds(ids);

        if (ids.length > 0) {
          // Inicializar totalCounts
          await fetchTotalCounts(ids);

          // Cargar primera página
          await fetchData(estadoTema, 1, ids);
        }
      } catch (error) {
        console.log("No se pudo cargar las carreras del usuario: " + error);
      } finally {
        setLoading(false);
      }
    }

    fetchCarrerasYPrimeraPagina();
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Actualizar página actual
      updatePagesListKey(estadoTema, "current", newPage);
      // Fetch de la página en caso no exista
      const existingPage = temas[estadoTema]?.pages?.[newPage];
      if (!existingPage?.length) {
        setLoading(true);
        fetchData(estadoTema, newPage, carrerasIds);
      }
    },
    [estadoTema, temas, carrerasIds],
  );

  async function fetchData(
    status: EstadoTemaNombre,
    page: number,
    carrerasIds: number[],
  ) {
    try {
      if (carrerasIds && carrerasIds.length > 0) {
        const data = await listarTemasPorCarrera(
          carrerasIds[0], // TODO: Validar
          status,
          LIMIT,
          page - 1,
        );

        // Añadir nueva página
        setTemas((prev) => {
          const newPages = { ...prev[status].pages };
          newPages[page] = data;

          return {
            ...prev,
            [status]: {
              ...prev[status],
              pages: newPages,
            },
          };
        });
      }
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTotalCounts(carrerasIds: number[]) {
    try {
      // Asignar total Counts
      const estadosConPages: EstadoTemaNombre[] = Object.keys(
        temas,
      ) as EstadoTemaNombre[];
      for (const estado of estadosConPages) {
        const count = await lenTemasPorCarrera(carrerasIds[0], estado); // TODO: Debe traer un number
        // const count = 2;
        // console.log(estado + ": count = " + count);

        updatePagesListKey(estado, "totalCounts", count);
      }
    } catch (err) {
      console.error("Error loading total counts", err);
    }
  }

  function updatePagesListKey<T extends PagesListKey>(
    state: EstadoTemaNombre,
    key: T,
    value: TemasPages[T],
  ) {
    setTemas((prev) => ({
      ...prev,
      [state]: { ...prev[state], [key]: value },
    }));
  }

  function getPage(state: EstadoTemaNombre) {
    return temas[state].pages[temas[state].current] || [];
  }

  function handleTabChange(state: EstadoTemaNombre) {
    setEstadoTema(state);

    // Fetch de la página en caso no exista
    const currentPage = temas[state].current;
    const existingPage = temas[state]?.pages?.[currentPage];
    if (!existingPage?.length) {
      fetchData(state, currentPage, carrerasIds);
    }
  }

  return (
    <div className="space-y-8 mt-4">
      {/* Título general */}
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">
          {pageSolicitudes.title}
        </h1>
        <p className="text-muted-foreground">{pageSolicitudes.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Searchbar */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={filters.search.placeholder}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Selector tipo de tema */}
        <Select value={cursoFilter} onValueChange={setCursoFilter}>
          <SelectTrigger className="w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(filters.filterTipos).map(([key, filter]) => (
              <SelectItem key={key} value={key}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pestañas */}
      <Tabs
        value={estadoTema}
        onValueChange={(value) => handleTabChange(value as EstadoTemaNombre)}
      >
        <TabsList>
          {Object.entries(filters.temaEstados).map(([key, estado]) => (
            <TabsTrigger key={key} value={key}>
              {estado.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Card con tabla */}
      <Card>
        {/* Header */}
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              {
                filters.temaEstados[
                  estadoTema as keyof typeof filters.temaEstados
                ].title
              }
            </h2>
            <p className="text-sm text-muted-foreground">
              {
                filters.temaEstados[
                  estadoTema as keyof typeof filters.temaEstados
                ].description
              }
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {/* Solicitudes */}
          <SolicitudesTable
            solicitudes={getPage(estadoTema).map((p) =>
              getSolicitudFromTema(p, p.id),
            )} // TODO: Pasar todo y enviar filtro estadoTema
            isLoading={loading}
            searchQuery={searchQuery}
          />

          {/* Pagination */}
          {!loading && (
            <CessationRequestPagination
              currentPage={temas[estadoTema].current}
              totalPages={Math.ceil(temas[estadoTema].totalCounts / LIMIT)}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

