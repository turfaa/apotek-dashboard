import {Card, Flex, Title} from "@tremor/react"
import StockOpnamesTable from "@/app/stock-opnames/table"
import {DatePicker} from "@/lib/date-picker"
import {getStockOpnames} from "@/lib/api/stock-opname"
import {Metadata} from "next"

export const metadata: Metadata = {
    title: "Laporan Stok Opname",
}

export default async function StockOpnames({searchParams}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const isPrintMode = (searchParams?.print ?? "") == "true"

    const {stockOpnames, date} = await getStockOpnames(searchParams?.date)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Laporan Stok Opname pada {isPrintMode && date.toLocaleDateString("id-ID")}</Title>
                {!isPrintMode && <DatePicker defaultValue={date} className="max-w-min"/>}
            </Flex>

            <Card className="mt-4">
                <StockOpnamesTable rows={stockOpnames}/>
            </Card>
        </main>
    )
}