import React, { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/typography"
import { Metadata } from "next"
import DrugSelector from "@/components/drug-selector"
import LastDrugProcurementsTable, {
    LastDrugProcurementsTableFallback,
} from "./table"
import { SearchParams } from "@/types/search-params"

export const metadata: Metadata = {
    title: "Pembelian Obat Terakhir",
}

export default async function LastDrugProcurements(props: { searchParams: SearchParams }): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl" >
            <Title className="mb-4">Laporan Pembelian Obat Terakhir</Title>

            <DrugSelector />

            <Card className="mt-4 p-6">
                <Suspense fallback={<LastDrugProcurementsTableFallback />}>
                    <LastDrugProcurementsTable searchParams={props.searchParams} />
                </Suspense>
            </Card>
        </main>
    )
}
