import React, { use } from "react"
import { Text } from "@/components/typography"
import { getLastDrugSales } from "@/lib/api/last-drug-sales"
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

const DEFAULT_DRUG_SALES_LIMIT = 10

export interface LastDrugSalesTableProps {
    searchParams: SearchParams
}

export default function LastDrugSalesTable({
    searchParams,
}: LastDrugSalesTableProps): React.ReactElement {
    const { "drug-code": drugCode, limit } = use(searchParams)

    if (!drugCode) {
        return (
            <Text className="text-center py-4">
                Silakan pilih obat terlebih dahulu
            </Text>
        )
    }

    let limitNumber = DEFAULT_DRUG_SALES_LIMIT
    if (limit) {
        limitNumber = parseInt(limit)
        if (isNaN(limitNumber)) {
            limitNumber = DEFAULT_DRUG_SALES_LIMIT
        }
    }

    const session = use(auth())
    const data = use(getLastDrugSales(drugCode, limitNumber, session))

    return <Table table={data} />
}

export function LastDrugSalesTableFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableHeader>
                <TableRow>
                    <TableHead>Tanggal Penjualan</TableHead>
                    <TableHead>Nomor Faktur</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Kategori Harga</TableHead>
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
                            <Skeleton className="h-4 w-[100px]" />
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
                    </TableRow>
                ))}
            </TableBody>
        </TableComp>
    )
}
