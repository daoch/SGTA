"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import ModalidadRevisionCard from "../components/conf-general/ModalidadRevision";
import JuradosCards from "../components/conf-general/Jurados";
import AsesoresCards from "../components/conf-general/Asesores";
import GeneralConfCards from "../components/conf-general/General";
import { useBackStore } from "../store/configuracion-store";

export default function ConfiguracionSistema() {
  const {
    cargarParametros,
    parametros,
    guardarParametros,
    cargando,
  } = useBackStore();

  // Estado local para guardar los parámetros originales
  const [originalParametros, setOriginalParametros] = useState<any[]>([]);

  useEffect(() => {
    cargarParametros(1).then(() => {
      // Guardar una copia profunda de los parámetros originales
      setOriginalParametros(JSON.parse(JSON.stringify(parametros)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargarParametros]);

  // Detectar si hay cambios
  const hasChanges =
    parametros.length !== originalParametros.length ||
    parametros.some((param, idx) => param.valor !== originalParametros[idx]?.valor);

  // Handler para guardar
  const handleGuardar = async () => {
    await guardarParametros();
    // Actualizar los originales después de guardar
    setOriginalParametros(JSON.parse(JSON.stringify(parametros)));
  };

  return (
    <div className="max-w-5xl ">
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

      <div className="flex-1 overflow-auto ">
        <Tabs defaultValue="general">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="asesores">Asesores</TabsTrigger>
              <TabsTrigger value="jurados">Jurados</TabsTrigger>
              <TabsTrigger value="revision">Revisión</TabsTrigger>
            </TabsList>
            <button
              className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold transition disabled:bg-gray-300`}
              disabled={!hasChanges || cargando}
              onClick={handleGuardar}
            >
              Guardar
            </button>
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
        </Tabs>
      </div>
    </div>
  );
}
