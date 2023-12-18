import { SalesStatistics } from "@/lib/api/sale-statistics"
import { rupiah } from "@/lib/rupiah"
import {
    Table,
    TableBody,
    TableCell,
    TableFoot,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react"

export interface StatisticsTableProps {
    statistics: SalesStatistics[]
}

export default function StatisticsTable({
    statistics,
}: StatisticsTableProps): React.ReactElement {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Tanggal</TableHeaderCell>
                    <TableHeaderCell>Banyak Penjualan</TableHeaderCell>
                    <TableHeaderCell>Total Penjualan</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {statistics.map((statistic, index) => (
                    <TableRow key={index}>
                        <TableHeaderCell>{index + 1}</TableHeaderCell>
                        <TableCell>
                            {statistic.pulledAt.toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>{statistic.numberOfSales}</TableCell>
                        <TableCell>
                            {rupiah.format(statistic.totalSales)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFoot>
                <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell>
                        {statistics.reduce((a, b) => a + b.numberOfSales, 0)}
                    </TableCell>
                    <TableCell>
                        {rupiah.format(
                            statistics.reduce((a, b) => a + b.totalSales, 0),
                        )}
                    </TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    )
}
