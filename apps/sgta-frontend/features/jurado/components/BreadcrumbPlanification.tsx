const BreadCrumbPlanificacion: React.FC = ({  }) => {

    return(
        <div className="mb-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full  text-white flex items-center justify-center font-semibold" style={{background:"#042354"}}>
              1
            </div>
            <span className="text-sm mt-2 text-center">Planificación Inicial</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-sm mt-2 text-center">Fase I de Modificaciones</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-sm mt-2 text-center">Fase II de Modificaciones</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold">
              4
            </div>
            <span className="text-sm mt-2 text-center">Cierre de Planificación</span>
          </div>
        </div>
      </div>
    );

};

export default BreadCrumbPlanificacion;