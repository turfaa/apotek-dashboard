"use client"

import {
    Button,
    Callout,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    TextInput
} from "@tremor/react"
import {useProcurementRecommendations} from "@/lib/api-hook"
import {Procurement} from "@/lib/api"
import {useEffect, useState} from "react"
import useSearch from "@/app/procurement/search-hook"
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid"
import {usePrintMode} from "@/lib/print-mode";

export interface Row {
    vmedisCode: string
    name: string
    manufacturer: string
    minimumStock: string
    stock: string
    alternatives?: string[]
    procurement: string
    supplier: string

    raw: Procurement
}

const columns: Column[] = ["no.", "vmedisCode", "name", "manufacturer", "minimumStock", "stock", "alternatives", "procurement", "supplier"]

interface ColumnConfig {
    displayName: string
    displayInPrint?: boolean
    formatter?: (value: any) => string
    onEdit?: (procurement: Procurement, value: string) => Procurement
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
        onEdit: (procurement: Procurement, value: string) => ({
            ...procurement,
            drug: {...procurement.drug, name: value}
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
        onEdit: (procurement: Procurement, value: string) => ({...procurement, procurement: value}),
    },
    supplier: {
        displayName: "Supplier",
        onEdit: (procurement: Procurement, value: string) => ({...procurement, fromSupplier: value}),
    },
    raw: {
        displayName: "Raw",
    }
}

type Column = keyof Row | 'no.'

export default function ProcurementTable(): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    useEffect(() => setSsrCompleted(true), [])

    const [enabledColumns, setEnabledColumns] = useState<Column[]>(["no.", "vmedisCode", "name", "manufacturer", "minimumStock", "stock", "alternatives", "procurement", "supplier"])

    const {data, isLoading, error, setData, deleteData} = useProcurementRecommendations()
    const {query} = useSearch()
    const {isPrintMode} = usePrintMode()

    if (isLoading || !ssrCompleted) return <Text>Loading...</Text>

    if (error) return (
        <Callout
            className="h-12 mt-4"
            title={error.message}
            icon={ExclamationTriangleIcon}
            color="rose"
        />
    )

    const rows: Row[] = Object.values(data || {}).map((procurement: Procurement) => ({
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
                .includes(query.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((key) => (
                                <TableHeaderCell key={key}
                                                 hidden={!enabledColumns.includes(key) || (isPrintMode && !columnConfig[key].displayInPrint)}
                                                 onClick={() => setEnabledColumns(enabledColumns.filter(column => column != key))}>
                                    <Text
                                        onClick={() => setEnabledColumns(enabledColumns.filter(column => column != key))}
                                    >
                                        {columnConfig[key].displayName}
                                    </Text>
                                </TableHeaderCell>
                            )
                        )}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.vmedisCode}>
                            {columns.map((column) => {
                                const value =
                                    column === "no." ?
                                        `${index + 1}` :
                                        columnConfig[column].formatter?.(row[column]) || row[column]?.toString()

                                return (
                                    <TableCell key={column}
                                               hidden={!enabledColumns.includes(column) || (isPrintMode && !columnConfig[column].displayInPrint)}>
                                        {!!columnConfig[column].onEdit && !isPrintMode ?
                                            <TextInput
                                                value={value}
                                                onChange={(e) =>
                                                    setData(row.vmedisCode, columnConfig[column].onEdit?.(row.raw, e.target.value) || row.raw)
                                                }
                                            />
                                            : value
                                        }
                                    </TableCell>
                                )
                            })}

                            <TableCell hidden={isPrintMode}>
                                <Button
                                    variant="light"
                                    size="xs"
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
        </>
    )
}