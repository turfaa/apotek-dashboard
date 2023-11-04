import { getSoldDrugs } from "@/lib/api/sold-drug"
import { rupiah } from "@/lib/rupiah"
import { Table, TableBody, TableCell, TableFoot, TableHead, TableHeaderCell, TableRow } from "@tremor/react"

export interface SoldDrugsTableProps {
    from?: string
    until?: string
}

export default async function SoldDrugsTable({ from, until }: SoldDrugsTableProps): Promise<React.ReactElement> {
    const { drugs } = await getSoldDrugs(from, until)
    const totalPrice = drugs.reduce((total, drug) => total + drug.totalAmount, 0)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    <TableHeaderCell>Pabrik</TableHeaderCell>
                    <TableHeaderCell>Terjual</TableHeaderCell>
                    <TableHeaderCell>Total Harga</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {drugs.map((drug, index) => (
                    <TableRow key={index}>
                        <TableHeaderCell>{index + 1}</TableHeaderCell>
                        <TableCell>{drug.drug.name}</TableCell>
                        <TableCell>{drug.drug.manufacturer}</TableCell>
                        <TableCell>{drug.occurrences.toLocaleString("id-ID")} Kali</TableCell>
                        <TableCell>{rupiah.format(drug.totalAmount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFoot>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell>{rupiah.format(totalPrice)}</TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    )
}