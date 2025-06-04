import { useEffect, useState } from "react";
import { ListExposicionXCoordinadorDTO } from "../dtos/ListExposicionXCoordiandorDTO";
import { getExposicionesInicializadasByCoordinador } from "../services/exposicion-service";

export function useFetchExposiciones(tokenId: string) {
  const [exposiciones, setExposiciones] = useState<
    ListExposicionXCoordinadorDTO[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getExposicionesInicializadasByCoordinador(tokenId);
        setExposiciones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenId]);

  return { exposiciones, loading, error };
}
