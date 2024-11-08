import StockOpnameSummaryTable from "./summary-table"
import CompactedStockOpnameTable from "./compacted-so-table"
import StockOpnamesReportTable from "./report-table"
import StockOpnameTabList from "./tab-list"
import DateRangePicker from "@/components/date-range-picker"
import TabGroup from "@/components/tab-group"
import { Card, Flex, TabPanel, TabPanels } from "@tremor/react"
import { Title, Text } from "@/components/typography"
import { Metadata } from "next"
import { Suspense } from "react"

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
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Laporan Stok Opname pada</Title>
                <DateRangePicker className="max-w-min" />
            </Flex>

            <TabGroup
                className="mt-4"
                tabLabels={["summary", "compacted", "details"]}
            >
                <StockOpnameTabList />

                <TabPanels className="mt-4">
                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <StockOpnameSummaryTable
                                    from={searchParams?.from}
                                    until={searchParams?.until}
                                />
                            </Suspense>
                        </Card>
                    </TabPanel>

                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <CompactedStockOpnameTable
                                    from={searchParams?.from}
                                    until={searchParams?.until}
                                />
                            </Suspense>
                        </Card>
                    </TabPanel>

                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <StockOpnamesReportTable
                                    from={searchParams?.from}
                                    until={searchParams?.until}
                                />
                            </Suspense>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    )
}
