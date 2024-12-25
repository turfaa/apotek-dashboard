import { Title } from "@/components/typography/v2"
import { Metadata } from "next"
import { Suspense } from "react"
import ShiftsTable, { ShiftsTableFallback } from "./table"
import { SearchParams } from "@/types/search-params"
import { DateRangePicker } from "@/components/date-range-picker/date-range-picker"

export const metadata: Metadata = {
    title: "Laporan Shift",
}

export interface ShiftsProps {
    searchParams: SearchParams
}

export default async function Shifts(props: ShiftsProps): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title className="mb-2">Laporan Shift</Title>
                <DateRangePicker />
            </div>

            <div className="rounded-md border">
                <Suspense fallback={<ShiftsTableFallback />}>
                    <ShiftsTable searchParams={props.searchParams} />
                </Suspense>
            </div>
        </main>
    )
}
