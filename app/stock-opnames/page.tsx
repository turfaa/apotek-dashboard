import StockOpnamesTable from "@/app/stock-opnames/table"
import { getStockOpnames } from "@/lib/api/stock-opname"
import { DatePicker } from "@/shared-components/date-picker"
import { Card, Flex, Title } from "@tremor/react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Laporan Stok Opname",
}

export default async function StockOpnames({ searchParams }: {
    searchParams?: { [key: string]: string | undefined }
}): Promise<React.ReactElement> {
    const { stockOpnames } = await getStockOpnames(searchParams?.date)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Laporan Stok Opname pada</Title>
                <DatePicker value={searchParams?.date ? new Date(searchParams.date) : undefined} className="max-w-min" />
            </Flex>

            <Card className="mt-4">
                <StockOpnamesTable rows={stockOpnames} />
            </Card>
        </main>
    )
}