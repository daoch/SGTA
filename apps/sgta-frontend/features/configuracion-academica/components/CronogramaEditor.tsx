// src/features/configuracion-academica/components/CronogramaEditor.tsx
import React from 'react';
import { Card, Chip, Button, Spinner } from "@heroui/react"; // Asumiendo Spinner
import { Edit, CheckCircle, Archive, Eye, Save, Upload } from 'lucide-react';
import CronogramaHitoTable from './CronogramaHitoTable'; // Importar la tabla
import { Hito, EstadoCronogramaType, CursoType } from '../types';

interface CronogramaEditorProps {
  cicloId: string;
  curso: CursoType;
  hitos: Hito[];
  estado: EstadoCronogramaType;
  fechaPublicacion: string | null;
  esEditable: boolean;
  isReadOnly?: boolean; // Flag explícito para modo solo lectura
  onAgregarHito: () => void; 
  onActualizarHito: (hito: Hito) => void; 
  onEliminarHito: (hito: Hito) => void; 
  onReordenarHitos: (hitos: Hito[]) => void; 
  onGuardarBorrador: () => Promise<boolean>; 
  onPublicar: () => void; 
  isSaving: boolean;
  isPublishing: boolean;
}

const CronogramaEditor: React.FC<CronogramaEditorProps> = ({
  cicloId, curso, hitos, estado, fechaPublicacion, esEditable, isReadOnly = false,
  onAgregarHito, onActualizarHito, onEliminarHito, onReordenarHitos,
  onGuardarBorrador, onPublicar, isSaving, isPublishing
}) => {

    const StatusIndicator = () => {
        switch(estado) {
            case 'BORRADOR': 
                return <Chip color="warning" variant="dot" startContent={<Edit size={14}/>}>Borrador</Chip>;
            case 'PUBLICADO':
                return <Chip color="success" variant="dot" startContent={<CheckCircle size={14}/>}>Publicado {fechaPublicacion ? `el ${new Date(fechaPublicacion).toLocaleDateString('es-ES')}`: ''}</Chip>;
            case 'ARCHIVADO':
                return <Chip color="default" variant="dot" startContent={<Archive size={14}/>}>Archivado (Solo Lectura)</Chip>;
             case 'NO_CREADO': // Este caso se maneja antes, pero por si acaso
                 return <Chip color="default" variant="flat">No Configurado</Chip>;
             default: return null;
        }
    };

    const handleGuardarClick = async () => {
        const success = await onGuardarBorrador();
        if(success) alert("Borrador guardado exitosamente."); // Reemplazar con toast
        // El hook maneja el error si success es false
    }

  return (
    // Usar Card como contenedor principal si se desea borde/sombra
    <Card className="p-4 sm:p-6 border-gray-200 shadow-md"> 
      {/* Encabezado con Título y Estado */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Cronograma {curso} - {cicloId}
        </h2>
         <StatusIndicator />
      </div>

      {/* Tabla de Hitos */}
      <CronogramaHitoTable 
        hitos={hitos}
        esEditable={esEditable && !isReadOnly} // Asegurar que isReadOnly tenga prioridad
        onEditHito={onActualizarHito} // Pasar la función que abre el modal de edición
        onDeleteHito={onEliminarHito} // Pasar la función que abre el modal de confirmación
        onAddHito={onAgregarHito}     // Pasar la función que abre el modal de creación
        // onReorder={onReordenarHitos} // Pasar si se implementa DND
      />
      
      {/* Botones de Acción (Solo si es editable) */}
      {esEditable && !isReadOnly && (
        <div className="flex flex-wrap justify-between items-center mt-8 gap-4 pt-4 border-t border-gray-300">
           {/* Botón Vista Previa (funcionalidad pendiente) */}
           <Button
                variant="light"
                color="default"
                onClick={() => alert("Vista previa no implementada")}
                startContent={<Eye size={16}/>}
                className="text-gray-600"
                isDisabled={true} // Deshabilitado por ahora
            >
                Vista Previa
            </Button>

           {/* Botones Guardar y Publicar */}
           <div className="flex space-x-3">
              <Button
                variant="flat" // Estilo más sutil para guardar borrador
                color="primary"
                onPress={handleGuardarClick} // Llama a la función local que llama al prop
                isLoading={isSaving}
                isDisabled={isSaving || isPublishing} // Deshabilitar mientras se guarda o publica
                startContent={!isSaving ? <Save size={16} /> : null}
              >
                {isSaving ? 'Guardando...' : 'Guardar Borrador'}
              </Button>
              <Button
                color="success" // Color para publicar
                variant="solid"
                onPress={onPublicar} // Llama a la función que abre el modal de publicación
                isLoading={isPublishing}
                isDisabled={isSaving || isPublishing || !hitos || hitos.length === 0} // No publicar vacío
                startContent={!isPublishing ? <Upload size={16} /> : null}
              >
                {isPublishing ? 'Publicando...' : 'Publicar Cronograma'}
              </Button>
           </div>
        </div>
       )}
        {/* Mostrar un mensaje si es solo lectura */}
        {isReadOnly && estado !== 'NO_CREADO' && (
            <div className="mt-6 text-center text-sm text-gray-500 italic border-t border-gray-300 pt-4">
                Este cronograma está {estado.toLowerCase()} y es de solo lectura.
            </div>
        )}

    </Card>
  );
};
export default CronogramaEditor;