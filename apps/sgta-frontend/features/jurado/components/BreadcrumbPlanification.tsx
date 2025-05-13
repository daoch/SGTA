import { EstadoPlanificacion } from "../types/jurado.types";

interface Props {
 
  estadoPlan:EstadoPlanificacion;
}
const classActiveBC = "w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold";
const classNoActiveBC = "w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold";
const styleActive: React.CSSProperties = { background: "#042354" };
const styleNoActive: React.CSSProperties = {}; 
export default function BreadCrumbPlanificacion ({estadoPlan}:Props)  {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div
            className={estadoPlan.nombre === "Planificacion inicial"? classActiveBC :classNoActiveBC}
            style={estadoPlan.nombre === "Planificacion inicial" ? styleActive : styleNoActive}
          >
            1
          </div>
          <span className="text-sm mt-2 text-center">
            Planificación Inicial
          </span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div 
             className={estadoPlan.nombre === "Fase 1"? classActiveBC :classNoActiveBC}
             style={estadoPlan.nombre === "Fase 1" ? styleActive : styleNoActive}
          >
            2
          </div>
          <span className="text-sm mt-2 text-center">
            Fase I de Modificaciones
          </span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div 
             className={estadoPlan.nombre === "Fase 2"? classActiveBC :classNoActiveBC}
             style={estadoPlan.nombre === "Fase 2" ? styleActive : styleNoActive}
          >
            3
          </div>
          <span className="text-sm mt-2 text-center">
            Fase II de Modificaciones
          </span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-2"></div>
        <div className="flex flex-col items-center">
          <div 
             className={estadoPlan.nombre === "Cierre de planificacion"? classActiveBC :classNoActiveBC}
             style={estadoPlan.nombre === "Cierre de planificacion" ? styleActive : styleNoActive}
          >
            4
          </div>
          <span className="text-sm mt-2 text-center">
            Cierre de Planificación
          </span>
        </div>
      </div>
    </div>
  );
};


