import React from "react"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getSupplierProcurementRecaps } from "@/lib/api/supplier-procurement-recap"
import { SearchParams } from "@/types/search-params"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export interface SupplierProcurementRecapsTableProps {
    searchParams: SearchParams
}

export default async function SupplierProcurementRecapsTable(
    props: SupplierProcurementRecapsTableProps,
): Promise<React.ReactElement> {
    const data = await Promise.all([auth(), props.searchParams]).then(
        ([session, params]) =>
            getSupplierProcurementRecaps(params.from, params.until, session),
    )

    return <Table table={data} />
}

export function SupplierProcurementRecapsTableFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Jumlah Faktur</TableHead>
                    <TableHead>Total Pembelian</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell />
                    <TableCell>Total</TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                </TableRow>
            </TableFooter>
        </TableComp>
    )
}
