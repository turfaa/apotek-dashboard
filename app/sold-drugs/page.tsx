import SoldDrugsTable from "@/app/sold-drugs/table"
import DateRangePicker from "@/components/date-range-picker"
import { Title } from "@/components/typography/v2"
import { Metadata } from "next"
import { Suspense } from "react"
import SoldDrugsTableFallback from "./table-fallback"
import { SearchParams } from "@/types/search-params"
import SearchButton from "@/components/search-button"
import { getSoldDrugs } from "@/lib/api/sold-drug"

export const metadata: Metadata = {
    title: "Obat Terjual",
}

export default function SoldDrugs(props: { searchParams: SearchParams }): React.ReactElement {
    const drugsPromise = props.searchParams
        .then(params => getSoldDrugs(params.from, params.until))
        .then(response => response.drugs)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div>
                <Title className="mb-2">Obat Terjual</Title>
                <DateRangePicker />
            </div>

            <SearchButton className="mt-4" />

            <div className="rounded-md border mt-4">
                <Suspense fallback={<SoldDrugsTableFallback />}>
                    <SoldDrugsTable drugsPromise={drugsPromise} />
                </Suspense>
            </div>
        </main>
    )
}
