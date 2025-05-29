import AppLoading from "@/components/loading/app-loading";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { Toaster } from "sonner";
import { ExposicionList } from "../components/exposicion-list";
import { Pagination } from "../components/exposicion-pagination";
import { ExposicionesFilterForm } from "../components/exposiciones-filter-form";
import ModalPlanificadorCoordinador from "../components/modal-planificador-coordinador";
import { useExposicionFilters } from "../hooks/use-exposicion-filters";
import {
  Filtros,
  useExposicionFilterForm,
} from "../hooks/use-exposicion-filters-form";
import { useClientPagination } from "../hooks/use-exposiciones-pagination";
import { useFetchExposicionFilters } from "../hooks/use-fetch-exposicion-filters";
import { useFetchExposiciones } from "../hooks/use-fetch-exposiciones";

export const ExposicionesCoordinadorPage: FC = () => {
  const coordinadorId = 13;

  const [modalOpen, setModalOpen] = useState(false);

  const {
    exposiciones,
    loading: loadingExp,
    error: errorExp,
  } = useFetchExposiciones(coordinadorId);
  const {
    options,
    loading: loadingOpts,
    error: errorOpts,
  } = useFetchExposicionFilters(coordinadorId);

  const [activeFilters, setActiveFilters] = useState<Filtros>({});
  const { control } = useExposicionFilterForm(setActiveFilters);

  const filtered = useExposicionFilters(exposiciones, activeFilters);
  const { page, pageSize, total, currentItems, goToPage } = useClientPagination(
    filtered,
    10,
  );

  if (loadingExp || loadingOpts) return <AppLoading />;
  if (errorOpts) return <p>Error filtros: {errorOpts}</p>;
  if (errorExp) return <p>Error exposiciones: {errorExp}</p>;

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <h1 className="text-2xl font-bold">Exposiciones</h1>
      <div className="flex items-end">
        <ExposicionesFilterForm
          control={control}
          etapasFormativas={options.etapasFormativas}
          ciclos={options.ciclos}
          estados={options.estados}
        />
        <Button onClick={() => setModalOpen(true)} variant="default">
          Planificador de Exposiciones
        </Button>
      </div>
      <div className="flex flex-col w-full h-full gap-4 justify-between">
        <ExposicionList items={currentItems} />
        <div className="flex justify-between items-end">
          <span className="text-center text-sm text-muted-foreground">
            Mostrando {currentItems.length} de {total} exposiciones
          </span>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={goToPage}
          />
        </div>
      </div>
      <ModalPlanificadorCoordinador
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <Toaster position="bottom-right" richColors />
    </div>
  );
};