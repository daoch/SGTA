export interface ITerminationConsultancyRequest {
	"requestTermmination": Array<IRequestTerminationConsultancyRequestData>	
	"totalPages": number
}

export interface ITerminationConsultancyRequestFetched {
	"requestTermmination": Array<IRequestTerminationConsultancyRequestDataFetched>	
	"totalPages": number
}


export interface IRequestTerminationConsultancyRequestData{
	"id": number
	"registerTime": Date
	"status": IRequestTerminationConsultancyRequestStatus
	"reason": string
	"response": string
	"responseTime": Date
	"assessor": IRequestTerminationConsultancyAssessor
	"students": Array<IRequestTerminationConsultancyStudent>
}

export interface IRequestTerminationConsultancyRequestDataViewDetail{
	"id": number
	"registerTime": Date
	"status": IRequestTerminationConsultancyRequestStatus
	"reason": string
	"response": string
	"responseTime": Date
	"assessor": IRequestTerminationConsultancyAssessor
	"students": Array<IRequestTerminationConsultancyStudentDetail>
}

export interface IRequestTerminationConsultancyRequestDataViewDetailFetched{
	"id": number
	"registerTime": string
	"status": IRequestTerminationConsultancyRequestStatus
	"reason": string
	"response": string
	"responseTime": string
	"assessor": IRequestTerminationConsultancyAssessor
	"students": Array<IRequestTerminationConsultancyStudentDetail>
}

export interface IRequestTerminationConsultancySearchFields{
	"fullNameEmail": string
	"status": IRequestTerminationConsultancyRequestStatusFilter
	"page": number
}


export interface IRequestTerminationConsultancyRequestDataFetched{
	"id": number
	"registerTime": string
	"status": IRequestTerminationConsultancyRequestStatus
	"reason": string
	"response": string
	"responseTime": string
	"assessor": IRequestTerminationConsultancyAssessor
	"students": Array<IRequestTerminationConsultancyStudent>
}

export interface IRequestTerminationConsultancySearchFields{
	"fullNameEmail": string
	"status": IRequestTerminationConsultancyRequestStatusFilter
	"page": number
}


export interface ICessationRequestSearchFieldsStore{
	"fullNameEmail": string
	"status": IRequestTerminationConsultancyRequestStatus
	"page": number
	setFullNameEmail: (value: string) => void,
    setPage: (value: number) => void,
    setStatusTabFilter: (value: IRequestTerminationConsultancyRequestStatus) => void,
	setFullNameEmailPage: (value: string) => void,
	clearFullNameEmailPage: () => void,
	clear: () => void
}

interface IRequestTerminationConsultancyAssessor{
	"id": number
	"name": string
	"lastName": string
	"email" : string
	"quantityCurrentProyects": number
	"urlPhoto": string
}



export interface IRequestTerminationConsultancyStudent{
	"id": number
	"name": string
	"lastName": string
	"topic": {
		"name": string
	}
}

export interface IRequestTerminationConsultancyStudentDetail extends IRequestTerminationConsultancyStudent {
	"code": string
	"email": string
	"urlPhoto": string
	"thematicAreas": Array<ICessationRequestThematicArea>
  	"advisorId": number | null
}

export type IRequestTerminationConsultancyRequestStatus = "pending" | "approved" | "rejected";

export type IRequestTerminationConsultancyRequestStatusFilter = IRequestTerminationConsultancyRequestStatus | "answered";

export interface ICessationRequestThematicArea{
  id: number
  description: string
}

export interface ICessationRequestStudent {
  id: number
  firstName: string
  lastName: string
  email: string
  code: string
  thematicArea: ICessationRequestThematicArea
  profilePicture: string
  
}
  


export interface ICessationRequestAdvisor {
  id: number
  firstName: string
  lastName: string
  email: string
  code: string
  thematicAreas: ICessationRequestThematicArea[]
  assignedStudentsQuantity: number
  capacity: number
  urlPhoto: string
}
  

export interface ICessationRequestSearchCriteriaAvailableAdvisorList {
  idThematicAreas: Array<number>
  fullNameEmailCode: string
  page: number
}

export interface ICessationSearchCriteriaAssessorListProps
{
  "fullNameEmail": string
  "page": 1
}

export interface IListAvailableAdvisorList{
  assessors: Array<ICessationRequestAdvisor>
  totalPages: number
}

export interface ISelectRequestCessationOptions {
    id: number | null;
    option: "detail" | "denny" | "accept" | null
    openModal: boolean;
}

export interface ICessationRequestAssignmentModalProps {
  open: boolean
  idRequest: number
  onOpenChange: (open: boolean) => void
  refetch: () => Promise<void>
}


export interface ICessationRequestPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


export interface ICessationRequestCardProps {
    request: IRequestTerminationConsultancyRequestData;
    onApprove: () => void;
    onReject: () => void;
}

export interface ICessationRequestHistoryTableProps {
  requests: Array<IRequestTerminationConsultancyRequestData>;
  onViewDetails: (value: number) => void;
}

export interface ICessationRequestAdvisorListProps{
  readonly selectedStudent: IRequestTerminationConsultancyStudentDetail
}

export interface INotCessationRequestFoundProps {
    type: IRequestTerminationConsultancyRequestStatusFilter,
    appliedFilters: boolean
}

export interface IRejectCessationRequestModalProps {
  isOpen: boolean;
  idRequest: number;
  onClose: () => void;
  refetch: () => Promise<void>
}