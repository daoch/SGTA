import { create } from "zustand";
import { ICessationRequestAdvisor, IRequestTerminationConsultancyStudentDetail } from "../types/cessation-request";


interface ICessationRequestAssignmentState {
  students: IRequestTerminationConsultancyStudentDetail[]
  advisors: ICessationRequestAdvisor[]
  selectedStudent: IRequestTerminationConsultancyStudentDetail | null
  assignedStudents: Record<number, number> // studentId -> advisorId
  assignedAdvisors: ICessationRequestAdvisor[],

  // Actions
  setStudents: (students: IRequestTerminationConsultancyStudentDetail[]) => void
  setAdvisors: (advisors: ICessationRequestAdvisor[]) => void
  selectStudent: (student: IRequestTerminationConsultancyStudentDetail) => void
  assignAdvisor: (studentId: number, advisorId: number) => void
  unassignAdvisor: (studentId: number) => void
  addAssignedAdvisor: (advisor: ICessationRequestAdvisor) => void
  removeAssignedAdvisor: (advisorId: number) => void

  // Selectors
  isStudentAssigned: (studentId: number) => boolean
  getAssignedAdvisor: (studentId: number) => ICessationRequestAdvisor | null
  getAdvisorAssignedCount: (advisorId: number) => number
  getUnassignedStudentsCount: () => number
  getAssignedAdvisors: () => ICessationRequestAdvisor[]
  getStudentsByAdvisor: (advisorId: number) => IRequestTerminationConsultancyStudentDetail[]
  clear: () => void
}


export const useCessationRequestAssignmentStore = create<ICessationRequestAssignmentState>((set, get) => ({
  students: [],
  advisors: [],
  selectedStudent: null,
  assignedStudents: {},
  assignedAdvisors: [],

  setStudents: (students) => set({ students }),

  setAdvisors: (advisors) => set({ advisors }),

  selectStudent: (student) => set({ selectedStudent: student }),

  addAssignedAdvisor: (advisor) => {
    const { assignedAdvisors } = get();
  
    const exists = assignedAdvisors.some(a => a.id === advisor.id);
    if (!exists) {
      set({ assignedAdvisors: [...assignedAdvisors, {...advisor, assignedStudentsQuantity: advisor.assignedStudentsQuantity + 1}] });
    }
    else {
      const updatedAdvisors = assignedAdvisors.map(a =>
        a.id === advisor.id ? { ...a, assignedStudentsQuantity: a.assignedStudentsQuantity + 1 } : a
      );
      set({ assignedAdvisors: updatedAdvisors });
    }
  },

  removeAssignedAdvisor: (advisorId) => {
    const { assignedAdvisors } = get();
    const { students } = get();
    const quantityOfAdvisorReferencesStudents = students.filter(student => student.advisorId === advisorId).length;
    
    if (quantityOfAdvisorReferencesStudents === 0){
      const updatedAdvisors = assignedAdvisors.filter(a => a.id !== advisorId);
      set({ assignedAdvisors: updatedAdvisors });
    }
    else{
      const updatedAdvisors = assignedAdvisors.map(a =>
        a.id === advisorId ? { ...a, assignedStudentsQuantity: a.assignedStudentsQuantity - 1 } : a
      );
      set({ assignedAdvisors: updatedAdvisors });
    }
    
  },

  assignAdvisor: (studentId, advisorId) => {
    const { selectedStudent } = get();
    const { students } = get();
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? { ...student, advisorId: advisorId }
        : student
    );
    const updatedSelectedStudent = updatedStudents.find((student)=>student.id === selectedStudent?.id);
    // Update selected student status
    set({ selectedStudent: updatedSelectedStudent });
    // Update students status
    set({ students: updatedStudents });
  },

  unassignAdvisor: (studentId) => {
    const { selectedStudent } = get();
    const { students } = get();
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? { ...student, advisorId: null }
        : student
    );
    const updatedSelectedStudent = updatedStudents.find((student)=>student.id === selectedStudent?.id);
    // Update selected student status
    set({ selectedStudent: updatedSelectedStudent });
    // Update students status
    set({ students: updatedStudents });
  },

  isStudentAssigned: (studentId) => {
    const { assignedStudents } = get();
    return !!assignedStudents[studentId];
  },

  getAssignedAdvisor: (studentId) => {
    const { assignedStudents, advisors } = get();
    const advisorId = assignedStudents[studentId];
    if (!advisorId) return null;

    return advisors.find((advisor) => advisor.id === advisorId) || null;
  },

  getAdvisorAssignedCount: (advisorId) => {
    const { assignedStudents } = get();
    return Object.values(assignedStudents).filter((id) => id === advisorId).length;
  },

  getUnassignedStudentsCount: () => {
    const { students, assignedStudents } = get();
    return students.length - Object.keys(assignedStudents).length;
  },


  getAssignedAdvisors: () => {
    const {assignedAdvisors} = get();
    return assignedAdvisors;
  },

  getStudentsByAdvisor: (advisorId) => {
    const { students, assignedStudents } = get();
    const studentIds = Object.entries(assignedStudents)
    .filter(([_, aId]) => aId === advisorId)
    .map(([sId]) => Number(sId));
  
    return students.filter((student) => studentIds.includes(student.id));
  },


  clear: () => set({
    students: [],
    advisors: [],
    selectedStudent: null,
    assignedStudents: {},
    assignedAdvisors: []
  }),
}));