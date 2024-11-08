import SoldDrugsTable from "@/app/sold-drugs/table"
import DateRangePicker from "@/components/date-range-picker"
import { Card } from "@/components/ui/card"
import { Title, Text } from "@/components/typography"
import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../loading"

export const metadata: Metadata = {
    title: "Obat Terjual",
}

export default async function SoldDrugs(
    props: {
        searchParams?: Promise<{ [key: string]: string | undefined }>
    }
): Promise<React.ReactElement> {
    const searchParams = await props.searchParams
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-row justify-start gap-2">
                <Title>Obat Terjual pada</Title>
                <DateRangePicker className="max-w-min" />
            </div>

            <Card className="mt-4 p-6">
                <Suspense fallback={<Loading />}>
                    <SoldDrugsTable
                        from={searchParams?.from}
                        until={searchParams?.until}
                    />
                </Suspense>
            </Card>
        </main>
    )
}
