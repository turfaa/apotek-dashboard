import React from "react"
import Link from "next/link"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getRejectedDrugs } from "@/lib/api/rejected-drug"
import { SearchParams } from "@/types/search-params"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EditRejectedDrugDialog } from "./edit-rejected-drug-dialog"
import { DeleteRejectedDrugButton } from "./delete-rejected-drug-button"

export interface RejectedDrugsTableProps {
    searchParams: SearchParams
}

export default async function RejectedDrugsTable(
    props: RejectedDrugsTableProps,
): Promise<React.ReactElement> {
    const data = await Promise.all([auth(), props.searchParams]).then(
        ([session, params]) =>
            getRejectedDrugs(
                {
                    query: params.query,
                    resolutions: params.resolutions,
                },
                session,
            ),
    )

    return (
        <Table
            table={data}
            rowActions={[
                (id) => (
                    <Link
                        href={`/procurements/rejected-drugs/${id}`}
                        key={`view-${id}`}
                    >
                        <Button variant="ghost" size="icon">
                            <EyeIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                ),
                (id) => (
                    <EditRejectedDrugDialog
                        key={`edit-${id}`}
                        rejectedDrugId={id}
                    />
                ),
                (id) => (
                    <DeleteRejectedDrugButton
                        key={`delete-${id}`}
                        rejectedDrugId={id}
                    />
                ),
            ]}
        />
    )
}

export function RejectedDrugsTableFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableHeader>
                <TableRow>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Resolusi</TableHead>
                    <TableHead>Catatan Resolusi</TableHead>
                    <TableHead>Diselesaikan</TableHead>
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
                            <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-9 w-[120px]" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </TableComp>
    )
}
