import {Card, Title} from "@tremor/react"
import {getDrugsToStockOpname} from "@/lib/api"
import DrugsTable, {Row} from "@/app/drugs-to-stock-opname/table"
import moment from "moment/moment"

export default async function DrugsToStockOpname({searchParams}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const date = searchParams?.date ?? moment().format("YYYY-MM-DD")

    const {drugs} = await getDrugsToStockOpname(date)

    const tableRows: Row[] = drugs.map(drug => ({
        vmedisCode: drug.vmedisCode,
        name: drug.name,
        manufacturer: drug.manufacturer,
    }))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title>Obat yang Harus Di-Stok Opname pada {new Date(date).toLocaleDateString("id-ID")}</Title>

            <Card className="mt-4">
                <DrugsTable rows={tableRows}/>
            </Card>
        </main>
    )
}