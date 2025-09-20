import DrugsTable from "./table"
import DrugsToStockOpnameTableFallback from "./table-fallback"
import { DrugsToStockOpnameMode } from "@/lib/api/drugs-to-stock-opname"
import DatePicker from "@/components/date-picker"
import { TabsContent } from "@/components/ui/tabs"
import { Title } from "@/components/typography/v2"
import { Metadata } from "next"
import { Suspense } from "react"
import TabGroup from "@/components/tab-group"
import { ReaderIcon, BackpackIcon } from "@radix-ui/react-icons"
import { SearchParams } from "@/types/search-params"

export const metadata: Metadata = {
    title: "Obat Harus Stok Opname",
}

export default function DrugsToStockOpname({
    searchParams,
}: {
    searchParams: SearchParams
}): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 mb-4">
                <Title>Obat Harus Stok Opname</Title>
                <DatePicker />
            </div>

            <TabGroup
                tabLabels={[
                    {
                        tag: "sales-based",
                        label: "Berdasarkan Penjualan",
                        icon: <BackpackIcon className="h-4 w-4" />,
                    },
                    {
                        tag: "conservative",
                        label: "Berdasarkan Semua Obat",
                        icon: <ReaderIcon className="h-4 w-4" />,
                    },
                ]}
            >
                <TabsContent value="sales-based">
                    <div className="rounded-md border mt-4">
                        <Suspense
                            fallback={<DrugsToStockOpnameTableFallback />}
                        >
                            <DrugsTable
                                mode={DrugsToStockOpnameMode.SalesBased}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="conservative">
                    <div className="rounded-md border mt-4">
                        <Suspense
                            fallback={<DrugsToStockOpnameTableFallback />}
                        >
                            <DrugsTable
                                mode={DrugsToStockOpnameMode.Conservative}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    </div>
                </TabsContent>
            </TabGroup>
        </main>
    )
}
