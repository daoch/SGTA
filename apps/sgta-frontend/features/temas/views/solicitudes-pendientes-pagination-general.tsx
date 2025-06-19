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
import { Search } from "lucide-react";
import { useState } from "react";
import { SolicitudesTableGeneral } from "../components/coordinador/table-solicitudes-general";
import {
  SolicitudGeneral,
  SolicitudState,
} from "../types/solicitudes/entities";

const viewTexts = {
  searchbar: {
    placeholder: "Buscar por nombre de solicitud ...",
  },
};

const stateTexts = {
  PENDIENTE: {
    title: "Pendientes",
    description: "Pendientes",
    label: "Pendientes",
  },
  RECHAZADA: {
    title: "Rechazados",
    description: "Rechazados",
    label: "Rechazados",
  },
  ACEPTADA: {
    title: "Aceptados",
    description: "Aceptados",
    label: "Aceptados",
  },
};

interface SolicitudesPendientesProps {
  readonly solicitudes: SolicitudGeneral[];
  readonly state: SolicitudState;
  readonly setState: React.Dispatch<React.SetStateAction<SolicitudState>>;
}

export default function SolicitudesPendientesGeneral({
  solicitudes,
  state,
  setState,
}: SolicitudesPendientesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Get Texts
  return (
    <div className="space-y-8 mt-4 flex flex-col overflow-auto">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* State Selector */}
        <Select
          value={state}
          onValueChange={(value) => setState(value as SolicitudState)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(stateTexts).map(([state, texts]) => (
              <SelectItem key={state} value={state}>
                {texts.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Searchbar */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={viewTexts.searchbar.placeholder}
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
            <h2 className="text-lg font-semibold">{stateTexts[state].title}</h2>
            <p className="text-sm text-muted-foreground">
              {stateTexts[state].description}
            </p>
          </div>
        </CardHeader>

        {/* Body */}
        <CardContent>
          <SolicitudesTableGeneral
            solicitudes={solicitudes.filter(
              (s) => s.estado_solicitud === state,
            )}
            loading={loading}
            searchQuery={searchQuery}
          />
        </CardContent>
      </Card>
    </div>
  );
}

