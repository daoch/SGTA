import {
  IAssessorChangeRequestStatus,
  IChangeAssessorRequestSearchFields,
  IRequestAssessorChange,
  IRequestAssessorChangeRequestDataDetail,
} from "@/features/asesores/types/assessor-change-request";
import { mockAssessorChangeRequests } from "../mocks/requests/assessor-change-requests";

// Service to get all request for consultancy termination
export async function getAssessorChangeRequestList(
  searchCriteria: IChangeAssessorRequestSearchFields,
): Promise<IRequestAssessorChange | null> {
  const ELEMENTS_PER_PAGE = 10;
  /*
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/";
    const urlFetch = `${BASE_URL}coordinators/advisor-change-requests?page=${searchCriteria.page}&size=${ELEMENTS_PER_PAGE}`;
    try {
        const response = await fetch(urlFetch, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const data: IRequestAssessorChangeFetched = await response.json();
        const assessorChangeRequestsTransformedDates = data.assessorChangeRequests ? data.assessorChangeRequests.map(item => (
            {
                ...item,
                registerTime: new Date(item.registerTime),
                responseTime: new Date(item.responseTime)
            })) : [];

        return {
            "assessorChangeRequests": assessorChangeRequestsTransformedDates,
            "totalPages": data.totalPages
        };
    } catch (error) {
        console.error(`Error al hacer fetch en ${urlFetch}:`, error);
        return {
            "assessorChangeRequests": 	[],
            "totalPages": 0
        };
    }
    */
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const parsedRequests = mockAssessorChangeRequests.map((request) => ({
    ...request,
    registerTime: new Date(request.registerTime),
    responseTime: new Date(request.responseTime),
    status: <IAssessorChangeRequestStatus>request.status,
  }));
  const filterByStatus = parsedRequests.filter(
    (request) =>
      request.status === searchCriteria.status ||
      (searchCriteria.status === "answered" &&
        (request.status === "approved" || request.status === "rejected")),
  );
  const filteredByFullNameEmail = searchCriteria.fullNameEmail.trim()
    ? filterByStatus.filter((request) => {
        const fullName =
          `${request.student.name} ${request.student.lastName}`.toLowerCase();
        const email = request.student.email.toLowerCase();
        const search = searchCriteria.fullNameEmail.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      })
    : filterByStatus;
  const filterByPagination = filteredByFullNameEmail.slice(
    (searchCriteria.page - 1) * ELEMENTS_PER_PAGE,
    searchCriteria.page * ELEMENTS_PER_PAGE,
  );
  return {
    assessorChangeRequests: filterByPagination,
    totalPages: Math.ceil(filteredByFullNameEmail.length / ELEMENTS_PER_PAGE),
  };
}

// Service to get an spceficis assessor change request
export async function getAssessorChangeRequestDetail(
  idRequest: number | null,
): Promise<IRequestAssessorChangeRequestDataDetail | null> {
  /*
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/";
    const urlFetch = `${BASE_URL}coordinators/advisor-change-requests/${idRequest}`;
    try {
        const response = await fetch(urlFetch, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const data: IRequestAssessorChangeRequestDataDetailFetched = await response.json();
        const termminationRequestsTransformedDates: IRequestAssessorChangeRequestDataDetail = {
            ...data,
            registerTime: new Date(data.registerTime),
            responseTime: new Date(data.responseTime)
        };
        return termminationRequestsTransformedDates;
    } catch (error) {
        console.error(`Error al hacer fetch en ${urlFetch}:`, error);
        return null;
    }
    */
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const requestFetched = mockAssessorChangeRequests.find(
    (request) => request.id === idRequest,
  );
  if (!requestFetched) return null;
  const registerTime = new Date(requestFetched.registerTime);
  const responseTime = new Date(requestFetched.responseTime);
  const newAssessor = [
    {
      id: 1,
      name: "Jaime",
      lastName: "Pereda",
      email: "jaimP@email.com",
      urlPhoto: "",
    },
  ];
  const previousAssessors = [
    {
      id: 2,
      name: "Jorge",
      lastName: "Reyes",
      email: "jorgR@email.com",
      urlPhoto: "",
    },
  ];
  const status = <IAssessorChangeRequestStatus>requestFetched.status;
  const registerRetrieved = {
    ...requestFetched,
    registerTime,
    responseTime,
    status,
    previousAssessors,
    newAssessor,
  };

  return registerRetrieved;
}

// Service to reject a consultancy termination request
export async function rejectAssessorChangeRequest(
  requestId: number,
  responseText: string,
): Promise<void> {
  const BASE_URL = process.env.BASE_URL ?? "http://localhost:5000/";
  const url = `${BASE_URL}solicitudes/advisor-change-requests/${requestId}/reject`;

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
  const BASE_URL = process.env.BASE_URL ?? "http://localhost:5000/";
  const url = `${BASE_URL}solicitudes/advisor-change-requests/${requestId}/approve`;

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
