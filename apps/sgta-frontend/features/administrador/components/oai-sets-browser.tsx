"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Carrera, carreraService } from "@/features/configuracion/services/carrera-service";
import { ChevronRight, Database, Download, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { getOAIRecordsBySet, getOAISets, importOAITemas, OAIRecordData, OAISetData } from "../services/oai-service";

export function OAISetsBrowser() {
  const [sets, setSets] = useState<OAISetData[]>([]);
  const [selectedSet, setSelectedSet] = useState<OAISetData | null>(null);
  const [records, setRecords] = useState<OAIRecordData[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [selectedCarreraId, setSelectedCarreraId] = useState<string>("");
  const [isLoadingSets, setIsLoadingSets] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSets();
    fetchCarreras();
  }, []);

  const fetchSets = async () => {
    try {
      setIsLoadingSets(true);
      const setsData = await getOAISets();
      setSets(setsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los sets OAI",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSets(false);
    }
  };

  const fetchCarreras = async () => {
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
  };

  const handleSetClick = async (set: OAISetData) => {
    try {
      setIsLoadingRecords(true);
      setSelectedSet(set);
      const recordsData = await getOAIRecordsBySet(set.setSpec);
      setRecords(recordsData.records || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los registros del set",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleImport = async () => {
    if (!selectedSet || !selectedCarreraId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un set y una carrera",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImporting(true);
      const result = await importOAITemas(selectedSet.setSpec, parseInt(selectedCarreraId));
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

  const handleBackToSets = () => {
    setSelectedSet(null);
    setRecords([]);
    setSelectedCarreraId("");
  };

  if (!selectedSet) {
    // Sets List View
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
              <Database size={20} />
            </div>
            <div>
              <CardTitle>Explorar Sets OAI</CardTitle>
              <CardDescription>
                Navegue por los sets disponibles en el repositorio OAI y explore sus registros
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingSets ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando sets...</span>
            </div>
          ) : sets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay sets disponibles</p>
              <p className="text-sm">Verifique la configuración del endpoint OAI</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sets.map((set) => (
                <div
                  key={set.setSpec}
                  onClick={() => handleSetClick(set)}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-gray-500" />
                        <h3 className="font-medium">{set.setName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {set.setSpec}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{set.setDescription}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Records Detail View
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToSets}>
            ← Volver a Sets
          </Button>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              {selectedSet.setName}
            </CardTitle>
            <CardDescription>
              {selectedSet.setDescription} • {records.length} registros
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Import Section */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
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
              disabled={!selectedCarreraId || isImporting}
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

        {/* Records List */}
        <div>
          <h3 className="font-medium mb-4">Registros en el Set</h3>
          {isLoadingRecords ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando registros...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay registros en este set</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {records.map((record) => (
                <div key={record.identifier} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm mb-1">
                    {record.metadata.title || "Sin título"}
                  </h4>
                  {record.metadata.creator && (
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Autor:</strong> {record.metadata.creator}
                    </p>
                  )}
                  {record.metadata.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {record.metadata.description}
                    </p>
                  )}
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{record.datestamp}</span>
                    <span>•</span>
                    <span>{record.identifier}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}