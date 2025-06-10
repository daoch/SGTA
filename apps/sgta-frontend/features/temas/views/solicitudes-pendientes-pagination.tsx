// components/SolicitudesPendientes.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SolicitudesTable } from "../components/coordinador/table-solicitudes-pagination";
import { pageTemasTexts, pageTexts } from "../types/solicitudes/constants";
import { PagesList } from "../types/solicitudes/entities";
import { getSolicitudFromTema } from "../types/solicitudes/lib";
import { Tema } from "../types/temas/entidades";
import { EstadoTemaNombre } from "../types/temas/enums";

interface SolicitudesPendientesProps {
  readonly fetchFirstPageAndSetTotalCounts: () => Promise<void>;
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
}

export default function SolicitudesPendientes({
  fetchFirstPageAndSetTotalCounts,
  estadoTema,
  handleTabChange,
  loading,
  getPage,
  temas,
  getTotalPages,
  handlePageChange,
}: SolicitudesPendientesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!temas[estadoTema] || temas[estadoTema].totalCounts === 0) {
      fetchFirstPageAndSetTotalCounts();
    }
  }, []);

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

