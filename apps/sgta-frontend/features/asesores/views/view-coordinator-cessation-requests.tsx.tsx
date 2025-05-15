import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card"
import { useCessationRequestSearchCriteriaStore } from "@/features/asesores/store/cessation-request-filters"
import RequestSearchFilters from "@/features/asesores/components/cessation-request/search-filters-request-list";
import PendingAssessorChangeRequestsList from "@/features/asesores/components/cessation-request/list-pending-requests";
import CessationRequestHistoryTable from "@/features/asesores/components/cessation-request/list-approved-rejected-requests"
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import NotCessationRequestFound from "@/features/asesores/components/cessation-request/not-cessation-request-found";
import CessationRequestDetail from "@/features/asesores/components/cessation-request/modal-detail";
import RejectCessationModal from "@/features/asesores/components/cessation-request/reject-cessation-modal";
import { AssignmentModal } from "@/features/asesores/components/cessation-request/modal-assignment-students";
import { Loader2 } from "lucide-react";
import { getTerminationConsultancyList } from "../services/solicitud-cese-asesoria";
import { ISelectRequestCessationOptions, ITerminationConsultancyRequest } from "../types/cessation-request";



const Page = () => {
    const {fullNameEmail, page, status, setPage, clear, setStatusTabFilter, setFullNameEmailPage, clearFullNameEmailPage} = useCessationRequestSearchCriteriaStore()
    const initialStateOption = {id: null, option: null, openModal: false}
    const [ selectOption, setSelectOption ] = useState<ISelectRequestCessationOptions>(initialStateOption);
    const [ data, setData ] = useState<ITerminationConsultancyRequest | null>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    
    const fetchRequests = async () => {
        setIsLoading(true)
        const data = await getTerminationConsultancyList({"fullNameEmail": fullNameEmail, "status": status, "page": page})
        if (data)
            setData(data)
        setIsLoading(false)
    }

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    useEffect(()=>{
        clear()
    }, [])


    useEffect(()=>{
        fetchRequests()
    }, [fullNameEmail, page, status])


    const handleRefetch = async () =>{
        fetchRequests()
    }

    return(
        <div>
            <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        Solicitudes de Cese de Asesoría
                    </h1>
                    <p className="text-muted-foreground max-w-3xl">
                        Revise y gestione las solicitudes de cese de asesoría enviadas por los profesores.
                        Al aprobar una solicitud, deberá reasignar los tesistas afectados a nuevos asesores.
                    </p>
                </div>

                {/* Filters Tab */}
                <Card className="p-4 shadow-sm">
                    {
                    <RequestSearchFilters
                        searchTerm={fullNameEmail}
                        onSearchChange={setFullNameEmailPage}
                        statusValue={status}
                        onStatusValueChange={setStatusTabFilter}
                        clearTerm={clearFullNameEmailPage}
                    />
                    }
                </Card>

                {/* Content */}
                
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
                    if (data?.requestTermmination.length === 0)
                    return (
                        <NotCessationRequestFound type={status} appliedFilters={fullNameEmail !== ""}/>
                    )
                    return (
                        <div>
                            {status === 'pending' ? (
                            <PendingAssessorChangeRequestsList
                                requests={data?.requestTermmination ?? []}
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
                                <CessationRequestHistoryTable
                                    requests={data?.requestTermmination ?? []}
                                    onViewDetails={(value)=>{setSelectOption({id: value, option: "detail", openModal: true})}}
                                />
                            )}
                        </div>
                    )
                })()}
                
                {/* Pagination */}
                <br />
                {!isLoading  && (
                    <CessationRequestPagination
                        currentPage={page}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={handlePageChange}
                        
                    />
                )}

                {/* Modals */}
                
                {selectOption?.id &&
                    <>
                        <AssignmentModal
                            open={selectOption?.option === "accept"}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) {
                                    setSelectOption(initialStateOption)
                                }
                            }}
                            idRequest={selectOption.id}  
                            refetch={handleRefetch}
                        />
                        <RejectCessationModal
                            isOpen={selectOption?.option === "denny"}
                            onClose={() => setSelectOption(initialStateOption)}
                            idRequest={selectOption.id}
                            refetch={handleRefetch}
                        />
                    
                        <CessationRequestDetail
                            isOpen={selectOption?.option === "detail"}
                            onClose={() => setSelectOption(initialStateOption)}
                            idRequest={selectOption.id}
                        />
                    </>
                }


            </div>
        </div>
    )
}

export default Page