import {
  PagesList,
  TemasPages,
} from "@/features/temas/types/solicitudes/entities";
import { Tema } from "@/features/temas/types/temas/entidades";
import { EstadoTemaNombre } from "@/features/temas/types/temas/enums";
import { useState } from "react";

export function usePagination(initialPagesList: PagesList, limit: number = 10) {
  const [pagination, setPagination] = useState<PagesList>(initialPagesList);

  // Permite actualizar una clave específica de un estado
  function replaceStateKey<T extends keyof TemasPages>(
    state: EstadoTemaNombre,
    key: T,
    value: TemasPages[T],
  ) {
    setPagination((prev) => ({
      ...prev,
      [state]: { ...prev[state], [key]: value },
    }));
  }

  // Let Add a new Page to a State
  function addNewPage(state: EstadoTemaNombre, page: number, newPage: Tema[]) {
    setPagination((prev) => {
      // Get Prev State
      const prevState = prev[state] ?? {
        pages: {},
        current: page,
        totalCounts: newPage.length,
      };

      // Update State
      return {
        ...prev,
        [state]: {
          ...prevState,
          pages: {
            ...prevState.pages,
            [page]: newPage, // Add a new Page
          },
          current: page,
        },
      };
    });
  }

  // Obtener la página actual de un estado
  function getPage(pagesList: PagesList, state: EstadoTemaNombre) {
    return pagesList[state]?.pages[pagesList[state].current] || [];
  }

  function getTotalPages(pagesList: PagesList, state: EstadoTemaNombre) {
    if (limit === 0 || !pagesList[state]) return 0;
    return Math.ceil(pagesList[state].totalCounts / limit);
  }

  return {
    pagination,
    setPagination,
    replaceStateKey,
    addNewPage,
    getPage,
    getTotalPages,
  };
}

