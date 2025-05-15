import { useMutation, useQuery } from "@tanstack/react-query";
import { approveAssessorChangeRequest, getAssessorChangeRequestDetail, getAssessorChangeRequestList, rejectAssessorChangeRequest } from "../services/solicitud-cambio-asesor";
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

export function useRejectAssessorChangeRequest() {
  return useMutation({
    mutationFn: ({
      requestId,
      responseText,
    }: {
      requestId: number;
      responseText: string;
    }) => rejectAssessorChangeRequest(requestId, responseText),
  });
}

export function useApproveAssesorChangeRequest() {
  return useMutation({
    mutationFn: ({
      requestId,
      responseText,
    }: {
      requestId: number;
      responseText: string;
    }) => approveAssessorChangeRequest(requestId, responseText),
  });
}


const useAssessorChangeRequestAdvisorPerThematicArea = (searchCriteria: IAssessorChangeRequestSearchCriteriaAvailableAdvisorList) => {
    const queryRequestStudentList = useQuery({
        queryKey: ['assessor-change-request-detail-assessor-list-per-thematic-area', searchCriteria.idThematicAreas, searchCriteria.fullNameEmailCode, searchCriteria.page],
        queryFn: () =>
            getTerminationRequestAssessorList(searchCriteria).then((res) => res),
    })
    return queryRequestStudentList
}

export { useRequestAssessorChangeList, useRequestAssessorChangeDetail, useAssessorChangeRequestAdvisorPerThematicArea};