import { BookOpen, CalendarRange, School } from "lucide-react";
import Link from "next/link";

export default function ConfiguracionAdminPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Configuración del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/administrador/configuracion/ciclos"
          className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <CalendarRange size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Gestión de Ciclos</h2>
            <p className="text-gray-500 text-sm">
              Registre y administre los ciclos académicos para los proyectos de fin de carrera.
            </p>
          </div>
        </Link>

        <Link
          href="/administrador/configuracion/etapas-formativas"
          className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Etapas Formativas</h2>
            <p className="text-gray-500 text-sm">
              Configure las etapas formativas (cursos de tesis) asociadas a ciclos y carreras.
            </p>
          </div>
        </Link>

        <Link
          href="/administrador/configuracion/carreras"
          className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <School size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-1">Gestión de Carreras</h2>
            <p className="text-gray-500 text-sm">
              Administre las carreras disponibles en el sistema y sus configuraciones específicas.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
