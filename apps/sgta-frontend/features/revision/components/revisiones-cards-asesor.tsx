"use client";

import { CheckCircle, Eye, FileText, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const revisionesData = [
  {
    id: "1",
    titulo:
      "Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real",
    entregable: "E4",
    estudiante: "Carlos Mendoza",
    codigo: "20180123",
    curso: "1INF42",
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
    curso: "1INF46",
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
    curso: "1INF42",
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
];

interface RevisionesCardsAsesorProps {
  filter?: string;
  searchQuery?: string;
  cursoFilter?: string;
}

export function RevisionesCardsAsesor({
  filter,
  searchQuery = "",
  cursoFilter = "todos",
}: RevisionesCardsAsesorProps) {
  // Filtrar las revisiones según los criterios
  let revisionesFiltradas = revisionesData;

  // Filtrar por estado
  if (filter) {
    revisionesFiltradas = revisionesFiltradas.filter(
      (revision) => revision.estado === filter,
    );
  }

  // Filtrar por curso
  if (cursoFilter !== "todos") {
    revisionesFiltradas = revisionesFiltradas.filter(
      (revision) => revision.curso === cursoFilter,
    );
  }

  // Filtrar por búsqueda (nombre de estudiante o código)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    revisionesFiltradas = revisionesFiltradas.filter(
      (revision) =>
        revision.estudiante.toLowerCase().includes(query) ||
        revision.codigo.includes(query),
    );
  }

  return (
    <div>
      {revisionesFiltradas.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay revisiones disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revisionesFiltradas.map((revision) => (
            <Card key={revision.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className={
                      revision.estado === "revisado"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : revision.estado === "aprobado"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {revision.estado === "revisado"
                      ? "Revisado"
                      : revision.estado === "aprobado"
                        ? "Aprobado"
                        : "Por Aprobar"}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100">
                    {revision.curso === "1INF42" ? "1INF42" : "1INF46"}
                  </Badge>
                </div>
                <CardTitle className="text-base font-medium mt-2 line-clamp-2">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                    <span>{revision.titulo}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{revision.estudiante}</p>
                    <p className="text-xs text-muted-foreground">
                      {revision.codigo}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fecha Límite:</span>
                    <span className="text-sm font-medium">
                      {revision.fechaLimite &&
                        new Date(revision.fechaLimite).toLocaleDateString()}
                    </span>
                  </div>

                  {revision.porcentajePlagio !== null && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Generación de Inteligencia Artificial:</span>
                        <span
                          className={
                            revision.porcentajePlagio > 20
                              ? "text-red-600 font-medium"
                              : revision.porcentajePlagio > 10
                                ? "text-yellow-600 font-medium"
                                : "text-green-600 font-medium"
                          }
                        >
                          {revision.porcentajePlagio}%
                        </span>
                      </div>
                    </div>
                  )}

                  {revision.observaciones > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Observaciones:</span>
                      <Badge variant="outline" className="bg-gray-100">
                        {revision.observaciones}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Link href={`/revision/${revision.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Detalles
                  </Button>
                </Link>
                <Link href={`/revision/revisar/${revision.id}`}>
                  <Button
                    size="sm"
                    className={
                      revision.estado === "revisado"
                        ? "bg-green-600 hover:bg-green-700"
                        : revision.estado === "aprobado"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-yellow-600 hover:bg-pucp-light"
                    }
                  >
                    {revision.estado === "revisado" ? (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Revisado
                      </>
                    ) : revision.estado === "aprobado" ? (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprobado
                      </>
                    ) : (
                      <>
                        <Search className="mr-1 h-4 w-4" />
                        Por Aprobar
                      </>
                    )}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
