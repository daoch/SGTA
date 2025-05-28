import React from "react";
import { EstadoPlanificacion } from "../../types/jurado.types";

interface Props {
  estadoPlan: EstadoPlanificacion;
}

const PlanificacionEstadoStepper: React.FC<Props> = React.memo(
  ({ estadoPlan }) => {
    const steps: EstadoPlanificacion[] = [
      { id: 2, nombre: "Planificacion inicial", activo: false },
      { id: 3, nombre: "Fase 1", activo: false },
      { id: 4, nombre: "Fase 2", activo: false },
      { id: 5, nombre: "Cierre de planificacion", activo: false },
    ];

    const stepLabels = [
      "Planificación Inicial",
      "Fase I de Modificaciones",
      "Fase II de Modificaciones",
      "Cierre de Planificación",
    ];

    const isCompleted = (stepId: number) => stepId < estadoPlan.id;
    const isActive = (stepId: number) => stepId === estadoPlan.id;
    const isSuccess = (stepId: number) => stepId < estadoPlan.id;

    console.log("estadoPlan", estadoPlan);

    return (
      <div data-hs-stepper="" className="w-full">
        <ul className="relative flex flex-row gap-x-2">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
              data-hs-stepper-nav-item={`{ "index": ${index + 1} }`}
            >
              <span className="min-w-7 min-h-7 group inline-flex items-center text-xs align-middle">
                <span
                  className={`size-7 flex justify-center items-center shrink-0 font-medium rounded-full
                ${isActive(step.id) ? "bg-primary text-white" : ""}
                ${isCompleted(step.id) ? "bg-primary text-white" : ""}
                ${!isActive(step.id) && !isCompleted(step.id) ? "bg-gray-100 text-gray-800" : ""}
              `}
                >
                  <span className={isCompleted(step.id) ? "hidden" : ""}>
                    {index + 1}
                  </span>
                  {isCompleted(step.id) && (
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
                <span className="ms-2 text-sm font-medium text-gray-800">
                  {stepLabels[index]}
                </span>
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-px flex-1 
                ${isSuccess(step.id) ? "bg-primary" : "bg-gray-200"}
              `}
                ></div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

PlanificacionEstadoStepper.displayName = "PlanificacionEstadoStepper";

export default PlanificacionEstadoStepper;
