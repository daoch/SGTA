"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { etapaFormativaCicloService } from "@/features/configuracion/services/etapa-formativa-ciclo";
import { EtapaFormativaCiclo } from "@/features/configuracion/types/etapa-formativa-ciclo";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Clock, Search, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { findStudentsForReviewer } from "../services/report-services";
import { AlumnoReviewer } from "../types/Alumno.type";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ReviewerReports() {
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [students, setStudents] = useState<AlumnoReviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);

        const data: AlumnoReviewer[] = await findStudentsForReviewer(searchTerm);
        
        setStudents(data);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [searchTerm]);


  const selectedStudentData = students.find((student) => student.usuarioId === selectedStudent);


  // Filtrar estudiantes por curso y búsqueda
  const filteredStudents = useMemo(() => {
    // Hardcode: NO filtrar por curso, solo retornar todos los estudiantes
    let filtered = students;

    // Filtro por búsqueda (esto sí funciona)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          `${student.nombres} ${student.primerApellido} ${student.segundoApellido}`.toLowerCase().includes(query) ||
          (student.temaTitulo?.toLowerCase() || "").includes(query) ||
          (student.asesor?.toLowerCase() || "").includes(query) ||
          (student.temaTitulo?.toLowerCase() || "").includes(query)
      );
    }

    return filtered.sort((a, b) =>
      `${a.nombres} ${a.primerApellido} ${a.segundoApellido}`.localeCompare(
        `${b.nombres} ${b.primerApellido} ${b.segundoApellido}`
      )
    );
  }, [students, courseFilter, searchQuery]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Resetear página si cambia el filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, courseFilter, students]);

  // Utilidades de estado visual
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "En progreso":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Retrasado":
        return "bg-red-100 text-red-800 border-red-200";
      case "En riesgo":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado":
        return <Check className="h-3 w-3" />;
      case "En progreso":
        return <Clock className="h-3 w-3" />;
      case "Retrasado":
      case "En riesgo":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Cargando estudiantes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Buscar Estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Filtro por curso */}
            {/*
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filtrar por curso:</label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-[400px]">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectContent>
                    <SelectItem value="all">Todos los cursos</SelectItem>
                    {etapas.map((etapa) => (
                      <SelectItem key={etapa.id} value={etapa.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{etapa.nombreEtapaFormativa}</span>
                          <Badge variant="outline" className="ml-2">
                            {etapa.cantidadEntregables} entregables
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>

                  <SelectItem value="all">Todos los cursos</SelectItem>
                  <SelectItem value="PFC1">
                    <div className="flex items-center justify-between w-full">
                      <span>Proyecto de Fin de Carrera 1</span>
                      <Badge variant="outline" className="ml-2">
                        4 entregables
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="PFC2">
                    <div className="flex items-center justify-between w-full">
                      <span>Proyecto de Fin de Carrera 2</span>
                      <Badge variant="outline" className="ml-2">
                        3 entregables
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            */}

            {/* Barra de búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o tema de tesis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(searchQuery);
                  }
                }}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm(searchQuery)}
            >
              Buscar
            </Button>

            {/* Botón limpiar */}
            {(searchQuery || courseFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCourseFilter("all");
                }}
                className="whitespace-nowrap"
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-gray-600">
            <span>
              {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? "s" : ""} encontrado
              {filteredStudents.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lista de estudiantes */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron estudiantes</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || courseFilter !== "all"
                  ? "Intenta ajustar los filtros o términos de búsqueda"
                  : "No hay estudiantes disponibles en este momento"}
              </p>
              {(searchQuery || courseFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setCourseFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
        <div className="space-y-3">
          {paginatedStudents.map((student) => (
            <Card
              key={student.usuarioId}
              className="hover:shadow-sm transition-shadow py-2 md:py-2 rounded-lg"
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Nombre y curso */}
                  <div className="md:w-1/4">
                    <h3 className="font-semibold text-gray-900">
                      {student.nombres} {student.primerApellido} {student.segundoApellido}
                    </h3>
                  </div>

                  {/* Tema de tesis */}
                  <div className="md:w-1/2">
                    <Badge variant="outline" className="text-xs mb-1"> Titulo de Proyecto </Badge>
                    <p className="text-sm text-gray-600 line-clamp-2">{student.temaTitulo}</p>
                  </div>

                  {/* Estado hardcodeado */}
                  <div className="md:w-1/8 flex justify-start md:justify-center">
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                        getStatusColor("En progreso")
                      )}
                    >
                      {getStatusIcon("En progreso")}
                      En progreso
                    </div>
                  </div>

                    {/* Botón de ver detalles */}
                    <div className="md:w-1/8 flex justify-start md:justify-end">
                      <Button
                      variant="outline"
                      size="sm"
                      asChild
                      >
                      <Link href={`/revisor/reportes/detalleEstudiante/${student.usuarioId}`}>
                        Ver detalles
                      </Link>
                      </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={currentPage <= 1}
                  />
                </PaginationItem>
                {/* Números de página */}
                {(() => {
                  const MAX_PAGE_BUTTONS = 5;
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, currentPage + 2);
                  if (endPage - startPage < MAX_PAGE_BUTTONS - 1) {
                    if (startPage === 1) {
                      endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);
                    } else if (endPage === totalPages) {
                      startPage = Math.max(1, endPage - MAX_PAGE_BUTTONS + 1);
                    }
                  }
                  const pages = [];
                  if (startPage > 1) {
                    pages.push(
                      <PaginationItem key={1}>
                        <PaginationLink
                          isActive={1 === currentPage}
                          onClick={() => setCurrentPage(1)}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <PaginationItem key="ellipsis-start">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                  }
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={i === currentPage}
                          onClick={() => setCurrentPage(i)}
                          className="cursor-pointer"
                        >
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <PaginationItem key="ellipsis-end">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    pages.push(
                      <PaginationItem key={totalPages}>
                        <PaginationLink
                          isActive={totalPages === currentPage}
                          onClick={() => setCurrentPage(totalPages)}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return pages;
                })()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        </>
      )}
    </div>
  );
}


