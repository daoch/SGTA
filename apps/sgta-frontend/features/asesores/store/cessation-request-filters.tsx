"use client";

import { create } from "zustand";
import { IRequestTerminationConsultancyRequestStatus, ICessationRequestSearchFieldsStore } from "@/features/asesores/types/cessation-request";


export const useCessationRequestSearchCriteriaStore = create<ICessationRequestSearchFieldsStore>((set) => ({
    "fullNameEmail": "",
    "status": "pending" as IRequestTerminationConsultancyRequestStatus,
    "page": 1,
    setFullNameEmail: (value: string) => set((state) => ({ fullNameEmail: value })),
    setPage: (value: number) => set((state) => ({ page: value })),
    setStatus: (value: IRequestTerminationConsultancyRequestStatus) => set((state) => ({ status: value })),
    setStatusTabFilter: (value: IRequestTerminationConsultancyRequestStatus) => set((state) => ({ page: 1, status: value })),
    setFullNameEmailPage: (value: string) => set((state) => ({ page: 1, fullNameEmail: value })),
    clear: () => set((state => ({ page: 1, fullNameEmail: "", "status": "pending" as IRequestTerminationConsultancyRequestStatus}))),
    clearFullNameEmailPage: () => set((state => ({ page: 1, fullNameEmail: ""}))),
}));

