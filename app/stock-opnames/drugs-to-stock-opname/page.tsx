import DrugsTable from "./table"
import { DrugsToStockOpnameMode } from "@/lib/api/drugs-to-stock-opname"
import DatePicker from "@/components/date-picker"
import { TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/typography"
import { Metadata } from "next"
import { Suspense } from "react"
import TabGroup from "@/components/tab-group"
import { ReaderIcon, BackpackIcon } from "@radix-ui/react-icons"
import Loading from "@/components/loading"
import { SearchParams } from "@/types/search-params"

export const metadata: Metadata = {
    title: "Obat Harus Stok Opname",
}

export default function DrugsToStockOpname({ searchParams }: { searchParams: SearchParams }): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-row justify-start gap-2">
                <Title>Obat yang harus stok opname pada</Title>
                <DatePicker />
            </div>

            <TabGroup
                className="mt-4"
                tabLabels={[
                    { tag: "sales-based", label: "Berdasarkan Penjualan", icon: <BackpackIcon className="h-4 w-4" /> },
                    { tag: "conservative", label: "Berdasarkan Semua Obat", icon: <ReaderIcon className="h-4 w-4" /> },
                ]}
            >
                <TabsContent value="sales-based">
                    <Card className="mt-4 p-6">
                        <Suspense fallback={<Loading />}>
                            <DrugsTable
                                mode={DrugsToStockOpnameMode.SalesBased}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>

                <TabsContent value="conservative">
                    <Card className="mt-4 p-6">
                        <Suspense fallback={<Loading />}>
                            <DrugsTable
                                mode={DrugsToStockOpnameMode.Conservative}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    </Card>
                </TabsContent>
            </TabGroup>
        </main>
    )
}
