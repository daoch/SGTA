"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ModalidadRevisionCard from "../components/conf-general/ModalidadRevision";
import JuradosCards from "../components/conf-general/Jurados";
import AsesoresCards from "../components/conf-general/Asesores";
import GeneralConfCards from "../components/conf-general/General";

export default function ConfiguracionSistema() {
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
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="asesores">Asesores</TabsTrigger>
            <TabsTrigger value="jurados">Jurados</TabsTrigger>
            <TabsTrigger value="revision">Revisión</TabsTrigger>
          </TabsList>

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
