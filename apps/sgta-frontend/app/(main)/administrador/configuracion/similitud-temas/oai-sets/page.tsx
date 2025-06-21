"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Database, Package, ChevronRight, Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getOAISets, getCurrentOAIEndpoint, OAISetData } from "@/features/administrador/services/oai-service";

export default function OAISetsPage() {
  const [sets, setSets] = useState<OAISetData[]>([]);
  const [currentEndpoint, setCurrentEndpoint] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  const fetchSets = useCallback(async () => {
    try {
      setIsLoading(true);
      const setsData = await getOAISets();
      setSets(setsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los sets OAI",
        variant: "destructive",
      });
      setSets([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchEndpoint = useCallback(async () => {
    try {
      const endpoint = await getCurrentOAIEndpoint();
      setCurrentEndpoint(endpoint);
    } catch (error) {
      console.error("Error fetching endpoint:", error);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEndpoint();
    await fetchSets();
    setIsRefreshing(false);
    toast({
      title: "Actualizado",
      description: "Sets OAI actualizados correctamente",
    });
  };

  useEffect(() => {
    fetchEndpoint();
  }, [fetchEndpoint]);

  useEffect(() => {
    if (currentEndpoint) {
      fetchSets();
    }
  }, [currentEndpoint, fetchSets]);

  const filteredSets = useMemo(() => {
    if (!searchQuery.trim()) return sets;
    
    const query = searchQuery.toLowerCase();
    return sets.filter(set => {
      const safeStringify = (value: any): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      };
      
      const name = safeStringify(set.setName);
      const description = safeStringify(set.setDescription);
      const spec = safeStringify(set.setSpec);
      
      return name.toLowerCase().includes(query) ||
             description.toLowerCase().includes(query) ||
             spec.toLowerCase().includes(query);
    });
  }, [sets, searchQuery]);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/administrador/configuracion/similitud-temas">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Sets OAI Disponibles</h1>
            <div className="text-gray-600">
              <p>Explore los conjuntos de datos disponibles en el repositorio OAI</p>
              {currentEndpoint && (
                <p className="text-xs font-mono mt-1">
                  Endpoint: {currentEndpoint}
                </p>
              )}
            </div>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Search Bar */}
      {sets.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar sets por nombre, descripción o especificación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              {filteredSets.length} de {sets.length} sets encontrados
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow border">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3 text-lg">Cargando sets...</span>
          </div>
        ) : !currentEndpoint ? (
          <div className="text-center py-16 text-gray-500">
            <Database className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Endpoint OAI no configurado</h3>
            <p className="text-sm mb-4">
              Configure primero el endpoint OAI para poder explorar los sets disponibles
            </p>
            <Link href="/administrador/configuracion/similitud-temas">
              <Button variant="outline">
                Ir a configuración
              </Button>
            </Link>
          </div>
        ) : sets.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Database className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay sets disponibles</h3>
            <p className="text-sm">
              El endpoint OAI configurado no tiene sets disponibles o no responde correctamente
            </p>
          </div>
        ) : filteredSets.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No se encontraron sets</h3>
            <p className="text-sm">
              No hay sets que coincidan con "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredSets.map((set, index) => (
              <Link
                key={set.setSpec}
                href={`/administrador/configuracion/similitud-temas/oai-sets/${encodeURIComponent(set.setSpec)}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1">
                      <Package size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {set.setName}
                        </h3>
                        <Badge variant="outline" className="text-xs font-mono">
                          {set.setSpec}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {set.setDescription}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-400 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {sets.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {searchQuery 
              ? `Mostrando ${filteredSets.length} de ${sets.length} sets` 
              : `Se encontraron ${sets.length} set${sets.length !== 1 ? 's' : ''} disponible${sets.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      )}
    </div>
  );
}