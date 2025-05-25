"use server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

import { TimeSlot } from "../types/jurado.types";

export type State = {
  message: string | null;
  errors?: Record<string, string[]>;
};

export async function updateBloquesListFirstTime(bloquesList: TimeSlot[]) {
  try {
    const response = await fetch(
      `${baseUrl}/bloqueHorarioExposicion/updateBloquesListFirstTime`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bloquesList),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(data);

    if (data.success) {
      console.log(data.message);
    } else {
      console.warn(data.message);
    }

    return data;
  } catch (error) {
    console.error("Error al actualizar la lista de bloques:", error);

    return {
      success: false,
      message: "Error inesperado al actualizar bloques",
    };
  }
}

export async function updateBloquesNextPhase(bloquesList: TimeSlot[]) {
  try {
    const response = await fetch(
      `${baseUrl}/bloqueHorarioExposicion/updateBloquesListNextPhase`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bloquesList),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    //console.log(data);

    if (data.success) {
      console.log(data.message);
    } else {
      console.warn(data.message);
    }

    return data;
  } catch (error) {
    console.error(
      "Error al actualizar la lista de bloques siguiente fase:",
      error,
    );

    return {
      success: false,
      message: "Error inesperado al actualizar bloques siguiente fase",
    };
  }
}

export async function finishPlanning(idExposicon: number) {
  try {
    const response = await fetch(
      `${baseUrl}/bloqueHorarioExposicion/finishPlanning/${idExposicon}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    //console.log(data);

    if (data.success) {
      console.log(data.message);
    } else {
      console.warn(data.message);
    }

    return data;
  } catch (error) {
    console.error("Error al terminar la planificacion:", error);

    return { success: false, message: "Error al terminar la planificación" };
  }
}
