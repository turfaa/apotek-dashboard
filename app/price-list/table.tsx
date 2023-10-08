import {Table, TableHead, TableHeaderCell, TableRow} from "@tremor/react"
import PriceListTableBody, {Row} from "@/app/price-list/table-body"
import {Suspense} from "react"

export interface PriceListTableProps {
    rows: Row[]
}

export default function PriceListTable({rows}: PriceListTableProps): React.ReactElement {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Obat</TableHeaderCell>
                </TableRow>
            </TableHead>

            <Suspense>
                <PriceListTableBody rows={rows}/>
            </Suspense>
        </Table>
    )
}