"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentReports } from "@/components/main/reports/student-reports"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("estudiantes")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#002855]">Módulo de Reportes</h1>
        <p className="text-gray-600 mt-1">Visualiza estadísticas y reportes sobre el progreso de las tesis</p>
      </div>
      <StudentReports />
    
    </div>
  )
}
