"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemasTable } from "../components/asesor/temas-table";
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";

enum TabValues {
  TODOS = "todos",
  INSCRITOS = "inscrito",
  LIBRES = "libre",
  INTERESADOS = "interesado",
}

const TemasCoordinadorPage = () => {
  const [position, setPosition] = React.useState("bottom")

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Temas Inscritos</h1>
        <p className="text-muted-foreground">
          Gestión de temas de tesis inscritos en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <Input placeholder="Buscar por título, estudiante o asesor..."/>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Todos los ciclos</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Todas las áreas</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <TemasTable filter={TabValues.INSCRITOS} showPostulaciones = {false} showTipo = {false}/>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemasCoordinadorPage;
