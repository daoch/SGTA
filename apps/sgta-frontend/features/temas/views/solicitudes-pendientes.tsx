// components/SolicitudesPendientes.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolicitudPendiente } from "../types/solicitudes/entities";
import { EstadoSolicitud } from "../types/solicitudes/enums";
import { SolicitudesTable } from "../components/coordinador/table-solicitudes";

interface SolicitudesPendientesProps {
  readonly solicitudes: SolicitudPendiente[];
  readonly loading: boolean;
}

export default function SolicitudesPendientes({
  solicitudes,
  loading,
}: SolicitudesPendientesProps) {
  const [currentTab, setCurrentTab] = React.useState<EstadoSolicitud>(
    EstadoSolicitud.PENDIENTE,
  );

  const titles: Record<EstadoSolicitud, string> = {
    [EstadoSolicitud.PENDIENTE]: "Solicitudes Pendientes",
    [EstadoSolicitud.ACEPTADA]: "Solicitudes Aprobadas",
    [EstadoSolicitud.RECHAZADA]: "Solicitudes Rechazadas",
    [EstadoSolicitud.OBSEVADA]: "Solicitudes Observadas",
  };

  const descriptions: Record<EstadoSolicitud, string> = {
    [EstadoSolicitud.PENDIENTE]:
      "Solicitudes de cambios que requieren aprobación",
    [EstadoSolicitud.ACEPTADA]: "Solicitudes de cambios que han sido aprobadas",
    [EstadoSolicitud.RECHAZADA]:
      "Solicitudes de cambios que han sido rechazadas",
    [EstadoSolicitud.OBSEVADA]:
      "Solicitudes de cambios que quedaron observadas",
  };

  return (
    <div className="space-y-8 mt-4">
      {/* Título general */}
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Aprobaciones</h1>
        <p className="text-muted-foreground">
          Gestión de solicitudes de cambios en tesis
        </p>
      </div>

      {/* Pestañas */}
      <Tabs
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as EstadoSolicitud)}
      >
        <TabsList>
          <TabsTrigger value={EstadoSolicitud.PENDIENTE}>
            Pendientes
          </TabsTrigger>
          <TabsTrigger value={EstadoSolicitud.ACEPTADA}>Aprobadas</TabsTrigger>
          <TabsTrigger value={EstadoSolicitud.RECHAZADA}>
            Rechazadas
          </TabsTrigger>
          <TabsTrigger value={EstadoSolicitud.OBSEVADA}>Observadas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Card con tabla */}
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{titles[currentTab]}</h2>
            <p className="text-sm text-muted-foreground">
              {descriptions[currentTab]}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Cargando solicitudes...</div>
          ) : (
            <SolicitudesTable solicitudes={solicitudes} filter={currentTab} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

