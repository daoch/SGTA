"use client";

import { useParams } from "next/navigation";
import { StudentDetails } from "@/features/reportes/views/student-details";

export default function StudentPage() {
  const params = useParams();
  const studentId = params.id as string;

  return (
    <div className="py-6 px-2">
      <StudentDetails studentId={studentId} />
    </div>
  );
}
