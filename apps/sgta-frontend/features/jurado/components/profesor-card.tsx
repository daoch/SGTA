"use client";

import { Profesor } from "../types/temas.types";

interface ProfesorCardProps {
  docente: Profesor;
  isSelected: boolean;
  onSelect: () => void;
  isDisabled?: boolean;
}

export const ProfesorCard: React.FC<ProfesorCardProps> = ({
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

              <div className="flex-shrink-0 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    docente.tipoDedicacion === "TC"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {docente.tipoDedicacion}
                </span>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Tipo dedicación
                </p>
              </div>

              <div className="flex-shrink-0 text-center">
                <span className="text-lg font-semibold text-gray-900">
                  {docente.cantTemasAsignados}
                </span>
                <p className="text-xs text-gray-500">Estudiantes asignados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

