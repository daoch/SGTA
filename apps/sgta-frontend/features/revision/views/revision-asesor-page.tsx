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
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { useState } from "react";
import "../../../features/revision/types/colors.css";
import { RevisionesCardsAsesor } from "../components/revisiones-cards-asesor";
import { RevisionesTableAsesor } from "../components/revisiones-table-asesor";
import { RevisionResumen } from "../types/RevisionResumen.types";

const revisionesData: RevisionResumen[] = [
  {
    id: "1",
    titulo:
      "Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real",
    entregable: "E4",
    estudiante: "Carlos Mendoza",
    codigo: "20180123",
    curso: "tesis1",
    fechaEntrega: "2023-10-15",
    fechaLimite: "2023-10-20",
    estado: "aprobado",
    porcentajePlagio: 5,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: 3,
    ultimoCiclo: "2025-1",
  },
  {
    id: "2",
    titulo:
      "Desarrollo de un sistema de monitoreo de calidad del aire utilizando IoT",
    entregable: "E4",
    estudiante: "Ana García",
    codigo: "20190456",
    curso: "tesis1",
    fechaEntrega: "2023-11-02",
    fechaLimite: "2023-11-05",
    estado: "por-aprobar",
    porcentajePlagio: 12,
    formatoValido: false,
    entregaATiempo: true,
    citadoCorrecto: false,
    observaciones: 7,
    ultimoCiclo: "2025-1",
  },
  {
    id: "3",
    titulo:
      "Análisis comparativo de frameworks de desarrollo web para aplicaciones de alta concurrencia",
    entregable: "E4",
    estudiante: "Luis Rodríguez",
    codigo: "20180789",
    curso: "tesis2",
    fechaEntrega: "2023-09-28",
    fechaLimite: "2023-10-01",
    estado: "aprobado",
    porcentajePlagio: 8,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: 2,
    ultimoCiclo: "2025-1",
  },
  {
    id: "4",
    titulo:
      "Diseño e implementación de un sistema de recomendación basado en filtrado colaborativo",
    entregable: "E4",
    estudiante: "María Torres",
    codigo: "20190321",
    curso: "tesis2",
    fechaEntrega: null,
    fechaLimite: "2023-11-25",
    estado: "revisado",
    porcentajePlagio: null,
    formatoValido: null,
    entregaATiempo: null,
    citadoCorrecto: null,
    observaciones: 0,
    ultimoCiclo: "2024-2",
  },
  {
    id: "5",
    titulo:
      "Optimización de consultas en bases de datos NoSQL para aplicaciones de big data",
    entregable: "E4",
    estudiante: "Jorge Sánchez",
    codigo: "20180654",
    curso: "tesis1",
    fechaEntrega: "2023-11-10",
    fechaLimite: "2023-11-08",
    estado: "revisado",
    porcentajePlagio: 15,
    formatoValido: true,
    entregaATiempo: false,
    citadoCorrecto: true,
    observaciones: 5,
    ultimoCiclo: "2023-2",
  },
  {
    id: "6",
    titulo: "Evaluación del impacto del uso de energías renovables en zonas rurales",
    entregable: "E4",
    estudiante: "Lucía Fernández",
    codigo: "20190567",
    curso: "tesis2",
    fechaEntrega: "2023-11-12",
    fechaLimite: "2023-11-10",
    estado: "rechazado",
    porcentajePlagio: 28,
    formatoValido: true,
    entregaATiempo: false,
    citadoCorrecto: false,
    observaciones: 6,
    ultimoCiclo: "2025-1",
  },
];

const RevisionAsesorPage = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
            <TabsTrigger value="rechazados">Rechazados</TabsTrigger>
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
                <RevisionesTableAsesor
                  data={revisionesData}
                  filter="por-aprobar"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCardsAsesor
                  data={revisionesData}
                  filter="por-aprobar"
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
                Documentos que han sido aprobados por el asesor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTableAsesor
                  data={revisionesData}
                  filter="aprobado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCardsAsesor
                  data={revisionesData}
                  filter="aprobado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rechazados">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Rechazados</CardTitle>
              <CardDescription>
                Documentos que han sido rechazados por el asesor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "table" ? (
                <RevisionesTableAsesor
                  data={revisionesData}
                  filter="rechazado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCardsAsesor
                  data={revisionesData}
                  filter="rechazado"
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
                <RevisionesTableAsesor
                  data={revisionesData}
                  filter="revisado"
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCardsAsesor
                  data={revisionesData}
                  filter="revisado"
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
                <RevisionesTableAsesor
                  data={revisionesData}
                  searchQuery={searchQuery}
                  cursoFilter={cursoFilter}
                />
              ) : (
                <RevisionesCardsAsesor
                  data={revisionesData}
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
