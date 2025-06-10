import { pageTemasTexts } from "@/features/temas/types/solicitudes/constants";
import {
  fetchCarrerasMiembroComite,
  lenTemasPorCarrera,
  listarTemasPorCarrera,
} from "@/features/temas/types/solicitudes/data";
import { EstadoTemaNombre } from "@/features/temas/types/temas/enums";
import { usePagination } from "@/hooks/temas/use-pagination";
import { useCallback, useState } from "react";

const LIMIT = 8;
const FETCH_ALL_PAGES = true;

export function usePaginationTemas() {
  const [estadoTema, setEstadoTema] = useState<EstadoTemaNombre>(
    EstadoTemaNombre.INSCRITO,
  );
  const [loading, setLoading] = useState(false);
  const [carrerasIds, setCarrerasIds] = useState<number[]>([]);
  const {
    pagination: temas,
    setPagination,
    replaceStateKey,
    addNewPage,
    getPage,
    getTotalPages,
  } = usePagination(pageTemasTexts.initialPagesList, LIMIT);

  // Cargar carreras y la primera página de cada estado
  const fetchFirstPageAndSetTotalCounts = useCallback(async () => {
    setLoading(true);
    try {
      const carreras = await fetchCarrerasMiembroComite();
      const ids = (carreras || []).map((c) => c.id);
      setCarrerasIds(ids);

      if (ids.length > 0) {
        await fetchTotalCountsAndFirstPages(ids);
      }
    } catch (error) {
      console.error("No se pudo cargar las carreras del usuario: " + error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar una página específica
  const fetchPage = useCallback(
    async (
      state: EstadoTemaNombre,
      page: number,
      carrerasIdsParam?: number[],
    ) => {
      setLoading(true);
      try {
        const ids = carrerasIdsParam || carrerasIds;
        if (ids && ids.length > 0) {
          const data = await listarTemasPorCarrera(
            ids[0], // TODO: Validar si se debe usar solo el primero
            state,
            LIMIT,
            (page - 1) * LIMIT, // Offset
          );
          addNewPage(state, page, data);
        }
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    },
    [carrerasIds, addNewPage],
  );

  // Cargar los conteos y la primera página de cada estado
  const fetchTotalCountsAndFirstPages = useCallback(
    async (ids: number[]) => {
      setLoading(true);
      try {
        const estadosConPages: EstadoTemaNombre[] = Object.keys(
          temas,
        ) as EstadoTemaNombre[];

        const temasLists = await Promise.all(
          estadosConPages.map((state) =>
            listarTemasPorCarrera(ids[0], state, 2000, 0),
          ),
        );

        estadosConPages.forEach((state, idx) => {
          // Set Count
          const countList = temasLists[idx].length;
          replaceStateKey(state, "totalCounts", countList);

          // Set First Status Page
          addNewPage(state, 1, temasLists[idx].slice(0, LIMIT));
        });
      } catch (err) {
        console.error("Error loading total counts and First pages: ", err);
      } finally {
        setLoading(false);
      }
    },
    [temas, replaceStateKey, addNewPage],
  );

  // Cambiar de página
  const handlePageChange = useCallback(
    (newPage: number) => {
      replaceStateKey(estadoTema, "current", newPage);
      const existingPage = temas[estadoTema]?.pages?.[newPage];
      if (!existingPage?.length) {
        if (FETCH_ALL_PAGES) fetchAllPagesState(estadoTema, newPage);
        else fetchPage(estadoTema, newPage);
      }
    },
    [estadoTema, temas, fetchPage, replaceStateKey],
  );

  // Cambiar de tab/estado
  const handleTabChange = useCallback(
    (state: EstadoTemaNombre) => {
      setEstadoTema(state);
      if (!temas[state]) return;
      const currentPage = temas[state].current;
      const existingPage = temas[state]?.pages?.[currentPage];
      if (!existingPage?.length) {
        if (FETCH_ALL_PAGES) fetchAllPagesState(state, currentPage);
        else fetchPage(state, currentPage);
      }
    },
    [temas, fetchPage],
  );

  const fetchTotalCounts = useCallback(async () => {
    try {
      // Get All States
      const estadosConPages: EstadoTemaNombre[] = Object.keys(
        temas,
      ) as EstadoTemaNombre[];

      // Get all counts
      const counts = await Promise.all(
        estadosConPages.map((estado) =>
          lenTemasPorCarrera(carrerasIds[0], estado),
        ),
      );

      // Update state
      estadosConPages.forEach((estado, idx) => {
        replaceStateKey(estado, "totalCounts", counts[idx]);
        console.log(estado + ": count = " + counts[idx]);
      });
    } catch (err) {
      console.error("Error loading total counts", err);
    }
  }, [temas, carrerasIds, replaceStateKey]);

  const getOrFetchCarrerasIds = async () => {
    try {
      let ids = carrerasIds;
      if (!ids?.length) {
        const carreras = await fetchCarrerasMiembroComite();
        ids = (carreras || []).map((c) => c.id);
        setCarrerasIds(ids);
      }
      return ids;
    } catch (err) {
      console.error("Error loading carreras: ", err);
    }
  };

  const fetchAllPagesState = useCallback(
    async (
      state: EstadoTemaNombre,
      current?: number,
      carrerasIdsParam?: number[],
    ) => {
      setLoading(true);
      try {
        // Get Carrera Id
        let ids = await getOrFetchCarrerasIds();

        // Fetch all pages per State
        if (ids && ids.length > 0) {
          const data = await listarTemasPorCarrera(ids[0], state, 2000, 0);
          // Set TotalCounts
          replaceStateKey(state, "totalCounts", data.length);

          // Set Pages
          let page = 1;
          while (true) {
            const offset = (page - 1) * LIMIT;
            const newPage = data.slice(offset, offset + LIMIT);
            if (!newPage || newPage.length === 0) break;
            addNewPage(state, page, newPage);
            page++;
          }
          // Set current page
          replaceStateKey(state, "current", current ?? 1);
        }
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    },
    [carrerasIds, replaceStateKey, addNewPage],
  );

  return {
    estadoTema,
    setEstadoTema,
    loading,
    carrerasIds,
    temas,
    getPage,
    getTotalPages,
    handlePageChange,
    handleTabChange,
    fetchFirstPageAndSetTotalCounts,
    setPagination,
    fetchAllPagesState,
    LIMIT,
  };
}

