"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AsesoresCards from "../components/conf-general/Asesores";
import GeneralConfCards from "../components/conf-general/General";
import JuradosCards from "../components/conf-general/Jurados";
import ModalidadRevisionCard from "../components/conf-general/ModalidadRevision";
import TemasCard from "../components/conf-general/Temas";
import { useBackStore } from "../store/configuracion-store";
import { etapasFormativasService, EtapaFormativaCoordinador } from "../services/etapas-formativas";
import { ciclosService } from "../services/etapa-formativa-ciclo";
import type { Ciclo } from "../types/etapa-formativa-ciclo";

export default function ConfiguracionSistema() {
  const {
    cargarParametros,
    parametros,
    parametrosOriginales,
    guardarParametros,
    cargando,
  } = useBackStore();


  const [ciclo, setCiclo] = useState<Ciclo | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {

        // Cargar ciclo actual (asumimos que getAll trae solo uno)
        const ciclos = await ciclosService.getAll();
        if (Array.isArray(ciclos) && ciclos.length > 0) {
          setCiclo(ciclos[0]);
        }

        await cargarParametros();
        
      } catch (error) {
        console.error("Error al inicializar datos:", error);
      } 
    };

    initializeData();
  }, [cargarParametros]);


  // Detectar si hay cambios comparando con los valores originales
  const hasChanges = parametros.some((param) => {
    const originalParam = parametrosOriginales.find(p => p.id === param.id);

    return originalParam && originalParam.valor !== param.valor;
  });

  // Handler para guardar
  const handleGuardar = async () => {
    await guardarParametros();
  };

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
          Configuración General
        </h1>
      </div>

      {/* Dropdown para seleccionar etapa formativa y label de ciclo */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {ciclo && (
            <span className="ml-4 text-sm text-gray-600 font-medium">
              Parámetros respecto al ciclo: <span className="font-bold">{ciclo.anio} - {ciclo.semestre}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto ">
        <Tabs defaultValue="general">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="asesores">Asesores</TabsTrigger>
              <TabsTrigger value="jurados">Jurados</TabsTrigger>
              <TabsTrigger value="revision">Revisión</TabsTrigger>
              <TabsTrigger value="temas">Temas</TabsTrigger>
            </TabsList>
            <Button
              className={"px-4 py-2 rounded text-white font-semibold transition disabled:bg-gray-300"}
              disabled={!hasChanges || cargando}
              onClick={handleGuardar}
            >
              {cargando ? "Guardando..." : "Guardar"}
            </Button>
          </div>

          <TabsContent value="general" className="space-y-4">
            <GeneralConfCards />
          </TabsContent>

          <TabsContent value="asesores" className="space-y-4">
            <AsesoresCards />
          </TabsContent>

          <TabsContent value="jurados" className="space-y-4">
            <JuradosCards />
          </TabsContent>

          <TabsContent value="revision" className="space-y-4">
            <ModalidadRevisionCard />
          </TabsContent>

          <TabsContent value="temas" className="space-y-4">
            <TemasCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
