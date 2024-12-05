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

export const metadata: Metadata = {
    title: "Laporan Pekerjaan",
    description: "Kelola laporan pekerjaan karyawan",
}

export interface WorkLogsProps {
    searchParams: SearchParams
}

export default function WorkLogs(props: WorkLogsProps): React.ReactElement {
    const session = auth()
    
    // If no dates provided, use current month
    const searchParams = props.searchParams.then(searchParams => {
        if (!searchParams.from && !searchParams.until) {
            const now = new Date()
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

            searchParams.from = firstDay.toISOString().split('T')[0]
            searchParams.until = lastDay.toISOString().split('T')[0]
        }
        
        return searchParams
    })
    
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-row justify-start gap-4 items-center">
                    <h2 className="text-3xl font-bold tracking-tight">Laporan Pekerjaan</h2>
                    <DateRangePicker className="max-w-min" defaultDateRangeType="Bulan ini" />
                </div>
                <AddWorkLogDialog sessionPromise={session}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Laporan
                    </Button>
                </AddWorkLogDialog>
            </div>

            <Suspense fallback={<WorkLogsSummarySkeleton />}>
                <WorkLogsSummary searchParams={searchParams} sessionPromise={session} />
            </Suspense>

            <Suspense fallback={<WorkLogsTableSkeleton />}>
                <WorkLogsTable searchParams={searchParams} sessionPromise={session} />
            </Suspense>
        </main>
    )
} 