"use client";

import { StudentDetails } from "@/components/main/reports/student-details";
import { useParams } from "next/navigation";

export default function StudentPage() {
  const params = useParams();
  const studentId = params.id as string;

  return (
    <div className="py-6 px-2">
      <StudentDetails studentId={studentId} />
    </div>
  );
}
