import ClientSide from "@/app/statistics/client"
import DateRangePicker from "@/components/date-range-picker"
import { Flex, Title } from "@tremor/react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ringkasan Penjualan",
}

export default function Statistics(): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Ringkasan Penjualan pada</Title>
                <DateRangePicker className="max-w-min" />
            </Flex>

            <ClientSide />
        </main>
    )
}
