import {Card, Flex, Title} from "@tremor/react"
import DrugsTable, {Row} from "@/app/drugs-to-stock-opname/table"
import {DatePicker} from "@/shared-components/date-picker"
import {getDrugsToStockOpname} from "@/lib/api/drugs-to-stock-opname"
import {Metadata} from "next"

export const metadata: Metadata = {
    title: "Obat Harus Stok Opname",
}

export default async function DrugsToStockOpname({searchParams}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const isPrintMode = (searchParams?.print ?? "") == "true"

    const {drugs, date} = await getDrugsToStockOpname(searchParams?.date)

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