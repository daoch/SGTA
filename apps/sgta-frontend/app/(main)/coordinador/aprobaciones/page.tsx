"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SolicitudesPendientes from "@/features/temas/views/solicitudes-pendientes-pagination";
import React, { useState } from "react";
import { usePaginationTemas } from "@/hooks/temas/coordinador/use-pagination-temas";

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
  const [selectedTab, setSelectedTab] = useState<TypeView>(TypeView.Tema);
  const paginationTemas = usePaginationTemas();

  const onTabChange = (tab: TypeView) => {
    setSelectedTab(tab as TypeView);
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(tab) => onTabChange(tab as TypeView)}
      className="w-full"
    >
      {/* Tabs List */}
      <TabsList>
        {Object.entries(texts).map(([tab, { label }]) => (
          <TabsTrigger key={tab} value={tab}>
            <span className="flex items-center gap-2">
              <span>{label}</span>
              <Badge variant="secondary">
                {paginationTemas.temas.INSCRITO?.totalCounts || 0}
              </Badge>
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
        {/* Aquí puedes renderizar el contenido de solicitudes de cambios */}
      </TabsContent>
    </Tabs>
  );
};

export default Page;

