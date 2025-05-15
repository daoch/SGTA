import { ITerminationConsultancyRequest, IRequestTerminationConsultancyRequestData, IRequestTerminationConsultancySearchFields, IListAvailableAdvisorList, ICessationRequestStudent, ICessationRequestSearchCriteriaAvailableAdvisorList } from "@/features/asesores/types/cessation-request"
import { mockAssessorListCessationRequest, mockRequestsCessationRequest, mockStudentListCessationRequest } from "@/features/asesores/mocks/solicitud-cese-asesoria/mock-solicitud-cese-asesoria";


// Service to get all request for consultancy termination
export async function getTerminationConsultancyList(
    searchCriteria: IRequestTerminationConsultancySearchFields
): Promise<ITerminationConsultancyRequest> {
    const ELEMENTS_PER_PAGE = 10
    //const totalPages = mockSolicitudesCeseAsesoria.totalPages
    const terminationRequests = mockRequestsCessationRequest.requestTermmination
    const filteredTerminationRequestsInput = terminationRequests.filter(terminationRequest => {
        const fullName = `${terminationRequest.assessor.name} ${terminationRequest.assessor.lastName}`;
        return fullName.toLowerCase().includes(searchCriteria.fullNameEmail.toLowerCase()) || terminationRequest.assessor.email.toLowerCase().includes(searchCriteria.fullNameEmail.toLowerCase());
    });
    const filteredTerminationRequestsStatus = filteredTerminationRequestsInput.filter(terminationRequest=>{
        return  (searchCriteria.status === "answered" ? (terminationRequest.status === "approved" || terminationRequest.status === "rejected") : (terminationRequest.status === searchCriteria.status))
    })
    const filteredTerminationRequestsPagination = filteredTerminationRequestsStatus.slice(ELEMENTS_PER_PAGE * (searchCriteria.page - 1) , ELEMENTS_PER_PAGE * searchCriteria.page)
    if (filteredTerminationRequestsPagination.length > 0)
        filteredTerminationRequestsPagination[0].responseTime = new Date()

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        "requestTermmination": 	filteredTerminationRequestsPagination,
	    "totalPages": Math.ceil(filteredTerminationRequestsStatus.length / ELEMENTS_PER_PAGE)
    }
}
  


// Service to get an specific request for consultancy termination
export async function getTerminationConsultancyRequest(
    idRequest: number | null
): Promise<IRequestTerminationConsultancyRequestData | null> {
    if (idRequest === null)
        return null
    
    const terminationRequests = mockRequestsCessationRequest.requestTermmination
    const selectedTerminationRequest = terminationRequests.find(terminationRequest=>{
        return  terminationRequest.id === idRequest
    })
    await new Promise(resolve => setTimeout(resolve, 500));
    return selectedTerminationRequest ?? null
    
}



// Service to get all student list information for consultancy termination
export async function getTerminationRequestStudentList(
    idRequest: number | null
): Promise<Array<ICessationRequestStudent> | null> {
    if (idRequest === null)
        return null
    const studentList = mockStudentListCessationRequest;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return studentList;
    
}


// Service to get all assessor list information for consultancy termination
export async function getTerminationRequestAssessorList(
    searchCriteriaAvailableAdvisorList: ICessationRequestSearchCriteriaAvailableAdvisorList
): Promise<IListAvailableAdvisorList | null> {
    const ELEMENTS_PER_PAGE = 10;
    if (searchCriteriaAvailableAdvisorList.idThematicArea === null)
        return null
    const initialAdvisors = mockAssessorListCessationRequest.assessors.filter((advisor)=>advisor.thematicAreas?.some((thematicArea)=>thematicArea.id === searchCriteriaAvailableAdvisorList.idThematicArea))
    const filteredTerminationRequestsInput = initialAdvisors.filter(advisor => {
        const fullName = `${advisor.firstName} ${advisor.lastName}`;
        return fullName.toLowerCase().includes(searchCriteriaAvailableAdvisorList.fullNameEmailCode.toLowerCase()) || advisor.email.toLowerCase().includes(searchCriteriaAvailableAdvisorList.fullNameEmailCode.toLowerCase()) || advisor.code.toLowerCase().includes(searchCriteriaAvailableAdvisorList.fullNameEmailCode.toLowerCase());
    });

    const filteredTerminationRequestsPagination = filteredTerminationRequestsInput.slice(ELEMENTS_PER_PAGE * (searchCriteriaAvailableAdvisorList.page - 1) , ELEMENTS_PER_PAGE * searchCriteriaAvailableAdvisorList.page)
    await new Promise(resolve => setTimeout(resolve, 2500));
    return {
        "advisors": filteredTerminationRequestsPagination,
	    "totalPages": Math.ceil(filteredTerminationRequestsInput.length / ELEMENTS_PER_PAGE)
    }
    
}

