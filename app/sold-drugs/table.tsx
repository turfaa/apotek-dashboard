import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow} from "@tremor/react"

export interface SoldDrugsTableProps {
    rows: Row[]
}

export interface Row {
    vmedisCode: string
    name: string
    manufacturer: string
    occurrences: number
    totalAmount: number
}

const rupiah = new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR"})

export default function SoldDrugsTable({rows}: SoldDrugsTableProps): React.ReactElement {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Kode Obat</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    <TableHeaderCell>Pabrik</TableHeaderCell>
                    <TableHeaderCell>Terjual</TableHeaderCell>
                    <TableHeaderCell>Total Harga</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={index}>
                        <TableHeaderCell>{index + 1}</TableHeaderCell>
                        <TableCell>{row.vmedisCode}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.manufacturer}</TableCell>
                        <TableCell>{row.occurrences.toLocaleString("id-ID")} Kali</TableCell>
                        <TableCell>{rupiah.format(row.totalAmount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}