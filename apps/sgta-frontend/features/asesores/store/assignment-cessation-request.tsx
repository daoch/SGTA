// features/asesores/store/assignment-cessation-request.ts

import { create } from "zustand";
import {
  ICessationRequestAdvisor,
  IRequestTerminationConsultancyStudentDetail,
} from "../types/cessation-request";

interface ICessationRequestAssignmentState {
  students: IRequestTerminationConsultancyStudentDetail[];
  advisors: ICessationRequestAdvisor[];
  selectedStudent: IRequestTerminationConsultancyStudentDetail | null;
  // Mapeo studentId -> advisorId
  assignedStudents: Record<number, number>;
  // Lista de objetivos que tienen al menos un estudiante asignado
  assignedAdvisors: ICessationRequestAdvisor[];

  // Actions
  setStudents: (students: IRequestTerminationConsultancyStudentDetail[]) => void;
  setAdvisors: (advisors: ICessationRequestAdvisor[]) => void;
  selectStudent: (student: IRequestTerminationConsultancyStudentDetail) => void;
  assignAdvisor: (studentId: number, advisorId: number) => void;
  unassignAdvisor: (studentId: number) => void;
  addAssignedAdvisor: (advisor: ICessationRequestAdvisor) => void;
  removeAssignedAdvisor: (advisorId: number) => void;

  // Selectors
  isStudentAssigned: (studentId: number) => boolean;
  getAssignedAdvisor: (studentId: number) => ICessationRequestAdvisor | null;
  getAdvisorAssignedCount: (advisorId: number) => number;
  getUnassignedStudentsCount: () => number;
  getAssignedAdvisors: () => ICessationRequestAdvisor[];
  getStudentsByAdvisor: (
    advisorId: number
  ) => IRequestTerminationConsultancyStudentDetail[];
  clear: () => void;
}

export const useCessationRequestAssignmentStore = create<
  ICessationRequestAssignmentState
