import {Table, TableHead, TableHeaderCell, TableRow} from "@tremor/react"
import PriceListTableBodyNoFetch from "@/app/price-list/table-body-no-fetch"
import {Suspense} from "react"
import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"
import {getDrugs} from "@/lib/api/drug"

export default async function PriceListTableServerFetch(): Promise<React.ReactElement> {
    const {drugs} = await getDrugs()

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Obat</TableHeaderCell>
                </TableRow>
            </TableHead>

            <Suspense fallback={<PriceListTableBodyFallback/>}>
                <PriceListTableBodyNoFetch drugs={drugs}/>
            </Suspense>
        </Table>
    )
}