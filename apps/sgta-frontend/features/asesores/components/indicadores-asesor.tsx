import { Proyecto, Tesis } from "../types/perfil/entidades";

import { CheckCircle, Clock, Users } from "lucide-react";

interface IndicadoresAsesorProps {
  tesis: Tesis[];
  proyectos: Proyecto[];
}
export default function IndicadoresAsesor({
  tesis,
  proyectos,
}: IndicadoresAsesorProps) {
  const tesisCulminadas = tesis.filter((t) => t.estado === "finalizada").length;
  const tesisEnProceso = tesis.filter((t) => t.estado === "en_proceso").length;
  const totalProyectos = proyectos.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Tesis Culminadas */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="p-3 rounded-full bg-green-100 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h4 className="text-lg font-semibold">{tesisCulminadas}</h4>
        <p className="text-sm text-gray-600">Tesis Culminadas</p>
      </div>

      {/* Tesis en Proceso */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="p-3 rounded-full bg-blue-100 mb-2">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <h4 className="text-lg font-semibold">{tesisEnProceso}</h4>
        <p className="text-sm text-gray-600">Tesis en Proceso</p>
      </div>

      {/* Proyectos Realizados */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="p-3 rounded-full bg-purple-100 mb-2">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <h4 className="text-lg font-semibold">{totalProyectos}</h4>
        <p className="text-sm text-gray-600">Proyectos Realizados</p>
      </div>
    </div>
  );
}
