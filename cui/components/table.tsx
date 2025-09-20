import React, { use } from "react"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Table as TableType } from "../types"

export interface TableProps {
    table: TableType
    rowActions?: RowAction[]
}

export type RowAction = (id: string) => React.ReactElement

export default function Table({
    table,
    rowActions,
}: TableProps): React.ReactElement {
    if (table.header.length == 0 && table.rows.length == 0) {
        return <></>
    }

    return (
        <TableComp>
            {table.header.length > 0 && (
                <TableHeader>
                    <TableRow>
                        {table.header.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
            )}

            {table.rows.length > 0 && (
                <TableBody>
                    {table.rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.columns.map((column, index) => (
                                <TableCell key={index}>{column}</TableCell>
                            ))}
                            {rowActions && rowActions.length > 0 && (
                                <TableCell>
                                    {rowActions.map((action) => action(row.id))}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            )}
        </TableComp>
    )
}

export interface TablePromiseProps {
    tablePromise: Promise<TableType>
    rowActions?: RowAction[]
}

export function TablePromise({
    tablePromise,
    rowActions,
}: TablePromiseProps): React.ReactElement {
    const table = use(tablePromise)
    return <Table table={table} rowActions={rowActions} />
}
