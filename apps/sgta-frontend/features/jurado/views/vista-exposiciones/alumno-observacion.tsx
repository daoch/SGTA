"use client";
import type React from "react";
import { CriterioObservacion } from "@/features/jurado/components/alumno-criterio-observacion";
import { Separator } from "@/components/ui/separator";
import { CalificacionesJurado } from "../../types/jurado.types";
import { useEffect, useState } from "react";
import { getCalificacionesJuradoByExposicionTemaId } from "../../services/jurado-service";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface DetalleObservacionExposicionProps {
  idExposicion: string;
  idDocente: string;
}

const ObservacionExposicion: React.FC<DetalleObservacionExposicionProps> = ({
  idExposicion,
  idDocente,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [calificaciones, setCalificaciones] = useState<CalificacionesJurado>();
  const notaFinal = calificaciones?.criterios.reduce(
    (total, criterio) => total + (criterio.calificacion || 0),
    0,
  );
  const notaMaxima = calificaciones?.criterios.reduce(
    (total, criterio) => total + (criterio.nota_maxima || 0),
    0,
  );

  const fetchCalificacion = async () => {
    setIsLoading(true);
    try {
      console.log("idExposicion:", idExposicion);
      console.log("idDocente:", idDocente);

      const calificacionesData: CalificacionesJurado[] =
        await getCalificacionesJuradoByExposicionTemaId(Number(idExposicion));

      setCalificaciones(
        calificacionesData.find(
          (calif) => calif.usuario_id === Number(idDocente),
        ),
      );
    } catch (error) {
      console.error("Error al cargar exposiciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalificacion();
  }, []);

  const router = useRouter();

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <button
          onClick={() => router.back()}
          className="flex items-center text-black hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Detalles de Calificación
        </h1>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 animate-pulse">
              Cargando detalles de la calificación del miembro de jurado...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              {calificaciones?.criterios.map((criterio) => (
                <CriterioObservacion
                  key={criterio.id}
                  idCriterio={criterio.id}
                  criterio={criterio.titulo}
                  descripcion={criterio.descripcion}
                  observacion={
                    criterio.observacion ||
                    "El miembro del jurado no ha dejado observaciones para este criterio."
                  }
                  calificacion={criterio.calificacion}
                  nota_maxima={criterio.nota_maxima}
                />
              ))}
            </div>

            {/*NOTA FINAL*/}
            <Separator />
            <h1 className="text-xl font-semibold">Observaciones Finales</h1>
            <div className="text-lg pb-10">
              {calificaciones?.observaciones_finales ||
                "No hay observaciones finales."}
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-3xl font-semibold items-center text-[#264753]">
                Nota Final del Miembro del Jurado
              </h1>
              <h1 className="text-4xl font-semibold items-center text-[#264753]">
                {notaFinal} / {notaMaxima}
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ObservacionExposicion;

