// src/hooks/useDebounce.ts
'use client' // Necesario si usas useEffect y useState directamente aquí

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para "debouncing" un valor.
 * Retrasa la actualización del valor hasta que haya pasado un cierto tiempo
 * sin que el valor original cambie. Muy útil para campos de búsqueda.
 * 
 * @param value El valor a "debouncear" (ej. el contenido de un input).
 * @param delay El tiempo de espera en milisegundos (ej. 500).
 * @returns El valor "debounced".
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para guardar el valor "debounced"
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Establecer un temporizador para actualizar el valor debounced
      // después de que haya pasado el tiempo de 'delay'
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Limpiar el temporizador si el valor cambia ANTES de que pase el delay
      // o si el componente se desmonta.
      // Esto asegura que solo actualicemos si el usuario dejó de escribir.
      return () => {
        clearTimeout(handler);
      };
    },
    // Volver a ejecutar el efecto solo si 'value' o 'delay' cambian
    [value, delay] 
  );

  // Devolver el último valor estable (debounced)
  return debouncedValue;
}

// Podrías exportarlo como default también si prefieres
// export default useDebounce;