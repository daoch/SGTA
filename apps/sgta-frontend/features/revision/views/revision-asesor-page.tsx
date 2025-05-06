"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevisionesCards } from "@/features/revision/components/revisiones-cards";
import { RevisionesTable } from "@/features/revision/components/revisiones-table";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { useState } from "react";
import "../../../app/(main)/asesor/revision/colors.css";

const RevisionAsesorPage = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold " style={{ color: "#042354" }}>
            Módulo de Revisión
          </h1>
          <p className="text-muted-foreground">
            Detección de plagio y verificación de normas APA
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por estudiante o código"
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={cursoFilter} onValueChange={setCursoFilter}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los cursos</SelectItem>
            <SelectItem value="tesis1">
              Proyecto de Fin de Carrera 1 (1INF42)
            </SelectItem>
            <SelectItem value="tesis2">
              Proyecto de Fin de Carrera 2 (1INF46)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="por-aprobar" className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="por-aprobar">Por Aprobar</TabsTrigger>
            <TabsTrigger value="aprobados">Aprobados</TabsTrigger>
            <TabsTrigger value="revisados">Revisados</TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
          </TabsList>

          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={
                viewMode === "table" ? "bg-pucp-blue hover:bg-pucp-light" : ""
              }
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">Vista de tabla</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={
                viewMode === "cards" ? "bg-pucp-blue hover:bg-pucp-light" : ""
              }
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Vista de tarjetas</span>
            </Button>
          </div>
        </div>

        <TabsContent value="por-aprobar">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Por Aprobar</CardTitle>
              <CardDescription>
                Documentos que están pendientes de aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable
                  filter="Por Aprobar"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCards
                  filter="Por Aprobar"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="aprobados">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Aprobados</CardTitle>
              <CardDescription>
                Documentos que ya han sido aprobados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable
                  filter="Aprobado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCards
                  filter="Aprobado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revisados">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Revisados</CardTitle>
              <CardDescription>
                Documentos que ya han sido revisados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable
                  filter="Revisado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCards
                  filter="Revisado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todos los Documentos</CardTitle>
              <CardDescription>Lista completa de documentos</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCards
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevisionAsesorPage;
