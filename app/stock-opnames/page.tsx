import moment from "moment"
import {getStockOpnames} from "@/lib/api"
import {Card, Flex, Title} from "@tremor/react"
import StockOpnamesTable from "@/app/stock-opnames/table"
import {DatePicker} from "@/lib/date-picker";

export const revalidate = 60

export default async function StockOpnames({searchParams}: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const dateStr = searchParams?.date ?? moment().format("YYYY-MM-DD")
    const date = new Date(dateStr)

    const isPrintMode = (searchParams?.print ?? "") == "true"

    const {stockOpnames} = await getStockOpnames(dateStr)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Laporan Stok Opname pada {isPrintMode && date.toLocaleDateString("id-ID")}</Title>
                {!isPrintMode && <DatePicker className="max-w-min"/>}
            </Flex>

            <Card className="mt-4">
                <StockOpnamesTable rows={stockOpnames}/>
            </Card>
        </main>
    )
}