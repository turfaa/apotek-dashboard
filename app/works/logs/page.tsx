import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import { Suspense } from "react"
import { SearchParams } from "@/types/search-params"
import { DateRangePicker } from "@/components/date-range-picker/date-range-picker"
import { WorkLogsTable, WorkLogsTableSkeleton } from "./table"
import { WorkLogsSummary, WorkLogsSummarySkeleton } from "./summary"
import { AddWorkLogDialog } from "./add-dialog"
import { auth } from "@/lib/auth"
import { getWorkLogs, getWorkTypes } from "@/lib/api/work"
import { getEmployees } from "@/lib/api/employee"
import { Title } from "@/components/typography/v2"

export const metadata: Metadata = {
    title: "Laporan Pekerjaan",
    description: "Kelola laporan pekerjaan karyawan",
}

export interface WorkLogsProps {
    searchParams: SearchParams
}

export default function WorkLogs(props: WorkLogsProps): React.ReactElement {
    const sessionPromise = auth()

    // If no dates provided, use current month
    const searchParams = props.searchParams.then((searchParams) => {
        if (!searchParams.from && !searchParams.until) {
            const now = new Date()
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

            // Convert to YYYY-MM-DD
            searchParams.from = firstDay.toLocaleDateString("en-CA")
            searchParams.until = lastDay.toLocaleDateString("en-CA")
        }

        return searchParams
    })

    const workLogsPromise = Promise.all([sessionPromise, searchParams])
        .then(([session, searchParams]) =>
            getWorkLogs(searchParams.from, searchParams.until, session),
        )
        .then((logs) =>
            logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        )

    const employeesPromise = sessionPromise.then((session) =>
        getEmployees(session),
    )
    const workTypesPromise = sessionPromise.then((session) =>
        getWorkTypes(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-2">
                    <Title>Laporan Pekerjaan</Title>
                    <DateRangePicker defaultDateRangeType="Bulan ini" />
                </div>

                <Suspense
                    fallback={
                        <Button disabled>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Laporan
                        </Button>
                    }
                >
                    <AddWorkLogDialog
                        sessionPromise={sessionPromise}
                        employeesPromise={employeesPromise}
                        workTypesPromise={workTypesPromise}
                    >
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Laporan
                        </Button>
                    </AddWorkLogDialog>
                </Suspense>
            </div>

            <Suspense fallback={<WorkLogsSummarySkeleton />}>
                <WorkLogsSummary workLogsPromise={workLogsPromise} />
            </Suspense>

            <Suspense fallback={<WorkLogsTableSkeleton />}>
                <WorkLogsTable
                    workLogsPromise={workLogsPromise}
                    employeesPromise={employeesPromise}
                />
            </Suspense>
        </main>
    )
}
