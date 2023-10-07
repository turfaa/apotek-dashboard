import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow} from "@tremor/react"

import {StockOpname} from "@/lib/api/stock-opname"

export interface StockOpnamesTableProps {
    rows: Row[]
}

export interface Row extends StockOpname {
}

const rupiah = new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR"})

export default function StockOpnamesTable({rows}: StockOpnamesTableProps): React.ReactElement {
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
                {rows.map((row, index) => (
                    <TableRow key={index}>
                        <TableHeaderCell>{index + 1}</TableHeaderCell>
                        <TableCell>{row.vmedisId}</TableCell>
                        <TableCell>{row.drugName}</TableCell>
                        <TableCell>{row.batchCode}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell>{row.initialQuantity.toLocaleString("id-ID")}</TableCell>
                        <TableCell>{row.realQuantity.toLocaleString("id-ID")}</TableCell>
                        <TableCell>{row.quantityDifference.toLocaleString("id-ID")}</TableCell>
                        <TableCell>{rupiah.format(row.hppDifference)}</TableCell>
                        <TableCell>{rupiah.format(row.salePriceDifference)}</TableCell>
                        <TableCell>{row.notes}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}