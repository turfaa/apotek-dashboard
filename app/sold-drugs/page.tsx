import {Card, Title} from "@tremor/react"
import {getSoldDrugs} from "@/lib/api"
import SoldDrugsTable, {Row} from "@/app/sold-drugs/table"

export default async function SoldDrugs({searchParams}: {
    searchParams?: { [key: string]: string | undefined };
}): Promise<React.ReactElement> {
    const date = searchParams?.date

    const soldDrugs = await getSoldDrugs(date)

    const tableRows: Row[] =
        soldDrugs.drugs
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
            <Title>Obat Terjual pada {soldDrugs.date.toLocaleDateString("id-ID")}</Title>

            <Card className="mt-4">
                <SoldDrugsTable rows={tableRows}/>
            </Card>
        </main>
    )
}