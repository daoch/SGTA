// src/features/academic-cycle-settings/components/CycleSelector.tsx
import React from 'react';
import { Select, SelectItem, Spinner } from "@heroui/react";
import { CicloAcademico } from '../types';

interface CycleSelectorProps {
  cycles: CicloAcademico[];
  selectedCycleId: string | null;
  onCycleChange: (cycleId: string | null) => void;
  isLoading: boolean;
  label?: string;
}

const CycleSelector: React.FC<CycleSelectorProps> = ({
  cycles, selectedCycleId, onCycleChange, isLoading, label = "Seleccionar Ciclo Académico:"
}) => {
  
  const handleSelectionChange = (keys: Set<React.Key> | any) => {
       const selectedKey = keys instanceof Set ? (Array.from(keys)[0] as string) : null;
       onCycleChange(selectedKey);
   };

  return (
    <div>
      <label htmlFor="cycle-select" className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isLoading ? (
          <div className="flex items-center text-sm text-gray-500">
              <Spinner size="sm" color="primary" className="mr-2"/> Cargando ciclos...
          </div>
      ) : (
        <Select
          id="cycle-select"
          aria-label={label}
          placeholder="Seleccione un ciclo..."
          items={cycles}
          selectedKeys={selectedCycleId ? [selectedCycleId] : []}
          onSelectionChange={handleSelectionChange}
          variant="bordered"
          size="md"
          className="max-w-xs" // Ajustar ancho
          disabledKeys={cycles.filter(c => c.estado === 'cerrado').map(c => c.id)} // Deshabilitar cerrados si se muestran
        >
          {(cycle) => (
            <SelectItem key={cycle.id} textValue={`${cycle.nombre} (${cycle.estado})`}>
              {cycle.nombre} <span className="text-xs text-gray-500 ml-1">({cycle.estado})</span>
            </SelectItem>
          )}
        </Select>
      )}
       {/* Mostrar Fechas del Ciclo Seleccionado */}
        {/* Puedes añadir aquí la visualización de selectedCycleDetails.fechaInicio/Fin si lo pasas como prop */}
    </div>
  );
};
export default CycleSelector;