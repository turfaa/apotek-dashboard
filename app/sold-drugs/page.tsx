import SoldDrugsTable from "@/app/sold-drugs/table"
import { DateRangePicker } from "@/shared-components/date-range-picker"
import { Card, Flex, Text, Title } from "@tremor/react"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Obat Terjual",
}

export default function SoldDrugs({ searchParams }: { searchParams?: { [key: string]: string | undefined } }): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Flex flexDirection="row" justifyContent="start" className="gap-2">
                <Title>Obat Terjual pada</Title>
                <DateRangePicker className="max-w-min" />
            </Flex>

            <Card className="mt-4">
                <Suspense fallback={<Text>Loading...</Text>}>
                    <SoldDrugsTable from={searchParams?.from} until={searchParams?.until} />
                </Suspense>
            </Card>
        </main>
    )
}