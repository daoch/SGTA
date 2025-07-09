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
import { RevisionesCardsAsesor } from "../components/revisiones-cards-asesor";
import { RevisionesTableAsesor } from "../components/revisiones-table-asesor";
import { RevisionesTableJurado } from "../components/RevisionesTableJurado";
import { DocumentoAgrupado } from "../dtos/DocumentoAgrupado";
import { RevisionDocumentoAsesorDto } from "../dtos/RevisionDocumentoAsesorDto";

function agruparPorDocumento(data: RevisionDocumentoAsesorDto[]): DocumentoAgrupado[] {
  const mapa = new Map<number, DocumentoAgrupado>();

  data.forEach((item) => {
    if (!mapa.has(item.id)) {
      mapa.set(item.id, {
        id: item.id,
        titulo: item.titulo,
        entregable: item.entregable,
        curso: item.curso,
        porcentajeSimilitud: item.porcentajeSimilitud,
        porcentajeGenIA: item.porcentajeGenIA,
        fechaEntrega: item.fechaEntrega,
        fechaLimiteEntrega: item.fechaLimiteEntrega,
        fechaRevision: item.fechaRevision,
        fechaLimiteRevision: item.fechaLimiteRevision,
        ultimoCiclo: item.ultimoCiclo,
        estado: item.estado,
        formatoValido: item.formatoValido,
        citadoCorrecto: item.citadoCorrecto,
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

const RevisionJuradoPage = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [documentos, setDocumentos] = useState<DocumentoAgrupado[]>([]);

  useEffect(() => {
  const fetchDocumentos = async () => {
    try {
      const { idToken } = useAuthStore.getState();
      console.log(idToken);
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }

      const response = await axiosInstance.get("/revision/jurado", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      console.log("Response data:", response.data);
      const agrupados = agruparPorDocumento(response.data);
      setDocumentos(agrupados);
      console.log("Documentos del jurado cargados:", agrupados);
    } catch (error) {
      console.error("Error al cargar los documentos del jurado:", error);
    }
  };

  fetchDocumentos();
}, []);
const documentosFiltrados = (estado: string) => {
  return documentos.filter(doc => doc.estado === estado);
};

  const cursosUnicos = Array.from(new Set(documentos.map(doc => doc.curso))).filter(Boolean);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold " style={{ color: "#042354" }}>
            Módulo de Revisión
          </h1>
          <p className="text-muted-foreground">
            Detección de similitud de contenido y revisión
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

      <Tabs defaultValue="pendientes" className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="en_proceso">En Proceso</TabsTrigger>
            <TabsTrigger value="completados">Completados</TabsTrigger>
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

        <TabsContent value="pendientes">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Por Revisar</CardTitle>
              <CardDescription>
                Documentos que están pendientes de aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevisionesTableJurado
                data={documentos}
                filter={["aprobado"]} // Filtramos por ambos estados
                searchQuery={searchQuery}
                cursoFilter={cursoFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="en_proceso">
          <Card>
            <CardHeader>
              <CardTitle>Documentos en proceso</CardTitle>
              <CardDescription>
                Documentos que estan en proceso de revisión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevisionesTableJurado
                data={documentos}
                filter={["por_aprobar", "aprobado"]} // Filtramos por ambos estados
                searchQuery={searchQuery}
                cursoFilter={cursoFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completados">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Revisados</CardTitle>
              <CardDescription>
                Documentos que han sido rechazados por el asesor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevisionesTableJurado
                data={documentosFiltrados("revisado")}
                searchQuery={searchQuery}
                cursoFilter={cursoFilter}
              />
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
              <RevisionesTableJurado
                data={documentos}
                searchQuery={searchQuery}
                cursoFilter={cursoFilter}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevisionJuradoPage;