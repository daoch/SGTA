"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemasTable } from "../components/asesor/temas-table";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";

enum TabValues {
  INFO = "informacion",
  HISTORIAL = "libre",
  DETALLE_EXPO = "interesado",
}

const DetalleTemasCoordinadorPage = () => {
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
          <TabsTrigger value={TabValues.DETALLE_EXPO}>
            Detalle de Exposiciones
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TabValues.INFO}>
          <Card>
            <CardHeader>
              <CardTitle>Todos los temas</CardTitle>
              <CardDescription>
                Lista de todos los temas de tesis
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.HISTORIAL}>
          <Card>
            <CardHeader>
              <CardTitle>Temas inscritos</CardTitle>
              <CardDescription>
                Temas de tesis en los que estás inscrito
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.DETALLE_EXPO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas libres</CardTitle>
              <CardDescription>
                Temas de tesis disponibles para postular
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalleTemasCoordinadorPage;
