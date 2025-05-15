"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

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
    estado: "completada",
    porcentajePlagio: 5,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: 3,
    ultimoCiclo: "2025-1",
    documento: "Revisado",
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
    estado: "en-proceso",
    porcentajePlagio: 12,
    formatoValido: false,
    entregaATiempo: true,
    citadoCorrecto: false,
    observaciones: 7,
    ultimoCiclo: "2025-1",
    documento: "Por Aprobar",
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
    estado: "completada",
    porcentajePlagio: 8,
    formatoValido: true,
    entregaATiempo: true,
    citadoCorrecto: true,
    observaciones: 2,
    ultimoCiclo: "2025-1",
    documento: "Aprobado",
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
    estado: "pendiente",
    porcentajePlagio: null,
    formatoValido: null,
    entregaATiempo: null,
    citadoCorrecto: null,
    observaciones: 0,
    ultimoCiclo: "2024-2",
    documento: "Por Aprobar",
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
    estado: "completada",
    porcentajePlagio: 15,
    formatoValido: true,
    entregaATiempo: false,
    citadoCorrecto: true,
    observaciones: 5,
    ultimoCiclo: "2023-2",
    documento: "Aprobado",
  },
];

interface RevisionesTableProps {
  filter?: string;
  searchQuery?: string;
  cursoFilter?: string;
}

export function RevisionesTable({
  filter,
  searchQuery = "",
  cursoFilter = "todos",
}: RevisionesTableProps) {
  // Filtrar las revisiones según los criterios
  let revisionesFiltradas = revisionesData;

  // Filtrar por estado
  if (filter) {
    revisionesFiltradas = revisionesFiltradas.filter(
      (revision) => revision.documento === filter,
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Entregable</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Plagio</TableHead>
              <TableHead>F. de Carga</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Ultimo Ciclo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revisionesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay revisiones disponibles
                </TableCell>
              </TableRow>
            ) : (
              revisionesFiltradas.map((revision) => (
                <TableRow key={revision.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{revision.titulo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span>{revision.entregable}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{revision.estudiante}</div>
                      <div className="text-xs text-muted-foreground">
                        {revision.codigo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-100">
                      {revision.curso === "1INF42" ? "1INF42" : "1INF46"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        revision.estado === "completada"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : revision.estado === "en-proceso"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {revision.estado === "completada"
                        ? "Completada"
                        : revision.estado === "en-proceso"
                          ? "En Proceso"
                          : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {revision.porcentajePlagio !== null ? (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={revision.porcentajePlagio}
                          max={30}
                          className={`h-2 w-16 ${revision.porcentajePlagio > 20
                            ? "bg-red-200"
                            : revision.porcentajePlagio > 10
                              ? "bg-yellow-200"
                              : "bg-green-200"
                            }`}
                        />
                        <span
                          className={
                            revision.porcentajePlagio > 20
                              ? "text-red-600"
                              : revision.porcentajePlagio > 10
                                ? "text-yellow-600"
                                : "text-green-600"
                          }
                        >
                          {revision.porcentajePlagio}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {revision.fechaLimite && (
                        <>
                          {revision.entregaATiempo === false && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {new Date(revision.fechaLimite).toLocaleDateString()}
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center ">
                    {revision.documento}
                  </TableCell>
                  <TableCell className="text-center ">
                    <div>{revision.ultimoCiclo}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-0.5">
                      <Link href={`/revision/${revision.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                      </Link>
                      <Link href={`/asesor/revision/revisar-doc/${revision.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={
                            revision.estado === "completada"
                              ? "text-green-600"
                              : revision.estado === "en-proceso"
                                ? "text-blue-600"
                                : "text-yellow-600"
                          }
                        >
                          {revision.estado === "completada" ? (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Revisado
                            </>
                          ) : revision.estado === "en-proceso" ? (
                            <>
                              <Clock className="mr-1 h-4 w-4" />
                              Continuar
                            </>
                          ) : (
                            <>
                              <Search className="mr-1 h-4 w-4" />
                              Revisar
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
