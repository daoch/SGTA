import { Clock, User, Users } from "lucide-react";

interface EstadisticasAsesorCardProps {
  tesisEnProceso: number;
  totalProyectos: number;
  tesistasActuales?: number | null;
  limiteTesis?: number | null;
}

export function EstadisticasAsesorCard({
  tesisEnProceso,
  totalProyectos,
  tesistasActuales = 0,
  limiteTesis = 0,
}: EstadisticasAsesorCardProps) {
  const tesistas = tesistasActuales ?? 0;
  const limite = limiteTesis ?? 0;
  const proporcion = limite > 0 ? tesistas / limite : 0;
  const color =
    proporcion >= 1
      ? "bg-red-500"
      : proporcion >= 0.5
        ? "bg-yellow-400"
        : "bg-green-500";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="font-semibold text-gray-900 mb-4">Estadísticas</h4>
      <div className="space-y-4">
        {/* Tesis en Proceso */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Tesis en Proceso</span>
          </div>
          <span className="font-semibold text-blue-600">{tesisEnProceso}</span>
        </div>

        {/* Proyectos realizados */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600">Proyectos Realizados</span>
          </div>
          <span className="font-semibold text-purple-600">
            {totalProyectos}
          </span>
        </div>

        {/* Capacidad */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Capacidad</span>
          </div>
          <span className="font-semibold text-green-600">
            {tesistasActuales}/{limiteTesis}
          </span>
        </div>

        {/* Barra de capacidad */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${color}`}
              style={{ width: `${proporcion * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
