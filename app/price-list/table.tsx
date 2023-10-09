import {Table, TableHead, TableHeaderCell, TableRow} from "@tremor/react"
import PriceListTableBody from "@/app/price-list/table-body"
import {Suspense} from "react"
import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"

export default function PriceListTable(): React.ReactElement {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Obat</TableHeaderCell>
                </TableRow>
            </TableHead>

            <Suspense fallback={<PriceListTableBodyFallback/>}>
                <PriceListTableBody/>
            </Suspense>
        </Table>
    )
}