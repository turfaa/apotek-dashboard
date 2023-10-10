import PriceListTableBodyNoFetch from "@/app/price-list/table-body-no-fetch"
import {Suspense} from "react"
import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"
import {getDrugs} from "@/lib/api/drug"
import {authOptions} from "@/lib/auth"
import {getServerSession} from "next-auth/next"
import {Table} from "@tremor/react"

export default async function PriceListTableServerFetch(): Promise<React.ReactElement> {
    const drugsPromise = getDrugs()
    const sessionPromise = getServerSession(authOptions)

    const [{drugs}, session] = await Promise.all([drugsPromise, sessionPromise])

    return (
        <Table>
            <Suspense fallback={<PriceListTableBodyFallback/>}>
                <PriceListTableBodyNoFetch session={session} drugs={drugs}/>
            </Suspense>
        </Table>
    )
}