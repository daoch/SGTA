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
import { useAuthStore } from "@/features/auth/store/auth-store";
import axiosInstance from "@/lib/axios/axios-instance";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { useEffect, useState } from "react";
import "../../../features/revision/types/colors.css";
import { RevisionesTableJurado } from "../components/RevisionesTableJurado";
import { DocumentoAgrupado } from "../dtos/DocumentoAgrupado";
import { RevisionDocumentoRevisorDto } from "../dtos/RevisionDocumentoRevisorDto";

function agruparPorDocumento(data: RevisionDocumentoRevisorDto[]): DocumentoAgrupado[] {
  const mapa = new Map<number, DocumentoAgrupado>();
  data.forEach((item) => {
    if (!mapa.has(item.id)) {
      mapa.set(item.id, {
        id: item.id,
        entregable: item.entregable,
        titulo: item.titulo,
        curso: item.curso,
        porcentajeSimilitud: null, // No disponible para revisor
        porcentajeGenIA: null, // No disponible para revisor
        fechaEntrega: item.fechaEntrega,
        fechaLimiteEntrega: item.fechaLimiteEntrega,
        fechaRevision: item.fechaRevision,
        fechaLimiteRevision: item.fechaLimiteRevision,
        ultimoCiclo: item.ultimoCiclo,
        estado: item.estado,
        formatoValido: false, // No disponible para revisor
        citadoCorrecto: false, // No disponible para revisor
        urlDescarga: item.urlDescarga,
        estudiantes: [],
      });
    }
    mapa.get(item.id)!.estudiantes.push({
      nombre: item.estudiante,
      codigo: item.codigo,
    });
  });
  return Array.from(mapa.values());
}

const estados = [
  { value: "pendiente", label: "Pendientes" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "completada", label: "Completadas" },
  { value: "todas", label: "Todas" },
];

const RevisionRevisorPage = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [documentos, setDocumentos] = useState<DocumentoAgrupado[]>([]);

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }
        const response = await axiosInstance.get("/revision/revisor", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const agrupados = agruparPorDocumento(response.data);
        setDocumentos(agrupados);
      } catch (error) {
        console.error("Error al cargar los documentos:", error);
      }
    };
    fetchDocumentos();
  }, []);

  const cursosUnicos = Array.from(new Set(documentos.map(doc => doc.curso))).filter(Boolean);
  const defaultTab = estados[0].value;

  // Usa la tabla de jurado/revisor (ajusta si tienes una específica para revisor)
  const TableComponent = RevisionesTableJurado;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold " style={{ color: "#042354" }}>
            Módulo de Revisión (Revisor)
          </h1>
          <p className="text-muted-foreground">
            Documentos asignados para revisión
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
            {cursosUnicos.map((curso) => (
              <SelectItem key={curso} value={curso}>
                {curso}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            {estados.map((estado) => (
              <TabsTrigger key={estado.value} value={estado.value}>
                {estado.label}
              </TabsTrigger>
            ))}
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
        {estados.map((estado) => (
          <TabsContent key={estado.value} value={estado.value}>
            <Card>
              <CardHeader>
                <CardTitle>Documentos {estado.label}</CardTitle>
                <CardDescription>
                  Documentos filtrados por estado para revisores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "table" ? (
                  <TableComponent
                    data={documentos}
                    filter={estado.value === "todas" ? undefined : estado.value}
                    searchQuery={searchQuery}
                    cursoFilter={cursoFilter}
                  />
                ) : (
                  <div>Vista de tarjetas no implementada para revisor</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RevisionRevisorPage;
