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
import React, { useState } from "react";
import { SolicitudesTable } from "../components/coordinador/table-solicitudes";
import { filters, pageSolicitudes } from "../types/solicitudes/constants";
import { SolicitudPendiente } from "../types/solicitudes/entities";
import { EstadoSolicitud } from "../types/solicitudes/enums";

interface SolicitudesPendientesProps {
  readonly solicitudes: SolicitudPendiente[];
  readonly loading: boolean;
}

export default function SolicitudesPendientes({
  solicitudes,
  loading,
}: SolicitudesPendientesProps) {
  const [estadoSolicitud, setEstadoSolicitud] = React.useState<EstadoSolicitud>(
    EstadoSolicitud.PENDIENTE,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");

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
        value={estadoSolicitud}
        onValueChange={(value) => setEstadoSolicitud(value as EstadoSolicitud)}
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
              {filters.temaEstados[estadoSolicitud].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filters.temaEstados[estadoSolicitud].description}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {/* Solicitudes */}
          <SolicitudesTable
            solicitudes={solicitudes}
            filter={estadoSolicitud}
            isLoading={loading}
            searchQuery={searchQuery}
          />

          {/* Pagination */}
          {!loading && (
            <CessationRequestPagination
              currentPage={1}
              totalPages={2}
              onPageChange={() => {}}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

