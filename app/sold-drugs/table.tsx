import { getSoldDrugs } from "@/lib/api/sold-drug"
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

export interface SoldDrugsTableProps {
    from?: string
    until?: string
}

export default async function SoldDrugsTable({
    from,
    until,
}: SoldDrugsTableProps): Promise<React.ReactElement> {
    const { drugs } = await getSoldDrugs(from, until)
    const totalPrice = drugs.reduce(
        (total, drug) => total + drug.totalAmount,
        0,
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Pabrik</TableHead>
                    <TableHead>Terjual</TableHead>
                    <TableHead>Total Harga</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {drugs.map((drug, index) => (
                    <TableRow key={index}>
                        <TableHead>{index + 1}</TableHead>
                        <TableCell>{drug.drug.name}</TableCell>
                        <TableCell>{drug.drug.manufacturer}</TableCell>
                        <TableCell>
                            {drug.occurrences.toLocaleString("id-ID")} Kali
                        </TableCell>
                        <TableCell>{rupiah.format(drug.totalAmount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell>{rupiah.format(totalPrice)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
