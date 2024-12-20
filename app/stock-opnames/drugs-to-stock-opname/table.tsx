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

export interface DrugsTableProps {
    searchParams: SearchParams
    mode?: DrugsToStockOpnameMode
}

export default async function DrugsTable({
    searchParams,
    mode,
}: DrugsTableProps): Promise<React.ReactElement> {
    const { date } = await searchParams
    const { drugs } = await getDrugsToStockOpname(date, mode)

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