>((set, get) => ({
  students: [],
  advisors: [],
  selectedStudent: null,
  assignedStudents: {},
  assignedAdvisors: [],

  setStudents: (students) => set({ students }),

  setAdvisors: (advisors) => set({ advisors }),

  selectStudent: (student) => set({ selectedStudent: student }),

  /**
   * Agrega al asesor a assignedAdvisors solo si aún no está en esa lista.
   * No manipula ninguna propiedad extra: el número de estudiantes
   * lo obtenemos con getAdvisorAssignedCount().
   */
  addAssignedAdvisor: (advisor) => {
    const { assignedAdvisors } = get();
    const exists = assignedAdvisors.some((a) => a.id === advisor.id);

    if (!exists) {
      set({ assignedAdvisors: [...assignedAdvisors, advisor] });
    }
  },

  /**
   * Al desasignar, primero revisamos cuántos estudiantes le quedan
   * a ese asesor según assignedStudents. Si queda en cero, lo sacamos
   * de assignedAdvisors; si no, lo dejamos.
   */
  removeAssignedAdvisor: (advisorId) => {
    const { assignedStudents, assignedAdvisors } = get();
    // Contar cuántos studentId apuntan a este advisorId
    const count = Object.values(assignedStudents).filter(
      (aId) => aId === advisorId
    ).length;

    if (count === 0) {
      // Si no le queda ningún estudiante, lo quitamos de la lista
      const updatedAdvisors = assignedAdvisors.filter(
        (a) => a.id !== advisorId
      );
      set({ assignedAdvisors: updatedAdvisors });
    }
    // Si count > 0, lo dejamos en assignedAdvisors
  },

  /**
   * Cuando asignamos un advisor a un student:
   * 1) Actualizamos el mapeo assignedStudents[studentId] = advisorId
   * 2) Si es la primera vez que ese advisor recibe un estudiante, llamamos addAssignedAdvisor()
   * 3) Actualizamos selectedStudent (por si estaba seleccionado ese student)
   * 4) Actualizamos el array students con el nuevo advisorId
   */
  assignAdvisor: (studentId, advisorId) => {
    const { students, advisors, assignedStudents, selectedStudent } = get();

    // 1) Actualizar el mapeo
    const newAssignedStudents = { ...assignedStudents, [studentId]: advisorId };

    // 2) Si es primera vez para este advisor, lo agregamos a assignedAdvisors
    const existsAdvisor =
      get().assignedAdvisors.some((a) => a.id === advisorId);
    if (!existsAdvisor) {
      // Encontramos el objeto completo del advisor en advisors[]
      const advisorObj = advisors.find((a) => a.id === advisorId);
      if (advisorObj) {
        // Lo agregamos a assignedAdvisors
        set((state) => ({
          assignedAdvisors: [...state.assignedAdvisors, advisorObj],
        }));
      }
    }

    // 3) Actualizar selectedStudent, si corresponde
    const updatedStudentsList = students.map((stud) =>
      stud.id === studentId ? { ...stud, advisorId } : stud
    );
    const updatedSelectedStudent = updatedStudentsList.find(
      (stud) => stud.id === selectedStudent?.id
    );

    // 4) Guardar todos los cambios
    set({
      assignedStudents: newAssignedStudents,
      students: updatedStudentsList,
      selectedStudent: updatedSelectedStudent || null,
    });
  },

  /**
   * Desasigna un advisor de un student:
   * 1) Eliminamos la entrada de assignedStudents
   * 2) Si a ese advisor ya no le quedan estudiantes, lo quitamos de assignedAdvisors
   * 3) Actualizamos selectedStudent y students
   */
  unassignAdvisor: (studentId) => {
    const { students, assignedStudents, selectedStudent } = get();

    // 1) Crear un nuevo mapeo sin ese studentId
    const newAssignedStudents = { ...assignedStudents };
    const advisorIdToCheck = newAssignedStudents[studentId];
    delete newAssignedStudents[studentId];

    // 2) Si ya no quedan más students asignados a ese advisor, quitarlo
    if (advisorIdToCheck !== undefined) {
      const remainingCount = Object.values(newAssignedStudents).filter(
        (aId) => aId === advisorIdToCheck
      ).length;

      if (remainingCount === 0) {
        // lo quitamos de assignedAdvisors
        set((state) => ({
          assignedAdvisors: state.assignedAdvisors.filter(
            (a) => a.id !== advisorIdToCheck
          ),
        }));
      }
    }

    // 3) Actualizar lista de students (poner advisorId en null)
    const updatedStudentsList = students.map((stud) =>
      stud.id === studentId ? { ...stud, advisorId: null } : stud
    );
    const updatedSelectedStudent = updatedStudentsList.find(
      (stud) => stud.id === selectedStudent?.id
    );

    // Guardar todo
    set({
      assignedStudents: newAssignedStudents,
      students: updatedStudentsList,
      selectedStudent: updatedSelectedStudent || null,
    });
  },

  // Indica si un student ya tiene un advisor en el mapeo
  isStudentAssigned: (studentId) => {
    const { assignedStudents } = get();
    return assignedStudents[studentId] !== undefined;
  },

  // Dado un studentId, devuelve el objeto advisor o null
  getAssignedAdvisor: (studentId) => {
    const { assignedStudents, advisors } = get();
    const advisorId = assignedStudents[studentId];
    if (!advisorId) return null;
    return advisors.find((a) => a.id === advisorId) || null;
  },

  // Cuenta cuántos students están asignados a ese advisorId
  getAdvisorAssignedCount: (advisorId) => {
    const { assignedStudents } = get();
    return Object.values(assignedStudents).filter(
      (aId) => aId === advisorId
    ).length;
  },

  // Número de students que NO tienen advisor asignado
  getUnassignedStudentsCount: () => {
    const { students, assignedStudents } = get();
    return (
      students.length -
      Object.keys(assignedStudents).filter((sId) =>
        Number(sId) in assignedStudents
      ).length
    );
  },

  // Simplemente regresa la lista de advisors que tienen al menos un student
  getAssignedAdvisors: () => {
    return get().assignedAdvisors;
  },

  // Dado un advisorId, regresa todos los students que en assignedStudents apuntan a él
  getStudentsByAdvisor: (advisorId) => {
    const { students, assignedStudents } = get();
    const studentIds = Object.entries(assignedStudents)
      .filter(([_, aId]) => aId === advisorId)
      .map(([sId]) => Number(sId));

    return students.filter((stud) => studentIds.includes(stud.id));
  },

  clear: () =>
    set({
      students: [],
      advisors: [],
      selectedStudent: null,
      assignedStudents: {},
      assignedAdvisors: [],
    }),
}));
