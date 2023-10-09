import {Table, TableHead, TableHeaderCell, TableRow} from "@tremor/react"
import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"

export default function PriceListTableFallback(): React.ReactElement {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Obat</TableHeaderCell>
                </TableRow>
            </TableHead>

            <PriceListTableBodyFallback/>
        </Table>
    )
}