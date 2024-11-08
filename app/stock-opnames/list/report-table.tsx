import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nomor SO</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Stok Sistem</TableHead>
                    <TableHead>Stok Fisik</TableHead>
                    <TableHead>Selisih Stok</TableHead>
                    <TableHead>Selisih HPP</TableHead>
                    <TableHead>Selisih Harga Jual</TableHead>
                    <TableHead>Keterangan</TableHead>
                </TableRow>
            </TableHeader>

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
