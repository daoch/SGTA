export interface IRequestTerminationConsultancy {
	"requestTermmination": Array<IRequestTerminationConsultancyRequestData>	
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


export interface IRequestTerminationConsultancySearchFields{
	"fullNameEmail": string
	"status": IRequestTerminationConsultancyRequestStatusFilter
	"page": number
}


export interface IRequestTerminationConsultancySearchFieldsStore{
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

export type IRequestTerminationConsultancyRequestStatus = "pending" | "approved" | "rejected";

export type IRequestTerminationConsultancyRequestStatusFilter = IRequestTerminationConsultancyRequestStatus | "answered";

export interface IThematicAreaCessationRequest{
  id: number
  description: string
}

export interface IStudentCessationRequest {
  id: number
  firstName: string
  lastName: string
  email: string
  code: string
  thematicArea: IThematicAreaCessationRequest
  profilePicture: string
  advisorId: number | null
}
  


export interface IAdvisorCessationRequest {
  id: number
  firstName: string
  lastName: string
  email: string
  code: string
  thematicAreas: IThematicAreaCessationRequest[]
  assignedStudentsQuantity: number
  capacity: number
  profilePicture: string
}
  

export interface ISearchCriteriaAvailableAdvisorList {
  idThematicArea: number | null
  fullNameEmailCode: string
  page: number
}

export interface IListAvailableAdvisorList{
  advisors: Array<IAdvisorCessationRequest>
  totalPages: number
}