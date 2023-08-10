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
} from "@tremor/react";
import {useProcurementRecommendations} from "@/lib/api-hook";
import {Procurement} from "@/lib/api";
import {useEffect, useState} from "react";
import useSearch from "@/app/procurement/search-hook";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";

export interface Row {
    vmedisCode: string
    name: string
    manufacturer: string
    minimumStock: string
    stock: string
    alternatives?: string[]
    procurement: string
    supplier: string
}

const columns: Column[] = ["no.", "vmedisCode", "name", "manufacturer", "minimumStock", "stock", "alternatives", "procurement", "supplier"]

interface ColumnConfig {
    displayName: string
    editable: boolean
    formatter?: (value: any) => string
}

const columnConfig: Record<Column, ColumnConfig> = {
    "no.": {
        displayName: "No.",
        editable: false,
    },
    vmedisCode: {
        displayName: "Kode Obat",
        editable: false,
    },
    name: {
        displayName: "Nama Obat",
        editable: true,
    },
    manufacturer: {
        displayName: "Pabrik",
        editable: false,
    },
    minimumStock: {
        displayName: "Stok Minimum",
        editable: false,
    },
    stock: {
        displayName: "Stok",
        editable: false,
    },
    alternatives: {
        displayName: "Alternatif",
        editable: false,
        formatter: (value?: string[]) => value?.join(" / ") || "",
    },
    procurement: {
        displayName: "Pengadaan",
        editable: true,
    },
    supplier: {
        displayName: "Supplier",
        editable: true,
    },
}

type Column = keyof Row | 'no.'

export default function ProcurementTable(): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false);
    useEffect(() => setSsrCompleted(true), []);

    const [enabledColumns, setEnabledColumns] = useState<Column[]>(["no.", "vmedisCode", "name", "manufacturer", "minimumStock", "stock", "alternatives", "procurement", "supplier"])

    const {data, isLoading, error, deleteData} = useProcurementRecommendations()
    const {query} = useSearch()

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
    }))
        .filter((row: Row) =>
            (row.vmedisCode + row.name + row.manufacturer + row.supplier)
                .toLowerCase()
                .includes(query.toLowerCase())
        )

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((key) => (
                                <TableHeaderCell key={key} hidden={!enabledColumns.includes(key)}
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
                                    <TableCell key={column} hidden={!enabledColumns.includes(column)}>
                                        {columnConfig[column].editable ?
                                            <TextInput
                                                value={value}
                                            />
                                            : value
                                        }
                                    </TableCell>
                                )
                            })}

                            <TableCell>
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