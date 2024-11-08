import StockOpnameSummaryTable from "./summary-table"
import CompactedStockOpnameTable from "./compacted-so-table"
import StockOpnamesReportTable from "./report-table"
import DateRangePicker from "@/components/date-range-picker"
import TabGroup from "@/components/tab-group"
import { Card } from "@/components/ui/card"
import { Title, Text } from "@/components/typography"
import { Metadata } from "next"
import { Suspense } from "react"
import { LayersIcon, LightningBoltIcon, ReaderIcon } from "@radix-ui/react-icons"
import { TabsContent } from "@/components/ui/tabs"

export const metadata: Metadata = {
    title: "Laporan Stok Opname",
}

export default async function StockOpnames({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-row justify-start gap-2">
                <Title>Laporan Stok Opname pada</Title>
                <DateRangePicker className="max-w-min" />
            </div>

            <TabGroup
                className="mt-4"
                tabLabels={[
                    { tag: "summary", label: "Ringkasan", icon: <LightningBoltIcon className="h-4 w-4" /> },
                    { tag: "compacted", label: "Compact", icon: <ReaderIcon className="h-4 w-4" /> },
                    { tag: "details", label: "Detail", icon: <LayersIcon className="h-4 w-4" /> },
                ]}
            >
                <TabsContent value="summary" className="mt-4">
                    <Card className="p-6">
                        <Suspense fallback={<Text>Loading...</Text>}>
                            <StockOpnameSummaryTable
                                from={searchParams?.from}
                                until={searchParams?.until}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>

                <TabsContent value="compacted" className="mt-4">
                    <Card className="p-6">
                        <Suspense fallback={<Text>Loading...</Text>}>
                            <CompactedStockOpnameTable
                                from={searchParams?.from}
                                until={searchParams?.until}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                    <Card className="p-6">
                        <Suspense fallback={<Text>Loading...</Text>}>
                            <StockOpnamesReportTable
                                from={searchParams?.from}
                                until={searchParams?.until}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>
            </TabGroup>
        </main>
    )
}
