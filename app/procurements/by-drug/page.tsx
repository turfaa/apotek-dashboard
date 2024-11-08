import React, { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/typography"
import { Metadata } from "next"
import DrugSelector, { DrugSelectorFallback } from "@/components/drug-selector"
import LastDrugProcurementsTable, {
    LastDrugProcurementsTableFallback,
} from "./table"

export const metadata: Metadata = {
    title: "Pembelian Obat Terakhir",
}

export default async function LastDrugProcurements(
    props: {
        searchParams: Promise<{ [key: string]: string | undefined }>
    }
): Promise<React.ReactElement> {
    const searchParams = await props.searchParams
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Laporan Pembelian Obat Terakhir</Title>

            <Suspense fallback={<DrugSelectorFallback />}>
                <DrugSelector />
            </Suspense>

            <Card className="mt-4 p-6">
                <Suspense fallback={<LastDrugProcurementsTableFallback />}>
                    <LastDrugProcurementsTable drugCode={searchParams?.["drug-code"]} />
                </Suspense>
            </Card>
        </main>
    )
}
