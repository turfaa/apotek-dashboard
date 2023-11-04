import { getStockOpnameSummaries } from "@/lib/api/stock-opname"
import { rupiah } from "@/lib/rupiah"
import { Flex, Table, TableBody, TableCell, TableFoot, TableHead, TableHeaderCell, TableRow, Text } from "@tremor/react"

export interface StockOpnameSummaryTableProps {
    from?: string
    until?: string
}

export default async function StockOpnameSummaryTable({ from, until }: StockOpnameSummaryTableProps): Promise<React.ReactElement> {
    const { summaries } = await getStockOpnameSummaries(from, until)
    const totalHppDifference = summaries.reduce((total, summary) => total + summary.hppDifference, 0)
    const totalSalePriceDifference = summaries.reduce((total, summary) => total + summary.salePriceDifference, 0)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    <TableHeaderCell>Perubahan Stok</TableHeaderCell>
                    <TableHeaderCell>Selisih Stok</TableHeaderCell>
                    <TableHeaderCell>Selisih HPP</TableHeaderCell>
                    <TableHeaderCell>Selisih Harga Jual</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {summaries.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.drugName}</TableCell>
                        <TableCell>
                            <Flex flexDirection="col" alignItems="start">
                                {row.changes.map(change => (
                                    <Text key={change.batchCode}>{change.initialQuantity} {row.unit} {"->"} {change.realQuantity} {row.unit} [{change.batchCode}] </Text>
                                ))}
                            </Flex>
                        </TableCell>
                        <TableCell>{row.quantityDifference} {row.unit}</TableCell>
                        <TableCell>{rupiah.format(row.hppDifference)}</TableCell>
                        <TableCell>{rupiah.format(row.salePriceDifference)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFoot>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell>{rupiah.format(totalHppDifference)}</TableCell>
                    <TableCell>{rupiah.format(totalSalePriceDifference)}</TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    )
}