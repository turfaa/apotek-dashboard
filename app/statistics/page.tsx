import ClientSide from "@/app/statistics/client"
import DateRangePicker from "@/components/date-range-picker"
import { Title } from "@/components/typography/v2"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ringkasan Penjualan",
}

export default function Statistics(): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-col gap-2">
                <Title>Ringkasan Penjualan</Title>
                <DateRangePicker />
            </div>

            <ClientSide />
        </main>
    )
}
