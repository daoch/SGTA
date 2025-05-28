"use client";
import { Settings, BookOpen } from "lucide-react";
import Link from "next/link";
//import { Badge } from "@/components/ui/badge"

export default function Configuracion() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mt-5 mb-1 text-[#042354]">
          Configuración
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <p className="text-gray-600">
            Configure los parámetros generales del sistema y las opciones de la
            facultad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="configuracion/general"
          className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">
              Configuración General
            </h2>
            <p className="text-gray-500 text-sm">
              Gestioné configuraciones clave del proceso de tesis: áreas, temas,
              fechas, asesores, jurados y revisión.
            </p>
          </div>
        </Link>

        <Link
          href="/coordinador/configuracion/proceso"
          className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Configuración de Proceso</h2>
            <p className="text-gray-500 text-sm">
              Configure las fases, cursos, entregables y exposiciones del proyecto de fin de carrera.
            </p>
          </div>
        </Link>

        <Link
          href="configuracion/usuarios"
          className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">
              Registro de Usuarios
            </h2>
            <p className="text-gray-500 text-sm">
              Gestioné configuraciones clave del proceso de tesis: áreas, temas,
              fechas, asesores, jurados y revisión.
            </p>
          </div>
        </Link>
      </div>

    </div>
  );
}
