"use client";

interface CriterioObservacionProps {
  idCriterio: number;
  criterio: string;
  descripcion: string;
  observacion: string;
  calificacion: number;
  nota_maxima: number;
}

export function CriterioObservacion({
  criterio,
  descripcion,
  observacion,
  calificacion,
  nota_maxima,
}: CriterioObservacionProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border p-5 flex-col md:flex-row grid grid-cols-2 gap-4">
      {/*TITULO DE CRITERIO Y DESCRIPCION Y NOTA*/}
      <div className="flex flex-col items-start space-y-2 md:min-w-[150px] justify-center">
        <div className="text-xl font-semibold">{criterio}</div>
        <div className="text-lg text-gray-500">{descripcion}</div>
        <div className="text-3xl text-[#264753] font-semibold">
          {calificacion} / {nota_maxima}
        </div>
      </div>
      {/*OBSERVACIONES*/}
      <div className="flex flex-col items-start space-y-2 md:min-w-[150px] justify-start">
        <div className="text-xl font-semibold">Observaciones</div>
        <div className="text-lg">{observacion}</div>
      </div>
    </div>
  );
}
