import { Title } from "@/components/typography/v2"
import { Metadata } from "next"
import { Suspense } from "react"
import ShiftsTable, { ShiftsTableFallback } from "./table"
import FetchLatestButton from "./fetch-latest-button"
import FetchingAlert from "./fetching-alert"
import { SearchParams } from "@/types/search-params"
import { DateRangePicker } from "@/components/date-range-picker/date-range-picker"

export const metadata: Metadata = {
    title: "Laporan Shift",
}

export interface ShiftsProps {
    searchParams: SearchParams
}

export default async function Shifts(
    props: ShiftsProps,
): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 mb-6">
                <Title>Laporan Shift</Title>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <DateRangePicker />
                    <FetchLatestButton />
                </div>
            </div>

            <FetchingAlert />

            <div className="rounded-md border mt-4">
                <Suspense fallback={<ShiftsTableFallback />}>
                    <ShiftsTable searchParams={props.searchParams} />
                </Suspense>
            </div>
        </main>
    )
}
