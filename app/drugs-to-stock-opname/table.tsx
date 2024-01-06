import {
    DrugsToStockOpnameMode,
    getDrugsToStockOpname,
} from "@/lib/api/drugs-to-stock-opname"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react"

export interface DrugsTableProps {
    date?: string
    mode?: DrugsToStockOpnameMode
}

export default async function DrugsTable({
    date,
    mode,
}: DrugsTableProps): Promise<React.ReactElement> {
    const { drugs } = await getDrugsToStockOpname(date, mode)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    {/* <TableHeaderCell>Pabrik</TableHeaderCell> */}
                </TableRow>
            </TableHead>

            <TableBody>
                {drugs.map((drug, index) => (
                    <TableRow key={index}>
                        <TableHeaderCell>{index + 1}</TableHeaderCell>
                        <TableCell>{drug.name}</TableCell>
                        {/* <TableCell>{drug.manufacturer}</TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
