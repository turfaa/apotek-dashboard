import DrugsTable from "./table"
import { DrugsToStockOpnameMode } from "@/lib/api/drugs-to-stock-opname"
import DatePicker from "@/components/date-picker"
import { TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Flex } from "@tremor/react"
import { Title, Text } from "@/components/typography"
import { Metadata } from "next"
import { Suspense } from "react"
import TabGroup from "@/components/tab-group"
import { ReaderIcon, BackpackIcon } from "@radix-ui/react-icons"

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
                tabLabels={[
                    { tag: "sales-based", label: "Berdasarkan Penjualan", icon: <BackpackIcon className="h-4 w-4" /> },
                    { tag: "conservative", label: "Berdasarkan Semua Obat", icon: <ReaderIcon className="h-4 w-4" /> },
                ]}
            >
                <TabsContent value="sales-based">
                    <Card className="mt-4 p-6">
                        <Suspense fallback={<Text>Loading...</Text>}>
                            <DrugsTable
                                mode={DrugsToStockOpnameMode.SalesBased}
                                date={searchParams?.date}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>

                <TabsContent value="conservative">
                    <Card className="mt-4 p-6">
                        <Suspense fallback={<Text>Loading...</Text>}>
                            <DrugsTable
                                mode={DrugsToStockOpnameMode.Conservative}
                                date={searchParams?.date}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>
            </TabGroup>
        </main>
    )
}
