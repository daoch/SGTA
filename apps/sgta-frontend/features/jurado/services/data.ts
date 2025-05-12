const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function listarTemasCicloActulXEtapaFormativa(
  etapaFormativaId: number,
) {
  try {
    const response = await fetch(
      `${baseUrl}/temas/listarTemasCicloActualXEtapaFormativa/${etapaFormativaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error : fetching  data de temas por etapa formativa:",
      error,
    );
    return [];
  }
}

export async function listarJornadasExposicionSalas(etapaFormativaId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/jornada-exposcion-salas/listar-jornadas-salas/${etapaFormativaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(
      "Error : fetching  data de jorandas y salas  por etapa formativa:",
      error,
    );
    return [];
  }
}

export async function listarBloquesHorariosExposicion(exposicionId: number) {
  // return [
  //   { key: "12-05-2025|19:00|V202", range: "19:00 - 20:00" },
  //   { key: "12-05-2025|19:00|V203", range: "19:00 - 20:00" },
  //   { key: "12-05-2025|19:00|V204", range: "19:00 - 20:00" },

  //   { key: "12-05-2025|20:00|V202", range: "20:00 - 21:00" },
  //   { key: "12-05-2025|20:00|V203", range: "20:00 - 21:00" },
  //   { key: "12-05-2025|20:00|V204", range: "20:00 - 21:00" },

  //   { key: "12-05-2025|21:00|V202", range: "21:00 - 22:00" },
  //   { key: "12-05-2025|21:00|V203", range: "21:00 - 22:00" },
  //   { key: "12-05-2025|21:00|V204", range: "21:00 - 22:00" },
  // ];
  try {
    const response = await fetch(
      `${baseUrl}/bloqueHorarioExposicion/listarBloquesHorarioExposicionByExposicion/${exposicionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Bloques horarios por exposición:", data);
    return data;
  } catch (error) {
    console.error(
      "Error al obtener los bloques horarios de exposición:",
      error,
    );
    return [];
  }
}
