import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface Filtros {
  etapaFormativa?: string;
  ciclo?: string;
  estado?: string;
}

export function useExposicionFilterForm(onChange: (values: Filtros) => void) {
  const { control, watch } = useForm<Filtros>({
    defaultValues: { etapaFormativa: "", ciclo: "", estado: "" },
  });
  const values = watch();

  useEffect(() => {
    onChange(values);
  }, [values.etapaFormativa, values.ciclo, values.estado]);

  return { control };
}
