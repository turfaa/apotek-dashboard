import DrugsTable, { Row } from "@/app/drugs-to-stock-opname/table"
import { getDrugsToStockOpname } from "@/lib/api/drugs-to-stock-opname"
import { DatePicker } from "@/shared-components/date-picker"
import { Card, Flex, Title } from "@tremor/react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Obat Harus Stok Opname",
}

export default async function DrugsToStockOpname({ searchParams }: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const { drugs } = await getDrugsToStockOpname(searchParams?.date)

    const tableRows: Row[] = drugs.map(drug => ({
        vmedisCode: drug.vmedisCode,
        name: drug.name,
        manufacturer: drug.manufacturer,
    }))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Obat yang Harus Di-Stok Opname pada</Title>
                <DatePicker value={searchParams?.date ? new Date(searchParams.date) : undefined} className="max-w-min" />
            </Flex>

            <Card className="mt-4">
                <DrugsTable rows={tableRows} />
            </Card>
        </main>
    )
}