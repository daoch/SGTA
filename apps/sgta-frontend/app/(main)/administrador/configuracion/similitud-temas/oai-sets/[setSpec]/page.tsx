"use client";

import { useState, useEffect, useCallback, useMemo, use } from "react";
import { ArrowLeft, Package, Download, Loader2, Search, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getOAIRecordsBySet, getOAISets, importOAITemas, OAIRecordData } from "@/features/administrador/services/oai-service";
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
  const { toast } = useToast();

  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const recordsData = await getOAIRecordsBySet(setSpec);
      setRecords(recordsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los registros del set",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setSpec, toast]);

  const fetchCarreras = useCallback(async () => {
    try {
      const carrerasData = await carreraService.getAll();
      setCarreras(carrerasData.filter(c => c.activo));
    } catch (error) {
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
    } catch (error) {
      console.error("Error fetching set info:", error);
    }
  }, [setSpec]);

  useEffect(() => {
    fetchRecords();
    fetchCarreras();
    fetchSetInfo();
  }, [fetchRecords, fetchCarreras, fetchSetInfo]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    
    const query = searchQuery.toLowerCase();
    return records.filter(record => {
      const normalizeForSearch = (value: any): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value.join(' ');
        if (typeof value === 'object') return JSON.stringify(value);
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
      const result = await importOAITemas(setSpec, parseInt(selectedCarreraId));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${result.imported} temas correctamente`,
      });
    } catch (error) {
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
    await fetchRecords();
    toast({
      title: "Actualizado",
      description: "Registros actualizados correctamente",
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
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
              {setInfo?.name || 'Registros del Set'}
            </h1>
            <div className="text-gray-600">
              {setInfo?.description && (
                <p className="text-sm mb-1">
                  {setInfo.description}
                </p>
              )}
              <p className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="font-mono">
                  {setSpec}
                </Badge>
                • {records.length} registros
              </p>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Import Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Download size={16} />
          Importar Temas
        </h3>
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
          <Button
            onClick={handleImport}
            disabled={!selectedCarreraId || isImporting || records.length === 0}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Importando...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Importar {records.length} temas
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
              No hay registros que coincidan con "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredRecords.map((record) => {
              const urls = record.metadata.description ? extractUrls(String(record.metadata.description)) : [];
              const formatArrayField = (value: any): string => {
                if (Array.isArray(value)) return value.join(', ');
                return String(value || '');
              };
              
              return (
                <div key={record.identifier} className="p-6">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-2">
                      {record.metadata.title || "Sin título"}
                    </h3>
                    {record.metadata.creator && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Autor{Array.isArray(record.metadata.creator) && record.metadata.creator.length > 1 ? 'es' : ''}:</strong> {formatArrayField(record.metadata.creator)}
                      </p>
                    )}
                    {record.metadata.subject && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 font-medium mb-2 block">
                          Tema{Array.isArray(record.metadata.subject) && record.metadata.subject.length > 1 ? 's' : ''}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(record.metadata.subject) 
                            ? record.metadata.subject.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
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
                        <strong>Asesor{Array.isArray(record.metadata.contributor) && record.metadata.contributor.length > 1 ? 'es' : ''}:</strong> {formatArrayField(record.metadata.contributor)}
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
                    {record.metadata.identifier && record.metadata.identifier.startsWith('http') && (
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
                            <strong>Acceso:</strong> {record.metadata.rights.replace('info:eu-repo/semantics/', '')}
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

      {records.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {searchQuery 
              ? `Mostrando ${filteredRecords.length} de ${records.length} registros` 
              : `Se encontraron ${records.length} registro${records.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      )}
    </div>
  );
}