export type IAssessorChangeRequestStatus = "pending" | "approved" | "rejected";

export type IAssessorChangeRequestStatusFilter = IAssessorChangeRequestStatus | "answered";

export interface IChangeAssessorRequestSearchFields{
    "fullNameEmail": string
    "status": IAssessorChangeRequestStatusFilter
    "page": number
}

export interface IRequestAssessorChange {
    "assessorChangeRequests": Array<IRequestAssessorChangeRequestData>	
    "totalPages": number
}

export interface IRequestAssessorChangeFetched {
    "assessorChangeRequests": Array<IRequestAssessorChangeRequestDataFetched>	
    "totalPages": number
}


interface IAssessorChangeRequestAssessor{
	"id": number
	"name": string
	"lastName": string
	"email" : string
	"urlPhoto": string
}

interface IAssessorChangeRequestStudent{
	"id": number
	"name": string
	"lastName": string
  "email": string
  "urlPhoto": string
  "topic": {
    "id": number
    "name": string
    "thematicAreas": Array<IAssessorChangeRequestThematicArea>
  }
}

export interface IRequestAssessorChangeRequestData{
    "id": number
    "registerTime": Date
    "status": IAssessorChangeRequestStatus
    "reason": string
    "response": string
    "responseTime": Date
    "student": IAssessorChangeRequestStudent
    "assessors": Array<IAssessorChangeRequestAssessor>
}

export interface IRequestAssessorChangeRequestDataFetched{
    "id": number
    "registerTime": string
    "status": IAssessorChangeRequestStatus
    "reason": string
    "response": string
    "responseTime": string
    "student": IAssessorChangeRequestStudent
    "assessors": Array<IAssessorChangeRequestAssessor>
}

export interface IRequestAssessorChangeRequestDataDetail{
    "id": number
    "registerTime": Date
    "status": IAssessorChangeRequestStatus
    "reason": string
    "response": string
    "responseTime": Date
    "student": IAssessorChangeRequestStudent
    "newAssessor": Array<IAssessorChangeRequestAssessor>
    "previousAssessors": Array<IAssessorChangeRequestAssessor>
}

export interface IRequestAssessorChangeRequestDataDetailFetched{
    "id": number
    "registerTime": Date
    "status": IAssessorChangeRequestStatus
    "reason": string
    "response": string
    "responseTime": Date
    "student": IAssessorChangeRequestStudent
    "newAssessor": Array<IAssessorChangeRequestAssessor>
    "previousAssessors": Array<IAssessorChangeRequestAssessor>
}


export interface IAssessorChangeRequestSearchFields{
	"fullNameEmail": string
	"status": IAssessorChangeRequestStatus
	"page": number
}

export interface ISelectRequestAssessorChangeOptions {
    id: number | null;
    option: "detail" | "denny" | "accept" | null
    openModal: boolean;
}

export interface IAssessorChangeRequestSearchFieldsStore{
    "fullNameEmail": string
      "status": IAssessorChangeRequestStatusFilter
      "page": number
      setFullNameEmail: (value: string) => void,
        setPage: (value: number) => void,
        setStatusTabFilter: (value: IAssessorChangeRequestStatusFilter) => void,
      setFullNameEmailPage: (value: string) => void,
      clearFullNameEmailPage: () => void,
      clear: () => void
}

export interface AssessorChangeCardRequestProps {
    request: IRequestAssessorChangeRequestData;
    onApprove: () => void;
    onReject: () => void;
}

export interface IAssessorChangeHistoryRequestsTableProps {
  requests: Array<IRequestAssessorChangeRequestData>;
  onViewDetails: (value: any) => void;
}

export interface IAssessorChangeAvailableAssessorsListProps{
  selectedAssessorId: number | null,
  selectedIdThematicAreas: Array<number>
  setSelectedAssessorId: (value: number | null)=>void,
}


export interface IAssessorChangePendingRequestsListProps {
  requests: Array<IRequestAssessorChangeRequestData>;
  onApprove: (value: number) => void;
  onReject: (value: number) => void;
}

export interface IAssessorChangeAssignmentModalProps {
  open: boolean
  idRequest: number
  onOpenChange: (open: boolean) => void
  refetch: () => Promise<void>
}


export interface IAssessorChangeApproveModalProps {
  isOpen: boolean;
  idRequest: number
  onClose: () => void;
}

export interface IAssessorChangeRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  idRequest: number
  refetch: () => Promise<void>
}

export interface INotAssessorChangeRequestFoundProps {
    type: IAssessorChangeRequestStatusFilter,
    appliedFilters: boolean
}

export interface IAssessorChangeRequestPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface IAssessorChangeRequestSearchFilterProps{
    searchTerm: string
    statusValue: IAssessorChangeRequestStatusFilter
    onSearchChange: (value: string) => void
    onStatusValueChange: (value: IAssessorChangeRequestStatusFilter) => void,
    clearTerm: () => void
}

export interface IAssessorChangeRequestThematicArea{
  id: number
  description: string
}

export interface IAssessorChangeRequestAdvisorAssign {
  id: number
  firstName: string
  lastName: string
  email: string
  code: string
  thematicAreas: IAssessorChangeRequestThematicArea[]
  assignedStudentsQuantity: number
  capacity: number
  profilePicture: string
}

export interface IAssessorChangeRequestStudentAssign {
  id: number
  firstName: string
  lastName: string
  email: string
  code: string
  thematicAreas: Array<IAssessorChangeRequestThematicArea>
  urlPhoto: string
  advisorId: number | null
}

export interface IAssessorChangeRequestAssignmentModalProps {
  open: boolean
  request: IRequestAssessorChangeRequestData
  idRequest: number
  onOpenChange: (open: boolean) => void
  refetch: ()=>Promise<void>
}

export interface IAssessorChangeSearchCriteriaAssessorListProps
{
  "fullNameEmail": string
  "page": 1
}

export interface IAssessorChangeRequestSearchCriteriaAvailableAdvisorList {
  idThematicAreas: Array<number>
  fullNameEmailCode: string
  page: number
}

export interface IAssessorChangeRequestSearchCriteriaAvailableAdvisorList {
  idThematicAreas: Array<number>
  fullNameEmailCode: string
  page: number
}