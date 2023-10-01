import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow} from "@tremor/react"

export interface DrugsTableProps {
    rows: Row[]
}

export interface Row {
    vmedisCode: string
    name: string
    manufacturer: string
}

export default function DrugsTable({rows}: DrugsTableProps): React.ReactElement {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell>No</TableHeaderCell>
                    <TableHeaderCell>Nama Obat</TableHeaderCell>
                    <TableHeaderCell>Pabrik</TableHeaderCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={index}>
                        <TableHeaderCell>{index + 1}</TableHeaderCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.manufacturer}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}