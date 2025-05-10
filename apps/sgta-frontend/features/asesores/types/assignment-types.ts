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