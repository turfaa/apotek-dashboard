import SoldDrugsTable from "@/app/sold-drugs/table"
import DateRangePicker from "@/components/date-range-picker"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/typography"
import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "@/components/loading"
import { SearchParams } from "@/types/search-params"

export const metadata: Metadata = {
    title: "Obat Terjual",
}

export default function SoldDrugs(props: { searchParams: SearchParams }): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-row justify-start gap-2">
                <Title>Obat Terjual pada</Title>
                <DateRangePicker className="max-w-min" />
            </div>

            <Card className="mt-4 p-6">
                <Suspense fallback={<Loading />}>
                    <SoldDrugsTable searchParams={props.searchParams} />
                </Suspense>
            </Card>
        </main>
    )
}
