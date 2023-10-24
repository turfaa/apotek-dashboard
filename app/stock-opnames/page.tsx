import { DatePicker } from "@/shared-components/date-picker"
import TabGroup from "@/shared-components/tab-group"
import { Card, Flex, TabPanel, TabPanels, Text, Title } from "@tremor/react"
import { Metadata } from "next"
import { Suspense } from "react"
import StockOpnamesReportTable from "./report-table"
import StockOpnameSummaryTable from "./summary-table"
import StockOpnameTabList from "./tab-list"

export const metadata: Metadata = {
    title: "Laporan Stok Opname",
}

export default async function StockOpnames({ searchParams }: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Laporan Stok Opname pada</Title>
                <DatePicker className="max-w-min" />
            </Flex>

            <TabGroup className="mt-4" tabLabels={["summary", "details"]}>
                <StockOpnameTabList />

                <TabPanels className="mt-4">
                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <StockOpnameSummaryTable date={searchParams?.date} />
                            </Suspense>
                        </Card>
                    </TabPanel>

                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <StockOpnamesReportTable date={searchParams?.date} />
                            </Suspense>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main >
    )
}