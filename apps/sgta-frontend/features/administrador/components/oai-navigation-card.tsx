"use client";

import { Database, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function OAINavigationCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <Database size={20} />
          </div>
          <div>
            <CardTitle>Explorar Repositorio OAI</CardTitle>
            <CardDescription>
              Navegue por los sets y registros disponibles en el repositorio OAI configurado
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link
          href="/administrador/configuracion/similitud-temas/oai-sets"
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div>
            <h3 className="font-medium mb-1">Ver Sets Disponibles</h3>
            <p className="text-sm text-gray-600">
              Explore los conjuntos de datos, revise registros e importe temas
            </p>
          </div>
          <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </Link>
        <div className="mt-4 text-xs text-gray-500">
          Configure primero el endpoint OAI arriba para poder explorar los sets disponibles.
        </div>
      </CardContent>
    </Card>
  );
}