"use client";

import { useState, useEffect, useCallback, useMemo, use } from "react";
import { ArrowLeft, Package, Download, Loader2, Search, RefreshCw, ExternalLink, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  getOAIRecordsBySet, 
  getOAISets, 
  importOAITemas, 
  startAsyncOAIImport,
  pollAsyncImportStatus,
  getOAIRecordCount,
  OAIRecordData,
  OAIAsyncImportTaskInfo 
} from "@/features/administrador/services/oai-service";
import { carreraService, Carrera } from "@/features/configuracion/services/carrera-service";

interface PageProps {
  params: Promise<{
    setSpec: string;
  }>;
}

export default function OAIRecordsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const setSpec = decodeURIComponent(resolvedParams.setSpec);
  const [records, setRecords] = useState<OAIRecordData[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState<string>("");
  const [setInfo, setSetInfo] = useState<{ name: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1); // Change to 1-based pagination
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [_hasMoreRecords, setHasMoreRecords] = useState(false);
  const [_loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [useAsyncImport, setUseAsyncImport] = useState(true);
  const [importProgress, setImportProgress] = useState<OAIAsyncImportTaskInfo | null>(null);
  const { toast } = useToast();

  const fetchTotalCount = useCallback(async () => {
    try {
      const count = await getOAIRecordCount(setSpec);
      setTotalRecords(count);
      setTotalPages(Math.ceil(count / recordsPerPage));
    } catch (err) {
      console.error("Error fetching total count:", err);
    }
  }, [setSpec, recordsPerPage]);

  const fetchRecords = useCallback(async (page: number = 1, append: boolean = false, pageSize?: number) => {
    try {
      if (!append) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const currentPageSize = pageSize || recordsPerPage;
      const offset = (page - 1) * currentPageSize; // Convert to 0-based offset
      
      const response = await getOAIRecordsBySet(setSpec, {
        limit: currentPageSize,
        offset: offset,
        includeTotalCount: false // Do not need count from this endpoint
      });
      
      const newRecords = response.records || [];
      
      if (append) {
        setRecords(prev => [...prev, ...newRecords]);
      } else {
        setRecords(newRecords);
        // Update total pages based on current page size if we changed it
        if (pageSize && totalRecords > 0) {
          setTotalPages(Math.ceil(totalRecords / pageSize));
        }
      }
      
      setHasMoreRecords(response.has_more || false);
      setCurrentPage(page);
      
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar los registros del set",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [setSpec, recordsPerPage, totalRecords, toast]);

  const fetchCarreras = useCallback(async () => {
    try {
      const carrerasData = await carreraService.getAll();
      setCarreras(carrerasData.filter(c => c.activo));
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron cargar las carreras",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchSetInfo = useCallback(async () => {
    try {
      const sets = await getOAISets();
      const currentSet = sets.find(set => set.setSpec === setSpec);
      if (currentSet) {
        setSetInfo({
          name: currentSet.setName,
          description: currentSet.setDescription
        });
      }
    } catch (err) {
      console.error("Error fetching set info:", err);
    }
  }, [setSpec]);

  useEffect(() => {
    const initialize = async () => {
      // First fetch the total count
      await fetchTotalCount();
      // Then fetch the first page of records
      await fetchRecords(1, false);
    };
    
    initialize();
    fetchCarreras();
    fetchSetInfo();
  }, [setSpec, recordsPerPage, fetchTotalCount, fetchRecords, fetchCarreras, fetchSetInfo]); // Re-fetch when setSpec or recordsPerPage changes


  const handlePageSizeChange = useCallback(async (newPageSize: number) => {
    setRecordsPerPage(newPageSize);
    setCurrentPage(1);
    // Recalculate total pages with new page size
    if (totalRecords > 0) {
      setTotalPages(Math.ceil(totalRecords / newPageSize));
    }
    await fetchRecords(1, false, newPageSize);
  }, [fetchRecords, totalRecords]);

  const handlePageChange = useCallback(async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      await fetchRecords(newPage, false);
    }
  }, [fetchRecords, totalPages, currentPage]);

  const loadAllRecords = useCallback(async () => {
    if (totalRecords > 0) {
      try {
        setIsLoading(true);
        const response = await getOAIRecordsBySet(setSpec, {
          limit: totalRecords, // Load all records
          offset: 0,
          includeTotalCount: false
        });
        
        setRecords(response.records || []);
        setHasMoreRecords(false);
        setCurrentPage(1);
        setTotalPages(1); // All records in one page
        setRecordsPerPage(totalRecords); // Update page size to total records
        
        toast({
          title: "Todos los registros cargados",
          description: `Se cargaron ${response.records?.length || 0} registros`,
        });
      } catch {
        toast({
          title: "Error",
          description: "No se pudieron cargar todos los registros",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [setSpec, totalRecords, toast]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    
    const query = searchQuery.toLowerCase();
    return records.filter(record => {
      const normalizeForSearch = (value: unknown): string => {
        if (value === null || value === undefined) return "";
        if (typeof value === "string") return value;
        if (Array.isArray(value)) return value.join(" ");
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
      };
      
      const title = normalizeForSearch(record.metadata.title);
      const creator = normalizeForSearch(record.metadata.creator);
      const description = normalizeForSearch(record.metadata.description);
      const subject = normalizeForSearch(record.metadata.subject);
      const contributor = normalizeForSearch(record.metadata.contributor);
      const identifier = normalizeForSearch(record.identifier);
      
      return title.toLowerCase().includes(query) ||
             creator.toLowerCase().includes(query) ||
             description.toLowerCase().includes(query) ||
             subject.toLowerCase().includes(query) ||
             contributor.toLowerCase().includes(query) ||
             identifier.toLowerCase().includes(query);
    });
  }, [records, searchQuery]);

  const handleImport = async () => {
    if (!selectedCarreraId) {
      toast({
        title: "Error",
        description: "Debe seleccionar una carrera",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImporting(true);
      
      if (useAsyncImport && totalRecords > 100) {
        // Use async import for large datasets
        const importTask = await startAsyncOAIImport(setSpec, parseInt(selectedCarreraId));
        
        toast({
          title: "Importación iniciada",
          description: `Se inició la importación asíncrona. ID de tarea: ${importTask.task_id}`,
        });
        
        // Poll for progress
        try {
          const finalResult = await pollAsyncImportStatus(
            importTask.task_id,
            (taskInfo) => {
              setImportProgress(taskInfo);
            }
          );
          
          toast({
            title: "Importación completada",
            description: `Se importaron ${finalResult.imported_count} temas correctamente`,
          });
          
        } catch {
          toast({
            title: "Error en importación",
            description: "La importación falló o fue interrumpida",
            variant: "destructive",
          });
        } finally {
          setImportProgress(null);
        }
        
      } else {
        // Use synchronous import for smaller datasets
        const result = await importOAITemas(setSpec, parseInt(selectedCarreraId));
        toast({
          title: "Importación exitosa",
          description: `Se importaron ${result.imported} temas correctamente`,
        });
      }
      
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron importar los temas",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleRefresh = async () => {
    setCurrentPage(1);
    await fetchTotalCount();
    await fetchRecords(1, false);
    toast({
      title: "Actualizado",
      description: "Registros actualizados correctamente",
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reusable pagination component
  const PaginationControls = ({ showBackToTop = false }: { showBackToTop?: boolean }) => {
    if (records.length === 0 || searchQuery) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          {totalRecords > 0 && totalPages > 1
            ? `Página ${currentPage} de ${totalPages} (${totalRecords.toLocaleString()} registros totales)`
            : totalRecords > 0 
              ? `${totalRecords.toLocaleString()} registros totales`
              : `${records.length} registros encontrados`}
        </div>
        
        <div className="flex items-center gap-2">
          {showBackToTop && (
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ChevronUp size={16} />
              Inicio
            </Button>
          )}
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 ? handlePageChange(currentPage - 1) : null}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={currentPage <= 1}
                  />
                </PaginationItem>
                
                {(() => {
                  const MAX_PAGE_BUTTONS = 5;
                  const pages = [];
                  
                  let startPage: number, endPage: number;
                  
                  if (totalPages <= MAX_PAGE_BUTTONS) {  
                    startPage = 1;
                    endPage = totalPages;
                  } else {
                    const buttonsOnEachSide = Math.floor((MAX_PAGE_BUTTONS - 1) / 2);
                    
                    if (currentPage <= buttonsOnEachSide + 1) {
                      startPage = 1;
                      endPage = MAX_PAGE_BUTTONS - 1;
                    } else if (currentPage >= totalPages - buttonsOnEachSide) {
                      startPage = totalPages - (MAX_PAGE_BUTTONS - 2);
                      endPage = totalPages;
                    } else {
                      startPage = currentPage - buttonsOnEachSide;
                      endPage = currentPage + buttonsOnEachSide;
                    }
                  }
                  
                  if (startPage > 1) {
                    pages.push(1);
                    if (startPage > 2) {
                      pages.push("ellipsis-start");
                    }
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push("ellipsis-end");
                    }
                    pages.push(totalPages);
                  }
                  
                  return pages.map((pageNum, index) => (
                    <PaginationItem key={`page-${pageNum}-${index}`}>
                      {pageNum === "ellipsis-start" || pageNum === "ellipsis-end" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum as number)}
                          className="cursor-pointer"
                          aria-label={`Page ${pageNum}`}
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ));
                })()}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={currentPage >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/administrador/configuracion/similitud-temas/oai-sets">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Package size={24} />
              {setInfo?.name || "Registros del Set"}
            </h1>
            <div className="text-gray-600">
              {setInfo?.description && (
                <p className="text-sm mb-1">
                  {setInfo.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <Badge variant="outline" className="font-mono">
                  {setSpec}
                </Badge>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Package size={12} />
                  <span className="font-medium">
                    {isLoading ? "Cargando registros..." : 
                     totalRecords > 0 ? `${totalRecords.toLocaleString()} registros totales` : 
                     records.length > 0 ? `${records.length} registros encontrados` : 
                     "Sin registros"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Page Size and Load All Controls */}
      {records.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Registros por página:</label>
              <Select value={recordsPerPage.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {totalRecords > records.length && totalPages > 1 && (
              <Button 
                onClick={loadAllRecords}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  `Cargar todos (${totalRecords})`
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Top Pagination */}
      {records.length > 0 && !searchQuery && (
        <div className="mb-6">
          <PaginationControls />
        </div>
      )}

      {/* Import Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Download size={16} />
          Importar Temas
        </h3>
        
        {/* Import Progress */}
        {importProgress && (
          <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso de importación</span>
              <span className="text-sm">{importProgress.status === "running" ? "En progreso" : importProgress.status}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${importProgress.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Importados: {importProgress.imported_count}</span>
              <span>{importProgress.progress.toFixed(1)}%</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Carrera de destino</label>
            <Select value={selectedCarreraId} onValueChange={setSelectedCarreraId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una carrera" />
              </SelectTrigger>
              <SelectContent>
                {carreras.map((carrera) => (
                  <SelectItem key={carrera.id} value={carrera.id.toString()}>
                    {carrera.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {totalRecords > 100 && (
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Método de importación</label>
              <Select value={useAsyncImport ? "async" : "sync"} onValueChange={(value) => setUseAsyncImport(value === "async")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="async">Asíncrona</SelectItem>
                  <SelectItem value="sync">Síncrona</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button
            onClick={handleImport}
            disabled={!selectedCarreraId || isImporting || records.length === 0}
          >
            {isImporting || importProgress ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {importProgress ? "Importando..." : "Iniciando..."}
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Importar {totalRecords > 0 ? totalRecords : records.length} temas
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {records.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar registros por título, autor, tema, asesor, descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              {filteredRecords.length} de {records.length} registros encontrados
            </p>
          )}
        </div>
      )}

      {/* Records List */}
      <div className="bg-white rounded-lg shadow border">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3 text-lg">Cargando registros...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay registros en este set</h3>
            <p className="text-sm">
              El set seleccionado no contiene registros o no se pudieron cargar
            </p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No se encontraron registros</h3>
            <p className="text-sm">
              No hay registros que coincidan con &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredRecords.map((record) => {
              const urls = record.metadata.description ? extractUrls(String(record.metadata.description)) : [];
              const formatArrayField = (value: unknown): string => {
                if (Array.isArray(value)) return value.join(", ");
                return String(value || "");
              };
              
              return (
                <div key={record.identifier} className="p-6">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-2">
                      {record.metadata.title || "Sin título"}
                    </h3>
                    {record.metadata.creator && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Autor{Array.isArray(record.metadata.creator) && record.metadata.creator.length > 1 ? "es" : ""}:</strong> {formatArrayField(record.metadata.creator)}
                      </p>
                    )}
                    {record.metadata.subject && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 font-medium mb-2 block">
                          Tema{Array.isArray(record.metadata.subject) && record.metadata.subject.length > 1 ? "s" : ""}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(record.metadata.subject) 
                            ? record.metadata.subject.map((subject, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))
                            : (
                                <Badge variant="secondary" className="text-xs">
                                  {record.metadata.subject}
                                </Badge>
                              )
                          }
                        </div>
                      </div>
                    )}
                    {record.metadata.contributor && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Asesor{Array.isArray(record.metadata.contributor) && record.metadata.contributor.length > 1 ? "es" : ""}:</strong> {formatArrayField(record.metadata.contributor)}
                      </p>
                    )}
                  </div>
                  
                  {record.metadata.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {record.metadata.description}
                      </p>
                      {urls.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {urls.map((url, index) => (
                            <button
                              key={index}
                              onClick={() => openExternalLink(url)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ExternalLink size={12} />
                              {url}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {/* Clickable repository link */}
                    {record.metadata.identifier && record.metadata.identifier.startsWith("http") && (
                      <div className="mb-2">
                        <button
                          onClick={() => openExternalLink(record.metadata.identifier!)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          <ExternalLink size={14} />
                          Ver tesis completa en repositorio
                        </button>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>
                        <strong>ID:</strong> {record.identifier}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Fecha:</strong> {record.datestamp}
                      </span>
                      {record.metadata.date && (
                        <>
                          <span>•</span>
                          <span>
                            <strong>Fecha metadata:</strong> {record.metadata.date}
                          </span>
                        </>
                      )}
                      {record.metadata.type && (
                        <>
                          <span>•</span>
                          <span>
                            <strong>Tipo:</strong> {record.metadata.type}
                          </span>
                        </>
                      )}
                      {record.metadata.language && (
                        <>
                          <span>•</span>
                          <span>
                            <strong>Idioma:</strong> {record.metadata.language}
                          </span>
                        </>
                      )}
                      {record.metadata.rights && (
                        <>
                          <span>•</span>
                          <span>
                            <strong>Acceso:</strong> {record.metadata.rights.replace("info:eu-repo/semantics/", "")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Pagination with Back to Top */}
      {records.length > 0 && !searchQuery && (
        <div className="mt-6">
          <PaginationControls showBackToTop={true} />
        </div>
      )}

      {searchQuery && filteredRecords.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Mostrando {filteredRecords.length} de {records.length} registros cargados
            {totalRecords > records.length && ` (filtrados de ${totalRecords} totales)`}
          </p>
        </div>
      )}
    </div>
  );
}