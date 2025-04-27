// src/features/configuracion-academica/components/CronogramaCycleCourseSelector.tsx
'use client'
import React from 'react';
import { Select, SelectItem, Button, Spinner } from "@heroui/react"; // Usando Select de HeroUI
import { CicloInfo, CursoType } from '../types';

interface CronogramaCycleCourseSelectorProps {
  ciclos: CicloInfo[];
  cicloSeleccionado: string | null;
  onCicloChange: (cicloId: string | null) => void;
  cursoSeleccionado: CursoType;
  onCursoChange: (curso: CursoType) => void;
  isLoading: boolean;
}

const CronogramaCycleCourseSelector: React.FC<CronogramaCycleCourseSelectorProps> = ({
  ciclos,
  cicloSeleccionado,
  onCicloChange,
  cursoSeleccionado,
  onCursoChange,
  isLoading
}) => {

  const handleCicloSelectionChange = (keys: Set<React.Key> | any) => {
       const selectedKey = keys instanceof Set ? (Array.from(keys)[0] as string) : null;
       onCicloChange(selectedKey);
   };

  // Opciones para el selector de curso
  const cursoOptions = [
      { key: 'PFC1', label: 'PFC 1' },
      { key: 'PFC2', label: 'PFC 2' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Selector de Ciclo */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="cycle-select" className="text-sm font-medium text-gray-700 flex-shrink-0">
          Ciclo:
        </label>
        {isLoading ? (
          <div className="flex items-center text-sm text-gray-500 h-9"> {/* Altura similar al select */}
            <Spinner size="sm" color="primary" className="mr-2"/> Cargando...
          </div>
        ) : (
          <Select
            id="cycle-select"
            aria-label="Seleccionar Ciclo Académico"
            placeholder="Seleccione un ciclo"
            items={ciclos} // HeroUI espera 'items'
            selectedKeys={cicloSeleccionado ? [cicloSeleccionado] : []}
            onSelectionChange={handleCicloSelectionChange}
            variant="bordered"
            size="sm"
            className="w-full sm:min-w-[200px]" // Ancho mínimo
            // Deshabilitar opciones según lógica (ej. futuros no configurables aún)
            disabledKeys={ciclos.filter(c => c.esProximo && !c.puedeConfigurarProximo).map(c=>c.id)}
          >
            {(ciclo) => (
              <SelectItem key={ciclo.id} textValue={`${ciclo.nombre}${ciclo.esActual ? ' (Actual)' : ciclo.esProximo ? ' (Próximo)' : ciclo.esAnterior ? ' (Anterior)' : ''}`}>
                  {ciclo.nombre}
                  {ciclo.esActual && <span className="text-xs text-success-600 ml-1">(Actual)</span>}
                  {ciclo.esProximo && <span className="text-xs text-primary-600 ml-1">(Próximo)</span>}
                  {ciclo.esAnterior && <span className="text-xs text-gray-500 ml-1">(Anterior)</span>}
              </SelectItem>
            )}
          </Select>
        )}
      </div>

      {/* Separador Visual (opcional) */}
      {/* <div className="hidden sm:block border-l h-6 border-gray-300 mx-2"></div> */}

      {/* Selector de Curso (usando botones como tabs) */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
         <label className="text-sm font-medium text-gray-700 flex-shrink-0">
          Curso:
         </label>
          {/* Usar Button.Group o simplemente botones con variantes */}
          <div className="flex border border-gray-300 rounded-md p-0.5">
              <Button 
                  size="sm"
                  variant={cursoSeleccionado === 'PFC1' ? 'solid' : 'light'} // 'solid' para activo, 'light' para inactivo
                  color="primary"
                  className={`rounded-r-none ${cursoSeleccionado !== 'PFC1' ? 'text-gray-600' : ''}`}
                  onPress={() => onCursoChange('PFC1')}
              >
                  PFC 1
              </Button>
              <Button 
                  size="sm"
                  variant={cursoSeleccionado === 'PFC2' ? 'solid' : 'light'}
                  color="primary"
                   className={`rounded-l-none ${cursoSeleccionado !== 'PFC2' ? 'text-gray-600' : ''}`}
                   onPress={() => onCursoChange('PFC2')}
              >
                  PFC 2
              </Button>
          </div>
      </div>
    </div>
  );
};

export default CronogramaCycleCourseSelector;