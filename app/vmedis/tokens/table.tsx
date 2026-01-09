import React from "react"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getTokens } from "@/lib/api/token"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeleteTokenButton } from "./delete-token-button"

export default async function TokensTable(): Promise<React.ReactElement> {
    const session = await auth()
    const data = await getTokens(session)

    return (
        <Table
            table={data}
            rowActions={[(id) => <DeleteTokenButton key={id} tokenId={id} />]}
        />
    )
}

export function TokensTableFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableHeader>
                <TableRow>
                    <TableHead>Diinput</TableHead>
                    <TableHead>Terakhir Diperbarui</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-9 w-9" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </TableComp>
    )
}
