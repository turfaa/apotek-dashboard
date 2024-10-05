import { Card, Title } from "@tremor/react"
import { Metadata } from "next"
import { DrugSelector } from "@/shared-components/drug-selector"
import LastDrugProcurementsTable from "./table"

export const metadata: Metadata = {
    title: "Pembelian Obat Terakhir",
}

export default async function LastDrugProcurements({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Laporan Pembelian Obat Terakhir</Title>

            <DrugSelector />

            <Card className="mt-4">
                <LastDrugProcurementsTable
                    drugCode={searchParams?.["drug-code"]}
                />
            </Card>
        </main>
    )
}
