import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react"

import { getStockOpnames } from "@/lib/api/stock-opname"
import { rupiah } from "@/lib/rupiah"

export interface StockOpnamesTableProps {
    from?: string
    until?: string
}

export default async function StockOpnamesReportTable({
    from,
    until,
}: StockOpnamesTableProps): Promise<React.ReactElement> {
    const { stockOpnames } = await getStockOpnames(from, until)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Nomor SO</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    <TableHeaderCell>Batch</TableHeaderCell>
                    <TableHeaderCell>Satuan</TableHeaderCell>
                    <TableHeaderCell>Stok Sistem</TableHeaderCell>
                    <TableHeaderCell>Stok Fisik</TableHeaderCell>
                    <TableHeaderCell>Selisih Stok</TableHeaderCell>
                    <TableHeaderCell>Selisih HPP</TableHeaderCell>
                    <TableHeaderCell>Selisih Harga Jual</TableHeaderCell>
                    <TableHeaderCell>Keterangan</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {stockOpnames.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.vmedisId}</TableCell>
                        <TableCell>{row.drugName}</TableCell>
                        <TableCell>{row.batchCode}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>
                            {row.initialQuantity.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                            {row.realQuantity.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                            {row.quantityDifference.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(row.hppDifference)}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(row.salePriceDifference)}
                        </TableCell>
                        <TableCell>{row.notes}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
