import SoldDrugsTable, { Row } from "@/app/sold-drugs/table"
import { getSoldDrugs } from "@/lib/api/sold-drug"
import { DatePicker } from "@/shared-components/date-picker"
import { Card, Flex, Title } from "@tremor/react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Obat Terjual",
}

export default async function SoldDrugs({ searchParams }: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const { drugs } = await getSoldDrugs(searchParams?.date)

    const tableRows: Row[] =
        drugs
            .filter(drug => drug.drug.vmedisCode !== undefined)
            .map(drug => ({
                vmedisCode: drug.drug.vmedisCode,
                name: drug.drug.name,
                manufacturer: drug.drug.manufacturer,
                occurrences: drug.occurrences,
                totalAmount: drug.totalAmount,
            }))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Obat Terjual pada</Title>
                <DatePicker value={searchParams?.date ? new Date(searchParams.date) : undefined} className="max-w-min" />
            </Flex>

            <Card className="mt-4">
                <SoldDrugsTable rows={tableRows} />
            </Card>
        </main>
    )
}