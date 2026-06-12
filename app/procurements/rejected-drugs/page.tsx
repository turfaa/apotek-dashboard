import { Metadata } from "next"
import { Suspense } from "react"
import { Title, Subtitle } from "@/components/typography/v2"
import { SearchParams } from "@/types/search-params"
import { DateRangePicker } from "@/components/date-range-picker/date-range-picker"
import { auth } from "@/lib/auth"
import { getRejectedDrugResolutions } from "@/lib/api/rejected-drug"
import RejectedDrugsTable, { RejectedDrugsTableFallback } from "./table"
import {
    ResolutionFilter,
    ResolutionFilterFallback,
} from "./resolution-filter"
import { CreateRejectedDrugDialog } from "./create-rejected-drug-dialog"
import { SearchFilter } from "./search-filter"

export const metadata: Metadata = {
    title: "Obat Tertolak",
    description: "Kelola obat yang dicari pelanggan tapi belum tersedia",
}

export interface RejectedDrugsPageProps {
    searchParams: SearchParams
}

export default async function RejectedDrugsPage(
    props: RejectedDrugsPageProps,
): Promise<React.ReactElement> {
    const resolutionOptionsPromise = auth().then((session) =>
        getRejectedDrugResolutions(session),
    )

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                    <Title>Obat Tertolak</Title>
                    <Subtitle>
                        Kelola obat yang dicari pelanggan tapi belum tersedia.
                    </Subtitle>
                </div>
                <CreateRejectedDrugDialog />
            </div>

            <div className="flex flex-col gap-2 mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                    <SearchFilter />
                    <Suspense fallback={<ResolutionFilterFallback />}>
                        <ResolutionFilter
                            optionsPromise={resolutionOptionsPromise}
                        />
                    </Suspense>
                </div>
            </div>

            <div className="rounded-md border">
                <Suspense fallback={<RejectedDrugsTableFallback />}>
                    <RejectedDrugsTable searchParams={props.searchParams} />
                </Suspense>
            </div>
        </main>
    )
}
