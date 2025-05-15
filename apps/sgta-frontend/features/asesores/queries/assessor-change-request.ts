import { useQuery } from "@tanstack/react-query";
import { getAssessorChangeRequestDetail, getAssessorChangeRequestList } from "../services/solicitud-cambio-asesor";
import { getTerminationRequestAssessorList } from "../services/solicitud-cese-asesoria";
import { IAssessorChangeRequestSearchCriteriaAvailableAdvisorList } from "../types/assessor-change-request";


const useRequestAssessorChangeList = (searchCriteriaStore: any) => {

    const queryAssessorChangeRequestList = useQuery({
        queryKey: ['request-assessor-change-list', searchCriteriaStore.fullNameEmail, searchCriteriaStore.status, searchCriteriaStore.page],
        queryFn: () =>
            getAssessorChangeRequestList(searchCriteriaStore).then((res) => res),
        
    });

    return queryAssessorChangeRequestList;
}

const useRequestAssessorChangeDetail = (idRequest: number | null) => {

    const queryAssessorChangeRequestDetail = useQuery({
        queryKey: ['request-assessor-change-detail', idRequest],
        queryFn: () =>
            getAssessorChangeRequestDetail(idRequest).then((res) => res),
        
    });

    return queryAssessorChangeRequestDetail;
}

const useRequestAssessorChangeAdvisorPerThematicArea = (searchCriteria: IAssessorChangeRequestSearchCriteriaAvailableAdvisorList) => {
    const queryRequestStudentList = useQuery({
        queryKey: ['request-termination-assessor-list-per-thematic-area', searchCriteria.idThematicArea, searchCriteria.fullNameEmailCode, searchCriteria.page],
        queryFn: () =>
            getTerminationRequestAssessorList(searchCriteria).then((res) => res),
        
    })

    return queryRequestStudentList
}

export { useRequestAssessorChangeList, useRequestAssessorChangeDetail, useRequestAssessorChangeAdvisorPerThematicArea };