import { useEffect, useState } from "react";
import {
  getCiclos,
  getCursosByCoordinador,
} from "../services/exposicion-service";

export interface CursoDTO {
  id: number;
  nombre: string;
}

export interface FilterOption {
  value: number | string;
  label: string;
}

export interface FilterOptions {
  etapasFormativas: FilterOption[];
  ciclos: FilterOption[];
  estados: FilterOption[];
}

export function useFetchExposicionFilters(coordinadorId: number) {
  const [options, setOptions] = useState<FilterOptions>({
    etapasFormativas: [],
    ciclos: [],
    estados: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [cursosResponse, ciclosResponse] = await Promise.all([
          getCursosByCoordinador(coordinadorId),
          getCiclos(),
        ]);

        setOptions({
          etapasFormativas: cursosResponse.map((c: CursoDTO) => ({
            value: c.id,
            label: c.nombre,
          })),
          ciclos: ciclosResponse.map(
            (c: { id: number; semestre: string; anio: number }) => ({
              value: c.id,
              label: c.anio + "-" + c.semestre,
            }),
          ),
          estados: [
            { value: "Programada", label: "Programada" },
            { value: "En Curso", label: "En Curso" },
            { value: "Finalizada", label: "Finalizada" },
          ],
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, [coordinadorId]);

  return { options, loading, error };
}
