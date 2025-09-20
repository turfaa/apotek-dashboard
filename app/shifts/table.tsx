import React from "react"
import Link from "next/link"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getShifts } from "@/lib/api/shift"
import { SearchParams } from "@/types/search-params"
import { PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export interface ShiftsTableProps {
    searchParams: SearchParams
}

export default async function ShiftsTable(
    props: ShiftsTableProps,
): Promise<React.ReactElement> {
    const data = await Promise.all([auth(), props.searchParams]).then(
        ([session, { from, until }]) => getShifts(from, until, session),
    )

    return (
        <Table
            table={data}
            rowActions={[
                (id) => (
                    <Link
                        href={`/api/shifts/${id}/show`}
                        target="_blank"
                        key={id}
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <PrinterIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Print</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Link>
                ),
            ]}
        />
    )
}

export function ShiftsTableFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableHeader>
                <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Kasir</TableHead>
                    <TableHead>Mulai</TableHead>
                    <TableHead>Selesai</TableHead>
                    <TableHead>Kas Awal</TableHead>
                    <TableHead>Kas Akhir Seharusnya</TableHead>
                    <TableHead>Kas Akhir Sebenarnya</TableHead>
                    <TableHead>Selisih</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
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
