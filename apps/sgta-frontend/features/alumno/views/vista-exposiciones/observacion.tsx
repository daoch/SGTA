"use client";
import type React from "react";
import { CriterioObservacion } from "@/features/alumno/components/criterio-observacion";
import { Separator } from "@/components/ui/separator";

interface DetalleObservacionExposicionProps {
  idExposicion: string;
  idDocente: string;
}

//ejemplo de criterios de observacion
const criterios = [
  {
    idCriterio: 1,
    criterio: "Claridad en la presentación",
    descripcion:
      "El expositor presentó la información de manera clara y concisa.",
    observacion: "La presentación fue clara y concisa.",
    calificacion: 4,
    nota_maxima: 4,
  },
  {
    idCriterio: 2,
    criterio: "Dominio del tema",
    descripcion:
      "El expositor demostró un buen dominio del tema y respondió a las preguntas.",
    observacion: "El expositor mostró un buen dominio del tema.",
    calificacion: 4,
    nota_maxima: 4,
  },
  {
    idCriterio: 3,
    criterio: "Uso de recursos visuales",
    descripcion:
      "Se utilizaron recursos visuales adecuados para apoyar la presentación.",
    observacion: "Se utilizaron recursos visuales adecuados.",
    calificacion: 3,
    nota_maxima: 4,
  },
  {
    idCriterio: 4,
    criterio: "Interacción con el público",
    descripcion:
      "El expositor fomentó la interacción con el público y respondió a las preguntas.",
    observacion: "Se fomentó la interacción con el público.",
    calificacion: 4,
    nota_maxima: 4,
  },
  {
    idCriterio: 5,
    criterio: "Cumplimiento del tiempo",
    descripcion:
      "El expositor cumplió con el tiempo asignado para la presentación.",
    observacion: "Se cumplió más o menos con el tiempo asignado.",
    calificacion: 2,
    nota_maxima: 4,
  },
];

const observacionesFinales = {
  observacion:
    "La presentación fue buena, pero se puede mejorar en algunos aspectos.",
};

const ObservacionExposicion: React.FC<DetalleObservacionExposicionProps> = ({
  idExposicion,
  idDocente,
}) => {
  return (
    <div className="items-center justify-center flex flex-col">
      <div className="flex flex-col gap-4">
        {/*MOSTRAMOS LOS CRITERIOS DE OBSERVACION*/}
        <h1 className="text-2xl font-semibold pt-4">
          Criterios de Calificación
        </h1>
        <div className="space-y-2">
          {criterios.map((criterio) => (
            <CriterioObservacion
              key={criterio.idCriterio}
              idCriterio={criterio.idCriterio}
              criterio={criterio.criterio}
              descripcion={criterio.descripcion}
              observacion={criterio.observacion}
              calificacion={criterio.calificacion}
              nota_maxima={criterio.nota_maxima}
            />
          ))}
        </div>

        {/*NOTA FINAL*/}
        <Separator></Separator>
        <h1 className="text-xl font-semibold">Observaciones Finales</h1>
        <div className="text-lg pb-10">{observacionesFinales.observacion}</div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-semibold items-center text-[#264753]">
          Nota Final
        </h1>
        <h1 className="text-4xl font-semibold items-center text-[#264753]">
          {criterios.map((c) => c.calificacion).reduce((a, b) => a + b, 0)} /{" "}
          {criterios.map((c) => c.nota_maxima).reduce((a, b) => a + b, 0)}
        </h1>
      </div>
    </div>
  );
};
export default ObservacionExposicion;
