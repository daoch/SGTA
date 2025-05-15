import { ITerminationConsultancyRequest, IRequestTerminationConsultancySearchFields, IListAvailableAdvisorList, ICessationRequestStudent, ICessationRequestSearchCriteriaAvailableAdvisorList, ITerminationConsultancyRequestFetched, IRequestTerminationConsultancyRequestDataViewDetail, IRequestTerminationConsultancyRequestDataViewDetailFetched } from "@/features/asesores/types/cessation-request"
import { mockAssessorListCessationRequest, mockStudentListCessationRequest } from "@/features/asesores/mocks/solicitud-cese-asesoria/mock-solicitud-cese-asesoria";



// Service to get all request for consultancy termination
export async function getTerminationConsultancyList(
    searchCriteria: IRequestTerminationConsultancySearchFields
): Promise<ITerminationConsultancyRequest> {
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const ELEMENTS_PER_PAGE = 10
    const urlFetch = `${BASE_URL}coordinators/coordinators/cessation-requests?page=${searchCriteria.page}&size=${ELEMENTS_PER_PAGE}`
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

        const data: ITerminationConsultancyRequestFetched = await response.json();
        const termminationRequestsTransformedDates = data.requestTermmination.map(item => (
            {
                ...item,
                registerTime: new Date(item.registerTime),
                responseTime: new Date(item.responseTime)
            }));

        return {
            "requestTermmination": 	termminationRequestsTransformedDates,
	        "totalPages": data.totalPages
        }
    } catch (error) {
        console.error(`Error al hacer fetch en ${urlFetch}:`, error);
        return {
            "requestTermmination": 	[],
	        "totalPages": 0
        }
    }    
}
  
// Service to reject a consultancy termination request
export async function rejectTerminationConsultancyRequest(
  requestId: number,
  responseText: string
): Promise<void> {
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const url = `${BASE_URL}coordinators/coordinators/cessation-requests/${requestId}/reject`;

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

    console.log(`Solicitud ${requestId} rechazada con éxito`);
  } catch (error) {
    console.error(`Error al hacer POST en ${url}:`, error);
    throw error;
  }
}

// Service to approve a consultancy termination request
export async function approveTerminationConsultancyRequest(
  requestId: number,
  responseText: string
): Promise<void> {
  const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
  const url = `${BASE_URL}coordinators/coordinators/cessation-requests/${requestId}/approve`;
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

    console.log(`Solicitud ${requestId} aprobada con éxito`);
  } catch (error) {
    console.error(`Error al hacer POST en ${url}:`, error);
    throw error;
  }
}


// Service to get an specific request for consultancy termination
export async function getTerminationConsultancyRequest(
    idRequest: number | null
): Promise<IRequestTerminationConsultancyRequestDataViewDetail | null> {
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const url = `${BASE_URL}coordinators/coordinators/cessation-requests/viewDetail`;
    
    try {
        const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idRequest,
        }),
        });

        if (!res.ok) {
            console.error(`Error al obtener solicitud: ${res.status}`);
            return null
        }
        console.log(`Solicitud ${idRequest} obtenida con éxito`);
        const data: IRequestTerminationConsultancyRequestDataViewDetailFetched = await res.json();
        const termminationRequestsTransformedDates: IRequestTerminationConsultancyRequestDataViewDetail = {
            ...data,
            registerTime: new Date(data.registerTime),
            responseTime: new Date(data.responseTime),
            students: data.status === "pending"
            ? data.students.map(student => ({ ...student, advisorId: null }))
            : data.students
        };

        return termminationRequestsTransformedDates

    } catch (error) {
        console.error(`Error al hacer POST en ${url}:`, error);
        return null
    }
}



// Service to get all assessor list information for consultancy termination
export async function getTerminationRequestAssessorList(
    searchCriteriaAvailableAdvisorList: ICessationRequestSearchCriteriaAvailableAdvisorList
): Promise<IListAvailableAdvisorList | null> {
    const ELEMENTS_PER_PAGE = 10;
    const BASE_URL = process.env.BASE_URL??"http://localhost:5000/"
    const url = `${BASE_URL}coordinators/cessation-requests/assessors/list`;
    try {
        const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "idThematicAreas": searchCriteriaAvailableAdvisorList.idThematicAreas,
            "fullNameCodeEmail": searchCriteriaAvailableAdvisorList.fullNameEmailCode,
            "page": searchCriteriaAvailableAdvisorList.page,
            "elementsPerPage": ELEMENTS_PER_PAGE
        }),
        });

        if (!res.ok) {
        throw new Error(`Error al rechazar solicitud: ${res.status}`);
        }
        const data = await res.json()
        return data
        
    } catch (error) {
        console.error(`Error al hacer POST en ${url}:`, error);
        return null
    }
    
}
