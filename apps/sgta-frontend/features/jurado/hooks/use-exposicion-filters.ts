import { useMemo } from "react";
import { ListExposicionXCoordinadorDTO } from "../dtos/ListExposicionXCoordiandorDTO";
import { Filtros } from "./use-exposicion-filters-form";

export function useExposicionFilters(
  items: ListExposicionXCoordinadorDTO[],
  filters: Filtros,
) {
  return useMemo(
    () =>
      items.filter((item) => {
        if (
          filters.etapaFormativa &&
          String(item.etapaFormativaId) !== filters.etapaFormativa
        )
          return false;
        if (filters.ciclo && String(item.cicloId) !== filters.ciclo)
          return false;
        if (filters.estado && item.estadoPlanificacionNombre !== filters.estado)
          return false;
        return true;
      }),
    [items, filters],
  );
}
