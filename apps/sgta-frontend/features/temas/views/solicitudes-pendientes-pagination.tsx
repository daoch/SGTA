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
import { usePagination } from "@/hooks/temas/use-pagination";
import { Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { SolicitudesTable } from "../components/coordinador/table-solicitudes-pagination";
import { pageTemasTexts, pageTexts } from "../types/solicitudes/constants";
import {
  fetchCarrerasMiembroComite,
  lenTemasPorCarrera,
  listarTemasPorCarrera,
} from "../types/solicitudes/data";
import { getSolicitudFromTema } from "../types/solicitudes/lib";
import { EstadoTemaNombre } from "../types/temas/enums";

const LIMIT = 10;

export default function SolicitudesPendientes() {
  const [estadoTema, setEstadoTema] = React.useState<EstadoTemaNombre>(
    EstadoTemaNombre.INSCRITO,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [carrerasIds, setCarrerasIds] = useState<number[]>([]);
  const {
    pagination: temas,
    replaceStateKey,
    addNewPage,
    getPage,
    getTotalPages,
  } = usePagination(pageTemasTexts.initialPagesList, LIMIT);

  useEffect(() => {
    fetchFirstPageAndSetTotalCounts();
  }, []);

  async function fetchFirstPageAndSetTotalCounts() {
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
        await fetchPage(estadoTema, 1, ids);
      }
    } catch (error) {
      console.log("No se pudo cargar las carreras del usuario: " + error);
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Actualizar página actual
      replaceStateKey(estadoTema, "current", newPage);
      // Fetch de la página en caso no exista
      const existingPage = temas[estadoTema]?.pages?.[newPage];
      if (!existingPage?.length) {
        setLoading(true);
        fetchPage(estadoTema, newPage, carrerasIds);
      }
    },
    [estadoTema, temas, carrerasIds],
  );

  async function fetchPage(
    state: EstadoTemaNombre,
    page: number,
    carrerasIds: number[],
  ) {
    try {
      if (carrerasIds && carrerasIds.length > 0) {
        // Fetch page
        const data = await listarTemasPorCarrera(
          carrerasIds[0], // TODO: Validar
          state,
          LIMIT,
          (page - 1) * LIMIT, // Offset
        );

        // Add new page to State
        addNewPage(state, page, data);
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
      // Get all counts
      const counts = await Promise.all(
        estadosConPages.map((estado) =>
          lenTemasPorCarrera(carrerasIds[0], estado),
        ),
      );

      // Update state
      estadosConPages.forEach((estado, idx) => {
        replaceStateKey(estado, "totalCounts", counts[idx]);
        console.log(estado + ": count = " + counts[idx]);
      });
    } catch (err) {
      console.error("Error loading total counts", err);
    }
  }

  function handleTabChange(state: EstadoTemaNombre) {
    setEstadoTema(state);

    // Fetch de la página en caso no exista
    if (!temas[state]) return;
    const currentPage = temas[state].current;
    const existingPage = temas[state]?.pages?.[currentPage];
    if (!existingPage?.length) {
      fetchPage(state, currentPage, carrerasIds);
    }
  }

  return (
    <div className="space-y-8 mt-4">
      {/* Título general */}
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">{pageTexts.title}</h1>
        <p className="text-muted-foreground">{pageTexts.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Searchbar */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={pageTemasTexts.searhbar.placeholder}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Selector tipo de tema */}
        {/* <Select value={cursoFilter} onValueChange={setCursoFilter}>
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
        </Select> */}
      </div>

      {/* Tabs */}
      <Tabs
        value={estadoTema}
        onValueChange={(value) => handleTabChange(value as EstadoTemaNombre)}
      >
        <TabsList>
          {Object.entries(pageTemasTexts.states).map(([key, estado]) => (
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
                pageTemasTexts.states[
                  estadoTema as keyof typeof pageTemasTexts.states
                ].title
              }
            </h2>
            <p className="text-sm text-muted-foreground">
              {
                pageTemasTexts.states[
                  estadoTema as keyof typeof pageTemasTexts.states
                ].description
              }
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {/* Solicitudes */}
          <SolicitudesTable
            solicitudes={getPage(temas, estadoTema).map((p) =>
              getSolicitudFromTema(p, p.id),
            )} // TODO: Pasar todo y enviar filtro estadoTema
            isLoading={loading}
            searchQuery={searchQuery}
          />

          {/* Pagination */}
          {temas[estadoTema] && (
            <CessationRequestPagination
              currentPage={temas[estadoTema].current}
              totalPages={getTotalPages(temas, estadoTema)}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

