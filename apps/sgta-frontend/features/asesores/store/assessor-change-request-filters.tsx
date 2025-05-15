"use client"

import { create } from "zustand";
import { IAssessorChangeRequestSearchFieldsStore, IAssessorChangeRequestStatusFilter } from "../types/assessor-change-request";


export const useAssessorChangeRequestSearchCriteriaStore = create<IAssessorChangeRequestSearchFieldsStore>((set) => ({
    "fullNameEmail": "",
    "status": "pending" as IAssessorChangeRequestStatusFilter,
    "page": 1,
    setFullNameEmail: (value: string) => set((state) => ({ fullNameEmail: value })),
    setPage: (value: number) => set((state) => ({ page: value })),
    setStatus: (value: IAssessorChangeRequestStatusFilter) => set((state) => ({ status: value })),
    setStatusTabFilter: (value: IAssessorChangeRequestStatusFilter) => set((state) => ({ page: 1, status: value })),
    setFullNameEmailPage: (value: string) => set((state) => ({ page: 1, fullNameEmail: value })),
    clear: () => set((state => ({ page: 1, fullNameEmail: "", "status": "pending" as IAssessorChangeRequestStatusFilter}))),
    clearFullNameEmailPage: () => set((state => ({ page: 1, fullNameEmail: ""}))),
}));