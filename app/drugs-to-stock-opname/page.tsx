import {Card, Flex, Title} from "@tremor/react"
import {getDrugsToStockOpname} from "@/lib/api"
import DrugsTable, {Row} from "@/app/drugs-to-stock-opname/table"
import moment from "moment/moment"
import {DatePicker} from "@/lib/date-picker"

export const revalidate = 600

export default async function DrugsToStockOpname({searchParams}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const dateStr = searchParams?.date ?? moment().format("YYYY-MM-DD")
    const date = new Date(dateStr)

    const isPrintMode = (searchParams?.print ?? "") == "true"

    const {drugs} = await getDrugsToStockOpname(dateStr)

    const tableRows: Row[] = drugs.map(drug => ({
        vmedisCode: drug.vmedisCode,
        name: drug.name,
        manufacturer: drug.manufacturer,
    }))

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Obat yang Harus Di-Stok Opname pada {isPrintMode && date.toLocaleDateString("id-ID")}</Title>
                {!isPrintMode && <DatePicker defaultValue={date} className="max-w-min"/>}
            </Flex>

            <Card className="mt-4">
                <DrugsTable rows={tableRows}/>
            </Card>
        </main>
    )
}