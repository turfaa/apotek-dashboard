import DrugsToStockOpnameTabList from "./tab-list"
import DrugsTable from "./table"
import { DrugsToStockOpnameMode } from "@/lib/api/drugs-to-stock-opname"
import DatePicker from "@/components/date-picker"
import TabGroup from "@/components/tab-group"
import { Card, Flex, TabPanel, TabPanels, Text, Title } from "@tremor/react"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Obat Harus Stok Opname",
}

export default function DrugsToStockOpname({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined }
}): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Obat yang harus stok opname pada</Title>
                <DatePicker />
            </Flex>

            <TabGroup
                className="mt-4"
                tabLabels={["sales-based", "conservative"]}
            >
                <DrugsToStockOpnameTabList />

                <TabPanels className="mt-4">
                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <DrugsTable
                                    mode={DrugsToStockOpnameMode.SalesBased}
                                    date={searchParams?.date}
                                />
                            </Suspense>
                        </Card>
                    </TabPanel>

                    <TabPanel>
                        <Card>
                            <Suspense fallback={<Text>Loading...</Text>}>
                                <DrugsTable
                                    mode={DrugsToStockOpnameMode.Conservative}
                                    date={searchParams?.date}
                                />
                            </Suspense>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    )
}
