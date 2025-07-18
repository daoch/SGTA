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
import { DocumentoAgrupado } from "../dtos/DocumentoAgrupado";

interface RevisionesCardsRevisorProps {
  data: DocumentoAgrupado[];
  filter?: string;
  searchQuery?: string;
  cursoFilter?: string;
}

export function RevisionesCardsRevisor({
  data,
  filter,
  searchQuery = "",
  cursoFilter = "todos",
}: RevisionesCardsRevisorProps) {
  // Filtrar las revisiones según los criterios
  let revisionesFiltradas = data;

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

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    revisionesFiltradas = revisionesFiltradas.filter((revision) =>
      revision.titulo.toLowerCase().includes(query) ||
      revision.estudiantes.some(
        (est) =>
          est.nombre.toLowerCase().includes(query) ||
          est.codigo.includes(query)
      )
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
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={"bg-purple-100"}
                    >
                      {revision.entregable}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        revision.estado === "completada"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : revision.estado === "en_proceso"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : revision.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {revision.estado === "completada"
                        ? "Completada"
                        : revision.estado === "en_proceso"
                          ? "En Proceso"
                          : revision.estado === "pendiente"
                            ? "Pendiente"
                            : "Sin Estado"}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="bg-gray-100">
                    {revision.curso}
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
                    {revision.estudiantes.length === 1 ? (
                      <>
                        <p className="text-sm font-medium">{revision.estudiantes[0].nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {revision.estudiantes[0].codigo}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">
                          {revision.estudiantes.length} estudiantes
                        </p>
                        <ul className="text-xs text-muted-foreground list-disc ml-4 mt-1">
                          {revision.estudiantes.map((est) => (
                            <li key={est.codigo}>{est.nombre} ({est.codigo})</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fecha de Subida:</span>
                    <span className="text-sm font-medium">
                      {revision.fechaEntrega &&
                        new Date(revision.fechaEntrega).toLocaleDateString()}
                    </span>
                  </div>

                  {revision.porcentajeSimilitud !== null && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Detección de Plagio:</span>
                        <span
                          className={
                            revision.porcentajeSimilitud > 20
                              ? "text-red-600 font-medium"
                              : revision.porcentajeSimilitud > 10
                                ? "text-yellow-600 font-medium"
                                : "text-green-600 font-medium"
                          }
                        >
                          {revision.porcentajeSimilitud}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Link href={`/revisor/revision/detalles-revision/${revision.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Detalles
                  </Button>
                </Link>

                <Link
                  href={
                    revision.estado === "pendiente"
                      ? `/revisor/revision/revisar-doc/${revision.id}`
                      : `/revisor/revision/detalles-revision/${revision.id}`
                  }
                >
                  <Button
                    size="sm"
                    className={
                      revision.estado === "completada"
                        ? "bg-green-600 hover:bg-green-700"
                        : revision.estado === "en_proceso"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : revision.estado === "pendiente"
                            ? "bg-yellow-600 hover:bg-pucp-light"
                            : "bg-gray-400 hover:bg-gray-500"
                    }
                  >
                    {revision.estado === "completada" ? (
                      <>
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Completada
                      </>
                    ) : revision.estado === "en_proceso" ? (
                      <>
                        <Search className="mr-1 h-4 w-4" />
                        En Proceso
                      </>
                    ) : revision.estado === "pendiente" ? (
                      <>
                        <Search className="mr-1 h-4 w-4" />
                        Pendiente
                      </>
                    ) : (
                      <>
                        <Search className="mr-1 h-4 w-4" />
                        Sin Estado
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
