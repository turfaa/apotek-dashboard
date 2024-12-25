import StockOpnameSummaryTable from "./summary-table"
import CompactedStockOpnameTable from "./compacted-so-table"
import StockOpnamesReportTable from "./report-table"
import StockOpnameSummaryTableFallback from "./summary-table-fallback"
import CompactedStockOpnameTableFallback from "./compacted-so-table-fallback"
import StockOpnamesReportTableFallback from "./report-table-fallback"
import DateRangePicker from "@/components/date-range-picker"
import TabGroup from "@/components/tab-group"
import { Title } from "@/components/typography/v2"
import { Metadata } from "next"
import { Suspense } from "react"
import { LayersIcon, LightningBoltIcon, ReaderIcon } from "@radix-ui/react-icons"
import { TabsContent } from "@/components/ui/tabs"
import { SearchParams } from "@/types/search-params"
import SearchButton from "@/components/search-button"
import { getStockOpnameSummaries } from "@/lib/api/stock-opname"

export const metadata: Metadata = {
    title: "Laporan Stok Opname",
}

export default function StockOpnames({ searchParams }: { searchParams: SearchParams }): React.ReactElement {
    const summariesPromise = searchParams
        .then(params => getStockOpnameSummaries(params.from, params.until))
        .then(response => response.summaries)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div>
                <Title className="mb-2">Laporan Stok Opname</Title>
                <DateRangePicker />
            </div>

            <SearchButton className="mt-4" />

            <TabGroup
                className="mt-4"
                tabLabels={[
                    { tag: "summary", label: "Ringkasan", icon: <LightningBoltIcon className="h-4 w-4" /> },
                    { tag: "compacted", label: "Compact", icon: <ReaderIcon className="h-4 w-4" /> },
                    { tag: "details", label: "Detail", icon: <LayersIcon className="h-4 w-4" /> },
                ]}
            >
                <TabsContent value="summary" className="mt-4">
                    <div className="rounded-md border">
                        <Suspense fallback={<StockOpnameSummaryTableFallback />}>
                            <StockOpnameSummaryTable summariesPromise={summariesPromise} />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="compacted" className="mt-4">
                    <div className="rounded-md border">
                        <Suspense fallback={<CompactedStockOpnameTableFallback />}>
                            <CompactedStockOpnameTable searchParams={searchParams} />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                    <div className="rounded-md border">
                        <Suspense fallback={<StockOpnamesReportTableFallback />}>
                            <StockOpnamesReportTable searchParams={searchParams} />
                        </Suspense>
                    </div>
                </TabsContent>
            </TabGroup>
        </main>
    )
}
