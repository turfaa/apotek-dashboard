"use client"

import { usePurchaseOrders } from "@/lib/api/hooks"
import { ProcurementRecommendation } from "@/lib/api/procurement-recommendation"
import { usePrintMode } from "@/lib/print-mode"
import useSearch from "@/lib/search-hook"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import {
    Table,
    TableHeader,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Loading from "@/components/loading"

export interface Row {
    vmedisCode: string
    name: string
    manufacturer: string
    minimumStock: string
    stock: string
    alternatives?: string[]
    procurement: string
    supplier: string

    raw: ProcurementRecommendation
}

const columns: Column[] = [
    "no.",
    "vmedisCode",
    "name",
    "manufacturer",
    "minimumStock",
    "stock",
    "alternatives",
    "procurement",
    "supplier",
]

interface ColumnConfig {
    displayName: string
    displayInPrint?: boolean
    formatter?: (value: any) => string
    onEdit?: (
        procurement: ProcurementRecommendation,
        value: string,
    ) => ProcurementRecommendation
}

const columnConfig: Record<Column, ColumnConfig> = {
    "no.": {
        displayName: "No.",
        displayInPrint: true,
    },
    vmedisCode: {
        displayName: "Kode Obat",
    },
    name: {
        displayName: "Nama Obat",
        displayInPrint: true,
        onEdit: (procurement: ProcurementRecommendation, value: string) => ({
            ...procurement,
            drug: { ...procurement.drug, name: value },
        }),
    },
    manufacturer: {
        displayName: "Pabrik",
    },
    minimumStock: {
        displayName: "Stok Minimum",
    },
    stock: {
        displayName: "Stok",
    },
    alternatives: {
        displayName: "Alternatif",
        formatter: (value?: string[]) => value?.join(" / ") || "",
    },
    procurement: {
        displayName: "Jumlah",
        displayInPrint: true,
        onEdit: (procurement: ProcurementRecommendation, value: string) => ({
            ...procurement,
            procurement: value,
        }),
    },
    supplier: {
        displayName: "Supplier",
        onEdit: (procurement: ProcurementRecommendation, value: string) => ({
            ...procurement,
            fromSupplier: value,
        }),
    },
    raw: {
        displayName: "Raw",
    },
}

type Column = keyof Row | "no."

export default function PurchaseOrderTable(): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    useEffect(() => setSsrCompleted(true), [])

    const [enabledColumns, setEnabledColumns] = useState<Column[]>([
        "no.",
        "vmedisCode",
        "name",
        "manufacturer",
        "minimumStock",
        "stock",
        "alternatives",
        "procurement",
        "supplier",
    ])

    const { data, isLoading, error, setData, deleteData } = usePurchaseOrders()
    const { query } = useSearch()
    const { isPrintMode } = usePrintMode()

    if (isLoading || !ssrCompleted) return <Loading />

    if (error)
        return (
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <AlertTitle>Terjadi Kesalahan</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        )

    const rows: Row[] = Object.values(data || {})
        .map((procurement: ProcurementRecommendation) => ({
            vmedisCode: procurement.drug.vmedisCode,
            name: procurement.drug.name,
            manufacturer: procurement.drug.manufacturer,
            minimumStock: procurement.drug.minimumStock,
            stock: procurement.stock,
            alternatives: procurement.alternatives,
            procurement: procurement.procurement,
            supplier: procurement.fromSupplier,
            raw: procurement,
        }))
        .filter((row: Row) =>
            (row.vmedisCode + row.name + row.manufacturer + row.supplier)
                .toLowerCase()
                .includes(query.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((key) => (
                        <TableHead
                            key={key}
                            hidden={
                                !enabledColumns.includes(key) ||
                                (isPrintMode &&
                                    !columnConfig[key].displayInPrint)
                            }
                            onClick={() =>
                                setEnabledColumns(
                                    enabledColumns.filter(
                                        (column) => column != key,
                                    ),
                                )
                            }
                        >
                            {columnConfig[key].displayName}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={row.vmedisCode}>
                        {columns.map((column) => {
                            const value =
                                column === "no."
                                    ? `${index + 1}`
                                    : columnConfig[column].formatter?.(
                                          row[column],
                                      ) || row[column]?.toString()

                            return (
                                <TableCell
                                    key={column}
                                    hidden={
                                        !enabledColumns.includes(column) ||
                                        (isPrintMode &&
                                            !columnConfig[column]
                                                .displayInPrint)
                                    }
                                >
                                    {!!columnConfig[column].onEdit &&
                                    !isPrintMode ? (
                                        <Input
                                            value={value}
                                            onChange={(e) =>
                                                setData(
                                                    row.vmedisCode,
                                                    columnConfig[
                                                        column
                                                    ].onEdit?.(
                                                        row.raw,
                                                        e.target.value,
                                                    ) || row.raw,
                                                )
                                            }
                                        />
                                    ) : (
                                        value
                                    )}
                                </TableCell>
                            )
                        })}

                        <TableCell hidden={isPrintMode}>
                            <Button
                                variant="ghost"
                                color="rose"
                                onClick={() => deleteData(row.vmedisCode)}
                            >
                                Hapus
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
