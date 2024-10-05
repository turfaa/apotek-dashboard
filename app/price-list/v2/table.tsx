import { PriceListTableBodyFallback } from "@/app/price-list/v2/table-fallback"
import { getDrugs } from "@/lib/api/drugv2"
import { Table } from "@tremor/react"
import { Suspense } from "react"
import PriceListTableBody from "./table-body"
import { auth } from "@/lib/auth"

export default async function PriceListTableServerFetch(): Promise<React.ReactElement> {
    const session = await auth()
    const { drugs } = await getDrugs(session)

    return (
        <Table>
            <Suspense fallback={<PriceListTableBodyFallback />}>
                <PriceListTableBody session={session} drugs={drugs} />
            </Suspense>
        </Table>
    )
}

