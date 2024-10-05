import React from "react"
import {
    Table as TableTremor,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react"
import { Table as TableType } from "../types"

export interface TableProps {
    table: TableType
}

export default function Table({ table }: TableProps): React.ReactElement {
    if (table.header.length == 0 && table.rows.length == 0) {
        return <></>
    }

    return (
        <TableTremor>
            {table.header.length > 0 && (
                <TableHead>
                    <TableRow>
                        {table.header.map((header) => (
                            <TableHeaderCell key={header}>{header}</TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
            )}

            {table.rows.length > 0 && (
                <TableBody>
                    {table.rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.columns.map((column) => (
                                <TableCell key={column}>{column}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            )}
        </TableTremor>
    )
}
