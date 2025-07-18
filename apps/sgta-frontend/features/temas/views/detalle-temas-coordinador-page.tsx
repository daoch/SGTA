"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Tema } from "../types/temas/entidades";

import { TemasDetalleExposiciones } from "@/features/jurado/components/temas-detalle-exposiciones";
import { EstadoTemaNombre } from "../types/temas/enums";
import { DetalleTema } from "../components/asesor/detalle-tema-card";
import HistorialTemaCard from "../components/asesor/historial-tema-card";

enum TabValues {
  INFO = "informacion",
  HISTORIAL = "libre",
  DETALLE_EXPO = "interesado",
}

interface DetalleTemasCoordinadorPageProps {
  tema: Tema | null;
  setTema: React.Dispatch<React.SetStateAction<Tema | null>>;
  loading: boolean;
}

const DetalleTemasCoordinadorPage: React.FC<
  DetalleTemasCoordinadorPageProps
> = ({ tema, setTema, loading }) => {
  const [position, setPosition] = React.useState("bottom");

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Detalles del tema</h1>
      </div>

      <Tabs defaultValue={TabValues.INFO} className="w-full">
        <TabsList>
          <TabsTrigger value={TabValues.INFO}>Información</TabsTrigger>
          <TabsTrigger value={TabValues.HISTORIAL}>
            Historial de Cambios
          </TabsTrigger>
          {tema?.estadoTemaNombre === EstadoTemaNombre.EN_PROGRESO && (
            <TabsTrigger value={TabValues.DETALLE_EXPO}>
              Detalle de Exposiciones
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value={TabValues.INFO}>
          <Card>
            {/* <CardHeader>
              <CardTitle>Todos los temas</CardTitle>
              <CardDescription>
                Lista de todos los temas de tesis
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              {tema ? (
                <DetalleTema tema={tema} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay tema seleccionado.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.HISTORIAL}>
          <Card>
            {/* <CardHeader>
              <CardTitle>Temas inscritos</CardTitle>
              <CardDescription>
                Temas de tesis en los que estás inscrito
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              {tema ? (
                <HistorialTemaCard idTema={tema.id} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay tema seleccionado.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.DETALLE_EXPO}>
          <Card>
            {/* <CardHeader>
              <CardTitle>Temas libres</CardTitle>
              <CardDescription>
                Temas de tesis disponibles para postular
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              {tema ? (
                <TemasDetalleExposiciones
                  temaId={tema.id}
                  carreraId={tema.carrera?.id}
                  areasConocimientoId={tema.subareas.map(
                    (subarea) => subarea.areaConocimiento!.id,
                  )}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay tema seleccionado.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalleTemasCoordinadorPage;

