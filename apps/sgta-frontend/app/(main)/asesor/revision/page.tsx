"use client";

import { RevisionesCards } from "@/components/revision/revisiones-cards";
import { RevisionesTable } from "@/components/revision/revisiones-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import React, { useState } from "react";
import "./colors.css";

const Page: React.FC = () => {

  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [cursoFilter, setCursoFilter] = useState("todos")

  return (
    <div className="space-y-6" >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pucp-blue">Módulo de Revisión</h1>
          <p className="text-muted-foreground">Detección de plagio y verificación de normas APA</p>
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
            <SelectItem value="tesis1">Proyecto de Fin de Carrera 1 (1INF42)</SelectItem>
            <SelectItem value="tesis2">Proyecto de Fin de Carrera 2 (1INF46)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pendientes" className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="en-proceso">En Proceso</TabsTrigger>
            <TabsTrigger value="completadas">Completadas</TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
          </TabsList>

          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "bg-pucp-blue hover:bg-pucp-light" : ""}
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">Vista de tabla</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={viewMode === "cards" ? "bg-pucp-blue hover:bg-pucp-light" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Vista de tarjetas</span>
            </Button>
          </div>
        </div>

        <TabsContent value="pendientes">
          <Card>
            <CardHeader>
              <CardTitle>Revisiones Pendientes</CardTitle>
              <CardDescription>Documentos que requieren revisión</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable filter="pendiente" searchQuery={searchQuery} cursoFilter={cursoFilter} />
              ) : (
                <RevisionesCards filter="pendiente" searchQuery={searchQuery} cursoFilter={cursoFilter} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="en-proceso">
          <Card>
            <CardHeader>
              <CardTitle>Revisiones En Proceso</CardTitle>
              <CardDescription>Documentos que están siendo revisados actualmente</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable filter="en-proceso" searchQuery={searchQuery} cursoFilter={cursoFilter} />
              ) : (
                <RevisionesCards filter="en-proceso" searchQuery={searchQuery} cursoFilter={cursoFilter} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completadas">
          <Card>
            <CardHeader>
              <CardTitle>Revisiones Completadas</CardTitle>
              <CardDescription>Documentos que ya han sido revisados</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable filter="completada" searchQuery={searchQuery} cursoFilter={cursoFilter} />
              ) : (
                <RevisionesCards filter="completada" searchQuery={searchQuery} cursoFilter={cursoFilter} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Revisiones</CardTitle>
              <CardDescription>Lista completa de revisiones</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTable searchQuery={searchQuery} cursoFilter={cursoFilter} />
              ) : (
                <RevisionesCards searchQuery={searchQuery} cursoFilter={cursoFilter} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
