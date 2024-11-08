import { SalesStatistics } from "@/lib/api/sale-statistics"
import { rupiah } from "@/lib/rupiah"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export interface StatisticsTableProps {
    statistics: SalesStatistics[]
}

export default function StatisticsTable({
    statistics,
}: StatisticsTableProps): React.ReactElement {
    const totalSales = statistics.reduce((a, b) => a + b.totalSales, 0)
    const numberOfSales = statistics.reduce((a, b) => a + b.numberOfSales, 0)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Banyak Penjualan</TableHead>
                    <TableHead>Total Penjualan</TableHead>
                    <TableHead>Rata-Rata Penjualan</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {statistics.map((statistic, index) => (
                    <TableRow key={index}>
                        <TableHead>{index + 1}</TableHead>
                        <TableCell>
                            {statistic.pulledAt.toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>{statistic.numberOfSales}</TableCell>
                        <TableCell>
                            {rupiah.format(statistic.totalSales)}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(
                                statistic.numberOfSales == 0
                                    ? statistic.totalSales
                                    : statistic.totalSales / statistic.numberOfSales,
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
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
                    <TableCell>
                        {rupiah.format(numberOfSales == 0 ? totalSales : totalSales / numberOfSales)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
