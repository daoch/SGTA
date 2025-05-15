import { IChangeAssessorRequestSearchFields, IRequestAssessorChange, IRequestAssessorChangeRequestData } from "@/features/asesores/types/assessor-change-request";
import { mockRequestsAssessorChangeRequest } from "../mocks/solicitud-cambio-asesor/mock-solicitud-cambio-asesor";

// Service to get all request for consultancy termination
export async function getAssessorChangeRequestList(
    searchCriteria: IChangeAssessorRequestSearchFields
): Promise<IRequestAssessorChange> {
    const ELEMENTS_PER_PAGE = 10
    //const totalPages = mockSolicitudesCeseAsesoria.totalPages
    const assessorChangeRequests = mockRequestsAssessorChangeRequest.assessorChangeRequests
    const filteredTerminationRequestsInput = assessorChangeRequests.filter(assessorChangeRequest => {
        const fullName = `${assessorChangeRequest.student.name} ${assessorChangeRequest.student.lastName}`;
        return fullName.toLowerCase().includes(searchCriteria.fullNameEmail.toLowerCase()) || assessorChangeRequest.student.email.toLowerCase().includes(searchCriteria.fullNameEmail.toLowerCase());
    });
    const filteredTerminationRequestsStatus = filteredTerminationRequestsInput.filter(terminationRequest=>{
        return  (searchCriteria.status === "answered" ? (terminationRequest.status === "approved" || terminationRequest.status === "rejected") : (terminationRequest.status === searchCriteria.status))
    })
    const filteredTerminationRequestsPagination = filteredTerminationRequestsStatus.slice(ELEMENTS_PER_PAGE * (searchCriteria.page - 1) , ELEMENTS_PER_PAGE * searchCriteria.page)
    if (filteredTerminationRequestsPagination.length > 0)
        filteredTerminationRequestsPagination[0].responseTime = new Date()

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        "assessorChangeRequests": 	filteredTerminationRequestsPagination,
        "totalPages": Math.ceil(filteredTerminationRequestsStatus.length / ELEMENTS_PER_PAGE)
    }
}


// Service to get an spceficis assessor change request
export async function getAssessorChangeRequestDetail(
    idRequest: number | null
): Promise<IRequestAssessorChangeRequestData | null> {
    if (idRequest === null)
        return null
    
    const terminationRequests = mockRequestsAssessorChangeRequest.assessorChangeRequests
    const selectedTerminationRequest = terminationRequests.filter(assessorChangeRequest=>{
        return  assessorChangeRequest.id === idRequest
    })
    await new Promise(resolve => setTimeout(resolve, 500));
    return selectedTerminationRequest[0] ?? null
}