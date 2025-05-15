import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card"
import { useAssessorChangeRequestSearchCriteriaStore } from "@/features/asesores/store/assessor-change-request-filters"
import RequestSearchFilters from "@/features/asesores/components/assessor-change-request/search-filters-request-list";
import PendingAssessorChangeRequestsList from "@/features/asesores/components/assessor-change-request/list-pending-requests";
import AssessorChangeRequestHistoryTable from "@/features/asesores/components/assessor-change-request/list-approved-rejected-requests"
import AssessorChangeRequestPagination from "@/features/asesores/components/assessor-change-request/pagination-assessor-change-request";
import AssessorChangeRequestDetail from "@/features/asesores/components/assessor-change-request/modal-detail";
import AssessorChangeRejectModal from "@/features/asesores/components/assessor-change-request/modal-reject";
import { AssessorChangeAssignmentModal } from "@/features/asesores/components/assessor-change-request/modal-assignment-students";
import { Loader2 } from "lucide-react";
import { useRequestAssessorChangeDetail, useRequestAssessorChangeList } from "@/features/asesores/queries/assessor-change-request";
import NotFoundChangeAssessorRequests from "@/features/asesores/components/assessor-change-request/not-assessor-change-request-found";

interface IRequestOptions {
    id: number | null;
    option: "detail" | "denny" | "accept" | null
    openModal: boolean;
}


const Page: React.FC = () => {
    const searchCriteriaStore = useAssessorChangeRequestSearchCriteriaStore()
    const initialStateOption = {id: null, option: null, openModal: false}
    const [ selectOption, setSelectOption ] = useState<IRequestOptions>(initialStateOption);
    const { isLoading, data, refetch } = useRequestAssessorChangeList(searchCriteriaStore)
    const { isLoading: loadingRequestDetail, data: dataRequestDetail} = useRequestAssessorChangeDetail(selectOption?.id ?? null)
    
    useEffect(()=>{
        searchCriteriaStore.clear()
    }, [])


    useEffect(()=>{
        refetch()
    }, [
        searchCriteriaStore.page,
        searchCriteriaStore.fullNameEmail,
        searchCriteriaStore.status
    ])
    
    
    
    const handlePageChange = (page: number) => {
        searchCriteriaStore.setPage(page);
    };


    return(
        <div>
            <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        Solicitudes de Cambio de Asesor
                    </h1>
                    <p className="text-muted-foreground max-w-3xl">
                        Revise y gestione las solicitudes de cambio de asesor enviadas por los alumnos.
                        Al aprobar una solicitud, deberá reasignar los tesistas afectados a nuevos asesores.
                    </p>
                </div>

                {/* Filters Tab */}
                <Card className="p-4 shadow-sm">
                    {
                    <RequestSearchFilters
                        searchTerm={searchCriteriaStore.fullNameEmail}
                        onSearchChange={searchCriteriaStore.setFullNameEmailPage}
                        statusValue={searchCriteriaStore.status}
                        onStatusValueChange={searchCriteriaStore.setStatusTabFilter}
                        clearTerm={searchCriteriaStore.clearFullNameEmailPage}
                    />
                    }
                </Card>

                {/* Content */}
                <div>
                    {(()=>{
                        if (isLoading)
                            return (
                                <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <p className="mt-4">
                                        Cargando solicitudes...
                                    </p>
                                </div>
                            )
                        if (data?.assessorChangeRequests.length === 0)
                            return (
                                <NotFoundChangeAssessorRequests type={searchCriteriaStore.status} appliedFilters={searchCriteriaStore.fullNameEmail !== ""}/>
                            )
                        return (
                            <div>
                                {searchCriteriaStore.status === 'pending' ? (
                                <PendingAssessorChangeRequestsList
                                    requests={data?.assessorChangeRequests ?? []}
                                    onApprove={
                                        (value)=>{
                                            setSelectOption({id: value, option: "accept", openModal: true})
                                        }}
                                    onReject={
                                        (value)=>{
                                            setSelectOption({id: value, option: "denny", openModal: true})
                                        }}
                                />
                                ) : (
                                    <AssessorChangeRequestHistoryTable
                                        requests={data?.assessorChangeRequests ?? []}
                                        onViewDetails={(value)=>{setSelectOption({id: value, option: "detail", openModal: true})}}
                                    />
                                    
                                )}
                            </div>
                        )
                    })() }
                </div>
                
                {/* Pagination */}
                <br />
                {!isLoading  && (
                    <AssessorChangeRequestPagination
                        currentPage={searchCriteriaStore.page}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Modals */}
                
                {dataRequestDetail&&
                    <AssessorChangeAssignmentModal
                        open={selectOption?.option === "accept"}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setSelectOption(initialStateOption)
                            }
                        }}
                        request={dataRequestDetail}  
                    />
                    
                }
                
                {
                <AssessorChangeRejectModal
                    isOpen={selectOption?.option === "denny"}
                    onClose={() => setSelectOption(initialStateOption)}
                    request={dataRequestDetail ?? null}
                    loading={loadingRequestDetail}
                />
                }
                
                <AssessorChangeRequestDetail
                    isOpen={selectOption?.option === "detail"}
                    onClose={() => setSelectOption(initialStateOption)}
                    request={dataRequestDetail ?? null}
                    loading={loadingRequestDetail}
                    
                />
                
            </div>
        </div>
    )
}

export default Page