import { useQuery} from "@tanstack/react-query";

import { getTerminationConsultancyList, getTerminationConsultancyRequest, getTerminationRequestAssessorList, getTerminationRequestStudentList } from "../services/solicitud-cese-asesoria";
import { ICessationRequestSearchCriteriaAvailableAdvisorList, IRequestTerminationConsultancySearchFields } from "../types/cessation-request";


const useRequestTerminationList = (searchCriteriaStore: IRequestTerminationConsultancySearchFields) => {

    const queryRequestTerminationList = useQuery({
        queryKey: ['consultancy-list', searchCriteriaStore.fullNameEmail, searchCriteriaStore.status, searchCriteriaStore.page],
        queryFn: () =>
            getTerminationConsultancyList(searchCriteriaStore).then((res) => res),
        
    });

    return queryRequestTerminationList;
}


const useRequestTerminationDetail = (idRequest: number | null) => {

    const queryCessationRequestDetail = useQuery({
        queryKey: ['consultancy-request', idRequest],
        queryFn: () =>
            getTerminationConsultancyRequest(idRequest).then((res) => res),
        
    })

    return queryCessationRequestDetail
}


const useRequestTerminationFullStudentList = (idRequest: number) => {

    const queryRequestStudentList = useQuery({
        queryKey: ['request-termination-student-list', idRequest],
        queryFn: () =>
            getTerminationRequestStudentList(idRequest).then((res) => res),
        
    })

    return queryRequestStudentList
}


const useRequestTerminationAdvisorPerThematicArea = (searchCriteria: ICessationRequestSearchCriteriaAvailableAdvisorList) => {
    const queryRequestStudentList = useQuery({
        queryKey: ['request-termination-assessor-list-per-thematic-area', searchCriteria.idThematicArea, searchCriteria.fullNameEmailCode, searchCriteria.page],
        queryFn: () =>
            getTerminationRequestAssessorList(searchCriteria).then((res) => res),
        
    })

    return queryRequestStudentList
}





export { useRequestTerminationList, useRequestTerminationDetail, useRequestTerminationFullStudentList, useRequestTerminationAdvisorPerThematicArea }