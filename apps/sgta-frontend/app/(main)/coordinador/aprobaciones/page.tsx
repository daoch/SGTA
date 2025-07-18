"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTodasSolicitudesPendientes } from "@/features/temas/types/solicitudes/data";
import {
  SolicitudGeneral,
  SolicitudState,
} from "@/features/temas/types/solicitudes/entities";
import SolicitudesPendientes from "@/features/temas/views/solicitudes-pendientes-pagination";
import SolicitudesPendientesGeneral from "@/features/temas/views/solicitudes-pendientes-pagination-general";
import { usePaginationTemas } from "@/hooks/temas/coordinador/use-pagination-temas";
import React, { useEffect, useState } from "react";

enum TypeView {
  Tema = "tema",
  Solicitud = "solicitud",
}

const texts = {
  [TypeView.Tema]: {
    label: "Aprobación de temas",
    title: "Aprobaciones",
    description: "Gestión de solicitudes de cambios en tesis",
  },
  [TypeView.Solicitud]: {
    label: "Solicitudes de cambios",
    title: "Solicitudes de cambios de tesis",
    description: "Gestión de solicitudes de cambios en tesis",
  },
};

const Page: React.FC = () => {
  // General
  const [selectedTab, setSelectedTab] = useState<TypeView>(TypeView.Tema);

  const onTabChange = (tab: TypeView) => {
    setSelectedTab(tab as TypeView);
  };

  // Tema Solicitudes
  const paginationTemas = usePaginationTemas();

  // General Solicitudes
  const [stateGeneral, setStateGeneral] = useState<SolicitudState>("PENDIENTE");
  const [solicitudesGenerales, setSolicitudesGenerales] = useState<
    SolicitudGeneral[]
  >([]);

  async function fetchSolicitudesGenerales(
    offset: number = 0,
    limit: number = 100,
  ) {
    try {
      const data = await fetchTodasSolicitudesPendientes(offset, limit);
      setSolicitudesGenerales(data);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
      throw error;
    }
  }

  useEffect(() => {
    if (selectedTab === TypeView.Solicitud) {
      fetchSolicitudesGenerales();
    }
  }, [selectedTab]);

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(tab) => onTabChange(tab as TypeView)}
      className="w-full"
    >
      {/* Tabs List */}
      <TabsList className="w-full mb-2">
        {Object.entries(texts).map(([tab, { label }]) => (
          <TabsTrigger key={tab} value={tab}>
            <span className="flex items-center gap-2">
              <span>{label}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Título general */}
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">
          {texts[selectedTab].title}
        </h1>
        <p className="text-muted-foreground">
          {texts[selectedTab].description}
        </p>
      </div>

      {/* Content */}
      <TabsContent value={TypeView.Tema}>
        <SolicitudesPendientes
          fetchAllPagesState={paginationTemas.fetchAllPagesState}
          estadoTema={paginationTemas.estadoTema}
          handleTabChange={paginationTemas.handleTabChange}
          loading={paginationTemas.loading}
          getPage={paginationTemas.getPage}
          temas={paginationTemas.temas}
          getTotalPages={paginationTemas.getTotalPages}
          handlePageChange={paginationTemas.handlePageChange}
          limit={paginationTemas.LIMIT}
        />
      </TabsContent>
      <TabsContent value={TypeView.Solicitud}>
        <SolicitudesPendientesGeneral
          solicitudes={solicitudesGenerales}
          state={stateGeneral}
          setState={setStateGeneral}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Page;

