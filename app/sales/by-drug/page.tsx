import React, { Suspense } from "react"
import { Title } from "@/components/typography/v2"
import { Metadata } from "next"
import DrugSelector from "@/components/drug-selector"
import LastDrugSalesTable, { LastDrugSalesTableFallback } from "./table"
import { SearchParams } from "@/types/search-params"

export const metadata: Metadata = {
    title: "Penjualan Obat Terakhir",
}

export default async function LastDrugSales(props: {
    searchParams: SearchParams
}): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 mb-6">
                <Title>Laporan Penjualan Obat Terakhir</Title>
                <DrugSelector />
            </div>

            <div className="rounded-md border">
                <Suspense fallback={<LastDrugSalesTableFallback />}>
                    <LastDrugSalesTable searchParams={props.searchParams} />
                </Suspense>
            </div>
        </main>
    )
}
