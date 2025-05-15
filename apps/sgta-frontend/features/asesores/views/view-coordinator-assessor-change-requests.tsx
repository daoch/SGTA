import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAssessorChangeRequestSearchCriteriaStore } from "@/features/asesores/store/assessor-change-request-filters";
import RequestSearchFilters from "@/features/asesores/components/assessor-change-request/search-filters-request-list";
import PendingAssessorChangeRequestsList from "@/features/asesores/components/assessor-change-request/list-pending-requests";
import AssessorChangeRequestHistoryTable from "@/features/asesores/components/assessor-change-request/list-approved-rejected-requests";
import AssessorChangeRequestPagination from "@/features/asesores/components/assessor-change-request/pagination-assessor-change-request";
import AssessorChangeRequestDetail from "@/features/asesores/components/assessor-change-request/modal-detail";
import AssessorChangeRejectModal from "@/features/asesores/components/assessor-change-request/modal-reject";
import { AssessorChangeAssignmentModal } from "@/features/asesores/components/assessor-change-request/modal-assignment-students";
import { Loader2 } from "lucide-react";
import NotFoundChangeAssessorRequests from "@/features/asesores/components/assessor-change-request/not-assessor-change-request-found";
import { getAssessorChangeRequestList } from "../services/solicitud-cambio-asesor";
import { IRequestAssessorChange } from "../types/assessor-change-request";

interface IRequestOptions {
    id: number | null;
    option: "detail" | "denny" | "accept" | null
    openModal: boolean;
}


const Page: React.FC = () => {
    const {fullNameEmail, page, status, setPage, clear, setStatusTabFilter, setFullNameEmailPage, clearFullNameEmailPage} = useAssessorChangeRequestSearchCriteriaStore();
    const initialStateOption = {id: null, option: null, openModal: false};
    const [ selectOption, setSelectOption ] = useState<IRequestOptions>(initialStateOption);
    const [ data, setData ] = useState<IRequestAssessorChange | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    
    const fetchRequests = async () => {
        setIsLoading(true);
        const data = await getAssessorChangeRequestList({"fullNameEmail": fullNameEmail, "status": status, "page": page});
        if (data)
            setData(data);
        setIsLoading(false);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };
    
    useEffect(()=>{
        clear();
    }, []);


    useEffect(()=>{
        fetchRequests();
    }, [fullNameEmail, page, status]);
    
    const handleRefetch = async () =>{
        fetchRequests();
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
                        searchTerm={fullNameEmail}
                        onSearchChange={setFullNameEmailPage}
                        statusValue={status}
                        onStatusValueChange={setStatusTabFilter}
                        clearTerm={clearFullNameEmailPage}
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
                            );
                        if (data?.assessorChangeRequests.length === 0)
                            return (
                                <NotFoundChangeAssessorRequests type={status} appliedFilters={fullNameEmail !== ""}/>
                            );
                        return (
                            <div>
                                {status === "pending" ? (
                                <PendingAssessorChangeRequestsList
                                    requests={data?.assessorChangeRequests ?? []}
                                    onApprove={
                                        (value)=>{
                                            setSelectOption({id: value, option: "accept", openModal: true});
                                        }}
                                    onReject={
                                        (value)=>{
                                            setSelectOption({id: value, option: "denny", openModal: true});
                                        }}
                                />
                                ) : (
                                    <AssessorChangeRequestHistoryTable
                                        requests={data?.assessorChangeRequests ?? []}
                                        onViewDetails={(value)=>{setSelectOption({id: value, option: "detail", openModal: true});}}
                                    />
                                    
                                )}
                            </div>
                        );
                    })() }
                </div>
                
                {/* Pagination */}
                <br />
                {!isLoading  && (
                    <AssessorChangeRequestPagination
                        currentPage={page}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* Modals */}
                
                {selectOption?.id &&
                <>
                    <AssessorChangeAssignmentModal
                        open={selectOption?.option === "accept"}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setSelectOption(initialStateOption);
                            }
                        }}
                        idRequest={selectOption.id}  
                        refetch={handleRefetch}
                    />
                    <AssessorChangeRejectModal
                        isOpen={selectOption?.option === "denny"}
                        onClose={() => setSelectOption(initialStateOption)}
                        idRequest={selectOption.id}
                        refetch={handleRefetch}
                    />   
                    <AssessorChangeRequestDetail
                        isOpen={selectOption?.option === "detail"}
                        onClose={() => setSelectOption(initialStateOption)}
                        idRequest={selectOption.id}
                    />
                </>
                }
                
            </div>
        </div>
    );
};

export default Page;