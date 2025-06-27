"use client";
import { NuevaEtapaModal } from "@/features/configuracion/components/configuracion/nueva-etapa-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ChevronRight, Edit, Trash2, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { etapaFormativaCicloService, PageResponse, EtapaFormativaCicloPageRequest, ciclosService } from "@/features/configuracion/services/etapa-formativa-ciclo";
import { EtapaFormativaCiclo } from "../types/etapa-formativa-ciclo";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SquarePen } from "lucide-react";
import { EditarEtapaModal } from "@/features/configuracion/components/configuracion/editar-etapa-modal";

interface Ciclo {
  id: number;
  anio: number;
  semestre: string;
}

export default function ConfiguracionProcesoPage() {
  const [etapas, setEtapas] = useState<EtapaFormativaCiclo[]>([]);
  const [etapaToDelete, setEtapaToDelete] = useState<EtapaFormativaCiclo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  
  // Tab state
  const [activeTab, setActiveTab] = useState("en-curso");
  
  // Year and semester filter state (only for "Finalizado" tab)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  
  const fetchEtapas = async (page: number = 0, search?: string, estado?: string, anio?: number, semestre?: string) => {
    setIsLoading(true);
    try {
      const params: EtapaFormativaCicloPageRequest = {
        page,
        size: pageSize,
        search: search || undefined,
        estado: estado || undefined,
        anio: anio || undefined,
        semestre: semestre || undefined
      };
      
      const response: PageResponse<EtapaFormativaCiclo> = await etapaFormativaCicloService.getAllByIdCarreraPaginated(params);
      
      setEtapas(response.content);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setHasNext(response.hasNext);
      setHasPrevious(response.hasPrevious);
    } catch (error) {
      console.error("Error al cargar las etapas:", error);
      toast.error("Error al cargar las etapas");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCiclos = async () => {
    try {
      const response = await ciclosService.getAllYears();
      setCiclos(response);
      
      // Extract unique years and semesters with explicit type assertions
      const years = [...new Set(response.map((ciclo: Ciclo) => ciclo.anio))].sort((a, b) => (b as number) - (a as number)) as number[];
      const semesters = [...new Set(response.map((ciclo: Ciclo) => ciclo.semestre))].sort() as string[];
      
      setAvailableYears(years);
      setAvailableSemesters(semesters);
    } catch (error) {
      console.error("Error al cargar los ciclos:", error);
    }
  };

  useEffect(() => {
    fetchCiclos();
  }, []);

  useEffect(() => {
    // Set initial estado filter based on active tab
    const estado = activeTab === "en-curso" ? "En Curso" : "Finalizado";
    setEstadoFilter(estado);
    
    // Reset year and semester filters when changing tabs
    if (activeTab === "en-curso") {
      setSelectedYear(undefined);
      setSelectedSemester("");
      fetchEtapas(0, searchTerm, estado);
    } else {
      fetchEtapas(0, searchTerm, estado, selectedYear, selectedSemester);
    }
  }, [activeTab]);

  const handleSearch = () => {
    setCurrentPage(0);
    if (activeTab === "finalizado") {
      fetchEtapas(0, searchTerm, estadoFilter, selectedYear, selectedSemester);
    } else {
      fetchEtapas(0, searchTerm, estadoFilter);
    }
  };

  const handleFilterChange = (newEstado: string) => {
    setEstadoFilter(newEstado);
    setCurrentPage(0);
    fetchEtapas(0, searchTerm, newEstado);
  };

  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
    setCurrentPage(0);
    fetchEtapas(0, searchTerm, estadoFilter, year, selectedSemester);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setCurrentPage(0);
    fetchEtapas(0, searchTerm, estadoFilter, selectedYear, semester);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (activeTab === "finalizado") {
      fetchEtapas(newPage, searchTerm, estadoFilter, selectedYear, selectedSemester);
    } else {
      fetchEtapas(newPage, searchTerm, estadoFilter);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(0);
    setSearchTerm(""); // Reset search when changing tabs
  };

  const handleDelete = async () => {
    if (!etapaToDelete) return;

    setIsDeleting(true);
    try {
      await etapaFormativaCicloService.delete(etapaToDelete.id);
      toast.success("Etapa eliminada exitosamente");
      if (activeTab === "finalizado") {
        await fetchEtapas(currentPage, searchTerm, estadoFilter, selectedYear, selectedSemester);
      } else {
        await fetchEtapas(currentPage, searchTerm, estadoFilter);
      }
    } catch (error) {
      console.error("Error al eliminar la etapa:", error);
      toast.error("Error al eliminar la etapa");
    } finally {
      setIsDeleting(false);
      setEtapaToDelete(null);
    }
  };

  const renderEtapasList = () => (
    <>
      {/* Search and Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-4">
          {/* Search and basic filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Buscar por nombre de etapa, año o semestre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              Buscar
            </Button>
          </div>

          {/* Year and Semester filters - only show for "Finalizado" tab */}
          {activeTab === "finalizado" && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48">
                <Select 
                  value={selectedYear?.toString() || "all"} 
                  onValueChange={(value) => handleYearChange(value === "all" ? undefined : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los años</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={selectedSemester || "all"} 
                  onValueChange={(value) => handleSemesterChange(value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los semestres</SelectItem>
                    {availableSemesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#042354] mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando etapas...</p>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {etapas.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay etapas {activeTab === "en-curso" ? "en curso" : "finalizadas"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? "No se encontraron resultados para tu búsqueda." 
                  : `No hay etapas ${activeTab === "en-curso" ? "en curso" : "finalizadas"} en este momento.`
                }
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {etapas.map((etapa) => (
                  <Card key={etapa.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                              <BookOpen size={20} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{etapa.nombreEtapaFormativa}</h3>
                              <div className="text-sm mb-2">
                                <strong>Ciclo:</strong> {etapa.nombreCiclo}
                              </div>
                              <div className="text-sm">
                                <strong>Creditaje:</strong> {etapa.creditajePorTema}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <EditarEtapaModal
                              etapa={etapa}
                              onSuccess={() => {
                                if (activeTab === "finalizado") {
                                  fetchEtapas(currentPage, searchTerm, estadoFilter, selectedYear, selectedSemester);
                                } else {
                                  fetchEtapas(currentPage, searchTerm, estadoFilter);
                                }
                              }}
                            />

                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => setEtapaToDelete(etapa)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 border-t flex items-center justify-between">
                        <div className="flex gap-6">
                          <div className="text-sm">
                            <span className="text-gray-500">Entregables:</span> {etapa.cantidadEntregables}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Exposiciones:</span> {etapa.cantidadExposiciones}
                          </div>
                        </div>

                        <Link 
                          href={{
                            pathname: `/coordinador/configuracion/proceso/etapa/${etapa.id}`,
                            query: {
                              nombreEtapa: etapa.nombreEtapaFormativa,
                              ciclo: etapa.nombreCiclo
                            }
                          }}
                        >
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <span>Ver detalles</span>
                            <ChevronRight size={16} />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Mostrando {etapas.length} de {totalElements} etapas
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevious}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mt-5 mb-4">
        <Link
          href="/coordinador/configuracion"
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={11} />
        </Link>
        <h1 className="text-2xl font-bold text-[#042354]">
          Configuración de Proceso
        </h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Etapas del Proceso</h2>
        </div>
        <NuevaEtapaModal onSuccess={() => {
          if (activeTab === "finalizado") {
            fetchEtapas(currentPage, searchTerm, estadoFilter, selectedYear, selectedSemester);
          } else {
            fetchEtapas(currentPage, searchTerm, estadoFilter);
          }
        }} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="en-curso" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            En Curso
            {activeTab === "en-curso" && totalElements > 0 && (
              <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {totalElements}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="finalizado" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            Finalizado
            {activeTab === "finalizado" && totalElements > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {totalElements}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-curso">
          {renderEtapasList()}
        </TabsContent>

        <TabsContent value="finalizado">
          {renderEtapasList()}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!etapaToDelete} onOpenChange={() => setEtapaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la etapa {etapaToDelete?.nombreEtapaFormativa} y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
