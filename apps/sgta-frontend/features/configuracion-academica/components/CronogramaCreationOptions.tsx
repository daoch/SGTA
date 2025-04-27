// src/features/configuracion-academica/components/CronogramaCreationOptions.tsx
import React from 'react';
import { Button, Select, SelectItem, Card, RadioGroup, Radio } from "@heroui/react"; // Asumiendo RadioGroup y Radio
import { Clipboard, Plus, AlertCircle } from 'lucide-react';
import { ModoCreacionState } from '../types';

interface CronogramaCreationOptionsProps {
  cicloId: string;
  curso: string;
  modoCreacion: ModoCreacionState;
  setModoCreacion: React.Dispatch<React.SetStateAction<ModoCreacionState>>;
  ciclosParaCopiar: string[]; // Array de IDs de ciclo válidos
  onIniciarCreacion: () => void; // Función para llamar al crear
  isLoading: boolean; // Para deshabilitar botón mientras se crea
}

const CronogramaCreationOptions: React.FC<CronogramaCreationOptionsProps> = ({
  cicloId,
  curso,
  modoCreacion,
  setModoCreacion,
  ciclosParaCopiar,
  onIniciarCreacion,
  isLoading
}) => {
  
  const handleOptionChange = (value: string) => {
      if (value === "cero") {
          setModoCreacion({ activo: true, empezarCero: true, copiarDesdeCicloId: null });
      } else { // Es "copiar"
          // Mantener el ciclo seleccionado si ya había uno, o seleccionar el primero si no
          setModoCreacion(prev => ({ 
              activo: true, 
              empezarCero: false, 
              copiarDesdeCicloId: prev.copiarDesdeCicloId || ciclosParaCopiar[0] || null 
          }));
      }
  };

  const handleCycleToCopyChange = (keys: Set<React.Key> | any) => {
      const selectedKey = keys instanceof Set ? (Array.from(keys)[0] as string) : null;
       if (selectedKey) {
           setModoCreacion(prev => ({ ...prev, empezarCero: false, copiarDesdeCicloId: selectedKey }));
       }
  };
  
  const canCreate = modoCreacion.empezarCero || (!modoCreacion.empezarCero && modoCreacion.copiarDesdeCicloId);

  // Opciones para el select de copia
  const sourceCycleOptions = [
      // Opción dummy si no hay ciclos válidos
      ...(ciclosParaCopiar.length === 0 ? [{ key: 'no-valid', label: 'No hay ciclos válidos para copiar' }] : []),
      ...ciclosParaCopiar.map(ciclo => ({ key: ciclo, label: ciclo }))
  ];


  return (
    <Card className="p-6 md:p-8 text-center border shadow-md">
      <Clipboard className="mx-auto text-gray-400 mb-4" size={48} />
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Configurar Cronograma</h2>
      <p className="text-gray-600 mb-6">para {curso} - Ciclo {cicloId}</p>

      <div className="max-w-md mx-auto mb-6 text-left space-y-4">
         {/* Usando RadioGroup de HeroUI */}
         <RadioGroup 
            label="Seleccione una opción para comenzar:" 
            value={modoCreacion.empezarCero ? "cero" : "copiar"}
            onValueChange={handleOptionChange} // Cambiado a onValueChange
         >
             <Radio value="cero">Empezar desde cero</Radio>
             <Radio value="copiar" isDisabled={ciclosParaCopiar.length === 0}>
                Copiar estructura desde:
             </Radio>
         </RadioGroup>

         {/* Select para copiar, se muestra debajo de la opción de radio */}
          <Select
              aria-label="Seleccionar ciclo para copiar"
              placeholder="Seleccionar ciclo origen"
              items={sourceCycleOptions}
              selectedKeys={modoCreacion.copiarDesdeCicloId ? [modoCreacion.copiarDesdeCicloId] : []}
              onSelectionChange={handleCycleToCopyChange}
              variant="bordered"
              size="sm"
              className={`w-full mt-1 ${modoCreacion.empezarCero || ciclosParaCopiar.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              isDisabled={modoCreacion.empezarCero || ciclosParaCopiar.length === 0}
           >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
           </Select>
            {ciclosParaCopiar.length === 0 && !modoCreacion.empezarCero && (
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 mt-1 flex items-center gap-1">
                    <AlertCircle size={14}/> No hay cronogramas anteriores publicados o archivados para copiar.
                </p>
            )}
      </div>

      <Button
        color="primary"
        onPress={onIniciarCreacion}
        isLoading={isLoading}
        isDisabled={!canCreate || isLoading}
        startContent={!isLoading ? <Plus size={18} /> : null}
        className="mx-auto" // Centrar botón
      >
        {isLoading ? 'Creando...' : 'Crear Cronograma'}
      </Button>
    </Card>
  );
};
export default CronogramaCreationOptions;