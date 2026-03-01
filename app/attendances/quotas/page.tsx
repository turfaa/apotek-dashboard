import { Metadata } from "next"
import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { getAttendanceQuotas, getQuotaAuditLogs } from "@/lib/api/attendance"
import { getEmployees } from "@/lib/api/employee"
import { Title, Subtitle } from "@/components/typography/v2"
import { QuotasPageClient } from "./quotas-page-client"

export const metadata: Metadata = {
    title: "Kuota Kehadiran",
    description: "Kelola kuota kehadiran karyawan",
}

export default function AttendanceQuotasPage(): React.ReactElement {
    const sessionPromise = auth()

    const quotasPromise = sessionPromise.then((session) =>
        getAttendanceQuotas(session),
    )
    const employeesPromise = sessionPromise.then((session) =>
        getEmployees(session),
    )
    const auditLogsPromise = sessionPromise.then((session) =>
        getQuotaAuditLogs(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Kuota Kehadiran</Title>
                <Subtitle>
                    Kelola kuota kehadiran karyawan berdasarkan jenis kehadiran.
                </Subtitle>
            </div>
            <Suspense
                fallback={
                    <div className="text-muted-foreground">Memuat data...</div>
                }
            >
                <QuotasPageClient
                    quotasPromise={quotasPromise}
                    employeesPromise={employeesPromise}
                    auditLogsPromise={auditLogsPromise}
                />
            </Suspense>
        </main>
    )
}
