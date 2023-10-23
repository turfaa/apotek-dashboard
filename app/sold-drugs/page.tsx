import SoldDrugsTable from "@/app/sold-drugs/table"
import { DatePicker } from "@/shared-components/date-picker"
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
                <DatePicker className="max-w-min" />
            </Flex>

            <Card className="mt-4">
                <Suspense fallback={<Text>Loading...</Text>}>
                    <SoldDrugsTable date={searchParams?.date} />
                </Suspense>
            </Card>
        </main>
    )
}