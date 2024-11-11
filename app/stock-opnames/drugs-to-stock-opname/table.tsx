import {
    DrugsToStockOpnameMode,
    getDrugsToStockOpname,
} from "@/lib/api/drugs-to-stock-opname"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SearchParams } from "@/types/search-params"
import { use } from "react"

export interface DrugsTableProps {
    searchParams: SearchParams
    mode?: DrugsToStockOpnameMode
}

export default function DrugsTable({
    searchParams,
    mode,
}: DrugsTableProps): React.ReactElement {
    const { date } = use(searchParams)
    const { drugs } = use(getDrugsToStockOpname(date, mode))

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    {/* <TableHead>Pabrik</TableHead> */}
                    <TableHead>Stok Sistem</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {drugs.map((drug, index) => (
                    <TableRow key={index}>
                        <TableHead>{index + 1}</TableHead>
                        <TableCell>{drug.name}</TableCell>
                        {/* <TableCell>{drug.manufacturer}</TableCell> */}
                        <TableCell>
                            {drug.stocks.length == 0
                                ? "-"
                                : drug.stocks.join(" ")}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
