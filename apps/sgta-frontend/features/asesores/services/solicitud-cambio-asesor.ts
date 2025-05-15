import { IChangeAssessorRequestSearchFields, IRequestAssessorChange, IRequestAssessorChangeFetched, IRequestAssessorChangeRequestDataDetail, IRequestAssessorChangeRequestDataDetailFetched } from "@/features/asesores/types/assessor-change-request";

// Service to get all request for consultancy termination
export async function getAssessorChangeRequestList(
    searchCriteria: IChangeAssessorRequestSearchFields
): Promise<IRequestAssessorChange | null> {
  
  const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const ELEMENTS_PER_PAGE = 10
    const urlFetch = `${BASE_URL}coordinators/advisor-change-requests?page=${searchCriteria.page}&size=${ELEMENTS_PER_PAGE}`
    try {
        const response = await fetch(urlFetch, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
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
        }
    } catch (error) {
        console.error(`Error al hacer fetch en ${urlFetch}:`, error);
        return {
            "assessorChangeRequests": 	[],
            "totalPages": 0
        }
    }  
}


// Service to get an spceficis assessor change request
export async function getAssessorChangeRequestDetail(
    idRequest: number | null
): Promise<IRequestAssessorChangeRequestDataDetail | null> {
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const urlFetch = `${BASE_URL}coordinators/advisor-change-requests/${idRequest}`
    try {
        const response = await fetch(urlFetch, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
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
        return termminationRequestsTransformedDates
    } catch (error) {
        console.error(`Error al hacer fetch en ${urlFetch}:`, error);
        return null
    }
}

// Service to reject a consultancy termination request
export async function rejectAssessorChangeRequest(
  requestId: number,
  responseText: string
): Promise<void> {
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const url = `${BASE_URL}coordinators/advisor-change-requests/${requestId}/reject`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
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
  responseText: string
): Promise<void> {
  const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
  const url = `${BASE_URL}coordinators/advisor-change-requests/${requestId}/approve`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
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
