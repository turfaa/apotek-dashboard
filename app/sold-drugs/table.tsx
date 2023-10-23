import { getSoldDrugs } from "@/lib/api/sold-drug"
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react"

export interface SoldDrugsTableProps {
    date?: string
}

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })

export default async function SoldDrugsTable({ date }: SoldDrugsTableProps): Promise<React.ReactElement> {
    const { drugs } = await getSoldDrugs(date)

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
        </Table>
    )
}