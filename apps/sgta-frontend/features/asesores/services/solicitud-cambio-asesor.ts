export interface SolicitudCambioAsesorSearchCriteria {
  status: string; // "PENDIENTE" | "APROBADA" | "RECHAZADA" | "answered"
  fullNameEmail: string;
  page: number;
}

// Service to reject a consultancy termination request
export async function rejectAssessorChangeRequest(
  requestId: number,
  responseText: string,
): Promise<void> {
  const BASE_URL = process.env.BASE_URL ?? "http://localhost:5000";
  const url = `${BASE_URL}/solicitudes/advisor-change-requests/${requestId}/reject`;

  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: responseText,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error al rechazar solicitud: ${res.status}`);
    }

    console.log(`URL ${url} ejecutada`);
    console.log(`Solicitud ${requestId} rechazada con éxito`);
  } catch (error) {
    console.error(`Error al hacer POST en ${url}:`, error);
    throw error;
  }
}

// Service to approve a consultancy termination request
export async function approveAssessorChangeRequest(
  requestId: number,
  responseText: string,
): Promise<void> {
  const BASE_URL = process.env.BASE_URL ?? "http://localhost:5000";
  const url = `${BASE_URL}/solicitudes/advisor-change-requests/${requestId}/approve`;

  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: responseText,
      }),
    });

    if (!res.ok) {
      throw new Error(`Error al aprobar solicitud: ${res.status}`);
    }
    console.log(`URL ${url} ejecutada`);
    console.log(`Solicitud ${requestId} aprobada con éxito`);
  } catch (error) {
    console.error(`Error al hacer POST en ${url}:`, error);
    throw error;
  }
}
