import { useMutation, useQuery} from "@tanstack/react-query";

import { approveTerminationConsultancyRequest, getTerminationConsultancyList, getTerminationConsultancyRequest, getTerminationRequestAssessorList, rejectTerminationConsultancyRequest } from "../services/solicitud-cese-asesoria";
import { ICessationRequestSearchCriteriaAvailableAdvisorList, IRequestTerminationConsultancySearchFields } from "../types/cessation-request";


const useRequestTerminationList = (searchCriteriaStore: IRequestTerminationConsultancySearchFields) => {
  const queryKey = ['cessation-request-list', searchCriteriaStore.fullNameEmail, searchCriteriaStore.status, searchCriteriaStore.page];
  const queryRequestTerminationList = useQuery({
        queryKey,
        queryFn: () =>
            getTerminationConsultancyList(searchCriteriaStore).then((res) => res) 
    });
    return queryRequestTerminationList
}

export function useRejectTerminationRequest() {
  return useMutation({
    mutationFn: ({
      requestId,
      responseText,
    }: {
      requestId: number;
      responseText: string;
    }) => rejectTerminationConsultancyRequest(requestId, responseText),
  });
}

export function useApproveTerminationRequest() {
  return useMutation({
    mutationFn: ({
      requestId,
      responseText,
    }: {
      requestId: number;
      responseText: string;
    }) => approveTerminationConsultancyRequest(requestId, responseText),
  });
}

const useRequestTerminationDetail = (idRequest: number | null) => {
    const queryCessationRequestDetail = useQuery({
        queryKey: ['cessation-request-detail', idRequest],
        queryFn: () =>
            getTerminationConsultancyRequest(idRequest).then((res) => res),
        
    })

    return queryCessationRequestDetail
}


const useRequestTerminationAdvisorPerThematicArea = (searchCriteria: ICessationRequestSearchCriteriaAvailableAdvisorList) => {
    const queryRequestStudentList = useQuery({
        queryKey: ['cessation-request-detail-assessor-list-per-thematic-area', searchCriteria.idThematicAreas, searchCriteria.fullNameEmailCode, searchCriteria.page],
        queryFn: () =>
            getTerminationRequestAssessorList(searchCriteria).then((res) => res),
        
    })

    return queryRequestStudentList
}





export { useRequestTerminationList, useRequestTerminationDetail, useRequestTerminationAdvisorPerThematicArea }