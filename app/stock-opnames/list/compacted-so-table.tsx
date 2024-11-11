import { getCompactedStockOpnames } from "@/lib/api/stock-opname"
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
import { SearchParams } from "@/types/search-params"
import { use } from "react"

export default function CompactedStockOpnameTable({ searchParams }: { searchParams: SearchParams }): React.ReactElement {
    const { from, until } = use(searchParams)
    const { stockOpnames } = use(getCompactedStockOpnames(from, until))
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
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Perubahan Stok</TableHead>
                    <TableHead>Selisih Stok</TableHead>
                    <TableHead>Selisih HPP</TableHead>
                    <TableHead>Selisih Harga Jual</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {stockOpnames.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            {row.date.toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>{row.drugName}</TableCell>
                        <TableCell className="flex flex-col items-start">
                            {row.changes.map((change, changeIndex) => (
                                <span key={changeIndex}>
                                    {change.initialQuantity} {row.unit}{" "}
                                    {"->"} {change.realQuantity} {row.unit}{" "}
                                    [{change.batchCode}]{" "}
                                </span>
                            ))}
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

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={5}>Total</TableCell>
                    <TableCell>{rupiah.format(totalHppDifference)}</TableCell>
                    <TableCell>
                        {rupiah.format(totalSalePriceDifference)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
