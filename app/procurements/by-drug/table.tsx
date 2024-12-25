import React, { use } from "react"
import { Text } from "@/components/typography"
import { getLastDrugProcurements } from "@/lib/api/last-drug-procurements"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { SearchParams } from "@/types/search-params"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_DRUG_PROCUREMENTS_LIMIT = 5

export interface LastDrugProcurementsTableProps {
    searchParams: SearchParams
}

export default function LastDrugProcurementsTable({
    searchParams,
}: LastDrugProcurementsTableProps): React.ReactElement {
    const { "drug-code": drugCode, limit } = use(searchParams)

    if (!drugCode) {
        return <Text>Silakan pilih obat terlebih dahulu</Text>
    }

    let limitNumber = DEFAULT_DRUG_PROCUREMENTS_LIMIT
    if (limit) {
        limitNumber = parseInt(limit)
        if (isNaN(limitNumber)) {
            limitNumber = DEFAULT_DRUG_PROCUREMENTS_LIMIT
        }
    }

    const session = use(auth())
    const data = use(getLastDrugProcurements(
        drugCode,
        limitNumber,
        session,
    ))

    return <Table table={data} />
}

export function LastDrugProcurementsTableFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableHeader>
                <TableRow>
                    <TableHead>Tanggal Diinput</TableHead>
                    <TableHead>Nomor Faktur</TableHead>
                    <TableHead>Tanggal Faktur</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead>Supplier</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </TableComp>
    )
}
