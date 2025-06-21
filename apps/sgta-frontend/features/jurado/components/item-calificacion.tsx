"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { EvaluacionExposicionJurado,CriterioEvaluacion } from "../types/jurado.types";

interface CalificacionItemProps {
  criterio: CriterioEvaluacion
  onChange?: (id: number, calificacion: number| null, observacion: string) => void;
}

export function CalificacionItem({
  criterio,
  onChange
}: CalificacionItemProps) {
  const [calificacion, setCalificacion] = useState(criterio.calificacion);
  const [observacion, setObservacion] = useState(criterio.observacion);
  
  const [calificacionStr, setCalificacionStr] = useState<string>(
    criterio.calificacion !== null && criterio.calificacion !== undefined 
      ? criterio.calificacion.toString() 
      : ""
  );

  const [estaVacio, setEstaVacio] = useState<boolean>(
    criterio.calificacion === null || criterio.calificacion === undefined
  );

  // Manejador para cuando cambia la calificación
  const handleCalificacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue !== "" && !/^(\d*\.?\d{0,2})$/.test(inputValue)) {
      return; // No actualizar si no es un formato de número válido
    }
    
    setCalificacionStr(inputValue);

    if (inputValue === "") {
      setEstaVacio(true);
      onChange?.(criterio.id, null, observacion);
      return;
    }

    const newValue = parseFloat(inputValue);
    // Asegurar que el valor esté dentro del rango permitido
    {/*
    if (!isNaN(newValue) && newValue >= 0 && newValue <= criterio.nota_maxima) {
      setCalificacion(newValue);
      setEstaVacio(false);
      onChange?.(criterio.id, newValue, observacion);
    }else {
      setEstaVacio(true);
    }
    */}
    if (!isNaN(newValue)) {
      // Si excede el máximo, ajustar al máximo permitido
      if (newValue > criterio.nota_maxima) {
        const valorAjustado = criterio.nota_maxima;
        // Actualizar inmediatamente al valor máximo permitido
        setCalificacionStr(valorAjustado.toString());
        setCalificacion(valorAjustado);
        setEstaVacio(false);
        onChange?.(criterio.id, valorAjustado, observacion);
      } 
      // Si es negativo, ajustar a 0
      else if (newValue < 0) {
        setCalificacionStr("0");
        setCalificacion(0);
        setEstaVacio(false);
        onChange?.(criterio.id, 0, observacion);
      }
      // Si está dentro del rango permitido
      else {
        setCalificacion(newValue);
        setEstaVacio(false);
        onChange?.(criterio.id, newValue, observacion);
      }
    } else {
      // Si no es un número válido
      setEstaVacio(true);
      onChange?.(criterio.id, null, observacion);
    }
  };

  const handleBlur = () => {
    // Si hay un valor y excede el máximo, ajustar al valor máximo
    if (calificacionStr !== "") {
      const currentValue = parseFloat(calificacionStr);
      if (!isNaN(currentValue)) {
        if (currentValue > criterio.nota_maxima) {
          setCalificacionStr(criterio.nota_maxima.toString());
          setCalificacion(criterio.nota_maxima);
          onChange?.(criterio.id, criterio.nota_maxima, observacion);
        } else if (currentValue < 0) {
          setCalificacionStr("0");
          setCalificacion(0);
          onChange?.(criterio.id, 0, observacion);
        }
      }
    }
  };


  // Manejador para cuando cambia la observación
  const handleObservacionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservacion(e.target.value);
    let numValue = null;
    if (calificacionStr !== "") {
      const parsed = parseFloat(calificacionStr);
      if (!isNaN(parsed)) numValue = parsed;
    }
    onChange?.(criterio.id, numValue, e.target.value);
  };


  return (
    <div className="border rounded-2xl p-4 space-y-2 shadow-sm">
      <Label className="text-lg font-semibold">{criterio.titulo}</Label>
      <p className="text-sm">{criterio.descripcion}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col space-y-2">
          <Label>Calificación</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="0"
              max={criterio.nota_maxima}
              step="0.5"
              value={calificacionStr}
              placeholder="0.0"
              className={`w-24 ${
                estaVacio ? "border-red-500 focus:ring-red-500" : ""
              }`}
              onChange={handleCalificacionChange}
              onBlur={handleBlur}
            />
            <span>/ {criterio.nota_maxima}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label>Observaciones</Label>
          <Textarea placeholder="Escribe tus observaciones aquí"
             value={observacion}
            onChange={handleObservacionChange} />
        </div>
      </div>
    </div>
  );
}
