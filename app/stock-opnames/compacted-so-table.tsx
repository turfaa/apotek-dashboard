import { getCompactedStockOpnames } from "@/lib/api/stock-opname"
import { rupiah } from "@/lib/rupiah"
import {
    Flex,
    Table,
    TableBody,
    TableCell,
    TableFoot,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
} from "@tremor/react"

export interface CompactedStockOpnameTableProps {
    from?: string
    until?: string
}

export default async function CompactedStockOpnameTable({
    from,
    until,
}: CompactedStockOpnameTableProps): Promise<React.ReactElement> {
    const { stockOpnames } = await getCompactedStockOpnames(from, until)
    const totalHppDifference = stockOpnames.reduce(
        (total, stockOpname) => total + stockOpname.hppDifference,
        0,
    )
    const totalSalePriceDifference = stockOpnames.reduce(
        (total, stockOpname) => total + stockOpname.salePriceDifference,
        0,
    )

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Tanggal</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    <TableHeaderCell>Perubahan Stok</TableHeaderCell>
                    <TableHeaderCell>Selisih Stok</TableHeaderCell>
                    <TableHeaderCell>Selisih HPP</TableHeaderCell>
                    <TableHeaderCell>Selisih Harga Jual</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {stockOpnames.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            {row.date.toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>{row.drugName}</TableCell>
                        <TableCell>
                            <Flex flexDirection="col" alignItems="start">
                                {row.changes.map((change) => (
                                    <Text key={change.batchCode}>
                                        {change.initialQuantity} {row.unit}{" "}
                                        {"->"} {change.realQuantity} {row.unit}{" "}
                                        [{change.batchCode}]{" "}
                                    </Text>
                                ))}
                            </Flex>
                        </TableCell>
                        <TableCell>
                            {row.quantityDifference} {row.unit}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(row.hppDifference)}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(row.salePriceDifference)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFoot>
                <TableRow>
                    <TableCell colSpan={5}>Total</TableCell>
                    <TableCell>{rupiah.format(totalHppDifference)}</TableCell>
                    <TableCell>
                        {rupiah.format(totalSalePriceDifference)}
                    </TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    )
}
