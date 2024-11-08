import React, { Suspense } from "react"
import { Card } from "@tremor/react"
import { Title } from "@/components/typography"
import { Metadata } from "next"
import DrugSelector, { DrugSelectorFallback } from "@/components/drug-selector"
import LastDrugProcurementsTable, {
    LastDrugProcurementsTableFallback,
} from "./table"

export const metadata: Metadata = {
    title: "Pembelian Obat Terakhir",
}

export default function LastDrugProcurements({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Laporan Pembelian Obat Terakhir</Title>

            <Suspense fallback={<DrugSelectorFallback />}>
                <DrugSelector />
            </Suspense>

            <Card className="mt-4">
                <Suspense fallback={<LastDrugProcurementsTableFallback />}>
                    <LastDrugProcurementsTable drugCode={searchParams?.["drug-code"]} />
                </Suspense>
            </Card>
        </main>
    )
}
