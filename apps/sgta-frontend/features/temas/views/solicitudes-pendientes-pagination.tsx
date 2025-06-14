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
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SolicitudesTable } from "../components/coordinador/table-solicitudes-pagination";
import { pageTemasTexts } from "../types/solicitudes/constants";
import { PagesList } from "../types/solicitudes/entities";
import { getSolicitudFromTema } from "../types/solicitudes/lib";
import { Tema } from "../types/temas/entidades";
import { EstadoTemaNombre } from "../types/temas/enums";

interface SolicitudesPendientesProps {
  readonly fetchAllPagesState: (
    state: EstadoTemaNombre,
    current?: number,
    carrerasIdsParam?: number[],
  ) => Promise<void>;
  readonly estadoTema: EstadoTemaNombre;
  readonly handleTabChange: (state: EstadoTemaNombre) => void;
  readonly loading: boolean;
  readonly getPage: (pagesList: PagesList, state: EstadoTemaNombre) => Tema[];
  readonly temas: PagesList;
  readonly getTotalPages: (
    pagesList: PagesList,
    state: EstadoTemaNombre,
  ) => number;
  readonly handlePageChange: (page: number) => void;
  readonly limit: number;
}

export default function SolicitudesPendientes({
  fetchAllPagesState,
  estadoTema,
  handleTabChange,
  loading,
  getPage,
  temas,
  getTotalPages,
  handlePageChange,
  limit,
}: SolicitudesPendientesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!temas[estadoTema] || temas[estadoTema].totalCounts === 0) {
      fetchAllPagesState(estadoTema);
    }
  }, []);

  // Get Texts
  const { title, description } =
    pageTemasTexts.states[estadoTema as keyof typeof pageTemasTexts.states];
  return (
    <div className="space-y-8 mt-4 flex flex-col overflow-auto">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Selector de estado */}
        <Select
          value={estadoTema}
          onValueChange={(value) => handleTabChange(value as EstadoTemaNombre)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(pageTemasTexts.states).map(([key, estado]) => (
              <SelectItem key={key} value={key}>
                {estado.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
      </div>

      {/* Table */}
      <Card className="flex flex-col flex-1">
        {/* Header */}
        <CardHeader className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {/* Pagination */}
          <div>
            {temas[estadoTema] && (
              <CessationRequestPagination
                currentPage={temas[estadoTema].current}
                totalPages={getTotalPages(temas, estadoTema)}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </CardHeader>

        {/* Solicitudes */}
        <CardContent>
          <SolicitudesTable
            solicitudes={getPage(temas, estadoTema).map((p) =>
              getSolicitudFromTema(p, p.id),
            )}
            isLoading={loading}
            searchQuery={searchQuery}
            limit={limit}
          />
        </CardContent>
      </Card>
    </div>
  );
}

