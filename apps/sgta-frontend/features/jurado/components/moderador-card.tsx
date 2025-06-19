"use client";

import { Profesor } from "../types/temas.types";

interface ModeradorCardProps {
  docente: Profesor;
  isSelected: boolean;
  onSelect: () => void;
  isDisabled?: boolean;
}

export const ModeradorCard: React.FC<ModeradorCardProps> = ({
  docente,
  isSelected,
  onSelect,
  isDisabled,
}) => {
  return (
    <div
      key={docente.id}
      className={`relative border rounded-lg p-3 cursor-pointer transition-colors hover:border-primary ${
        isSelected ? "border-primary bg-primary/5" : "border-gray-200"
      }`}
      onClick={() => !isDisabled && onSelect()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* EL CHECKBOX PARA SELECCIONAR VARIOS */}
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => !isDisabled && onSelect()}
              disabled={isDisabled}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* DETALLES DEL DOCENTE */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-6">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-base truncate">
                  {docente.nombres +
                    " " +
                    docente.primerApellido +
                    " " +
                    docente.segundoApellido}
                </h3>
                <p className="text-sm text-gray-600">
                  {docente.codigoPucp} - {docente.correoElectronico}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

