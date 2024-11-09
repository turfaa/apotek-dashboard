import { Card } from "@/components/ui/card"
import { Title, Text } from "@/components/typography"
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
            <div className="flex flex-row justify-start gap-2">
                <Title>Laporan Shift</Title>
                <DateRangePicker className="max-w-min" />
            </div>

            <Card className="mt-4 p-4">
                <Suspense fallback={<ShiftsTableFallback />}>
                    <ShiftsTable searchParams={props.searchParams} />
                </Suspense>
            </Card>
        </main>
    )
}
