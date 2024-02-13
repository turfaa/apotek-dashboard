import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"
import PriceListTableBodyNoFetch from "@/app/price-list/table-body-no-fetch"
import { getDrugs } from "@/lib/api/drug"
import { auth } from "@/lib/auth"
import { Table } from "@tremor/react"
import { Suspense } from "react"

export default async function PriceListTableServerFetch(): Promise<React.ReactElement> {
    const drugsPromise = getDrugs()
    const sessionPromise = auth()

    const [{ drugs }, session] = await Promise.all([
        drugsPromise,
        sessionPromise,
    ])

    return (
        <Table>
            <Suspense fallback={<PriceListTableBodyFallback />}>
                <PriceListTableBodyNoFetch session={session} drugs={drugs} />
            </Suspense>
        </Table>
    )
}
