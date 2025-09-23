"use client"

import { use } from "react"
import { Employee } from "@/lib/api/employee"
import { SalarySnapshot } from "@/lib/api/salary"
import { Session } from "next-auth"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { SalaryCard } from "../../components/salary-card"
import { usePrintMode } from "@/lib/print-mode"

interface SnapshotDetailClientProps {
    snapshot: SalarySnapshot
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
}

export function SnapshotDetailClient({
    snapshot,
    employeesPromise,
    sessionPromise,
}: SnapshotDetailClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const router = useRouter()
    const session = use(sessionPromise)
    const { isPrintMode } = usePrintMode(session?.user?.role)

    const employee = employees.find(emp => emp.id === snapshot.employeeID)
    const monthDate = new Date(snapshot.month + "-01")
    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })

    const handleGoBack = () => {
        router.back()
    }

    return (
        <div className="space-y-6">
            {!isPrintMode && (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Snapshot Gaji - {employee?.name || "Karyawan tidak ditemukan"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Dibuat pada {format(snapshot.createdAt, "dd MMM yyyy 'pukul' HH:mm", { locale: id })}
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar
                    </Button>
                </div>
            )}

            <SalaryCard 
                salary={snapshot.salary}
                employeeName={employee?.name || "Karyawan tidak ditemukan"}
                monthDisplay={monthDisplay}
            />
        </div>
    )
}
