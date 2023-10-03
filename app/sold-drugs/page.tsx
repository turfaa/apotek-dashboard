import {Card, Flex, Title} from "@tremor/react"
import {getSoldDrugs} from "@/lib/api"
import SoldDrugsTable, {Row} from "@/app/sold-drugs/table"
import {DatePicker} from "@/lib/date-picker"

export default async function SoldDrugs({searchParams}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const isPrintMode = (searchParams?.print ?? "") == "true"

    const {date, drugs} = await getSoldDrugs(searchParams?.date)

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
                <Title>Obat Terjual pada {isPrintMode && date.toLocaleDateString("id-ID")}</Title>
                {!isPrintMode && <DatePicker defaultValue={date} className="max-w-min"/>}
            </Flex>

            <Card className="mt-4">
                <SoldDrugsTable rows={tableRows}/>
            </Card>
        </main>
    )
}