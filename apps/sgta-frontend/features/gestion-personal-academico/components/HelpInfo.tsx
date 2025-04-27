'use client';

import React from 'react';

export const HelpInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 rounded-lg shadow p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">Información sobre la gestión del personal académico</h3>
          <p className="mt-2 text-sm text-blue-700">
            Desde este panel puede acceder a todas las funciones de gestión del personal académico. 
            Utilice las tarjetas para navegar a cada sección específica. Las secciones con indicadores 
            de "pendientes" requieren su atención prioritaria.
          </p>
          <p className="mt-2 text-sm text-blue-700">
            Si necesita ayuda adicional, consulte la <a href="#" className="font-medium underline">documentación</a> o 
            contacte con <a href="#" className="font-medium underline">soporte técnico</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpInfo;